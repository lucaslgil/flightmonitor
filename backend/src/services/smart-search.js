import { searchFlightOffers } from './amadeus.js';
import { convertCurrency } from './currency.js';

/**
 * Estratégias para encontrar voos mais baratos
 */

/**
 * Busca voos em datas flexíveis (±3 dias)
 */
export async function searchFlexibleDates(params) {
  const { departureDate, returnDate, ...otherParams } = params;
  const results = [];

  // Datas ao redor da data original
  const departureDates = getDateRange(departureDate, 3);
  const returnDates = returnDate ? getDateRange(returnDate, 3) : [null];

  console.log(`🔍 Buscando em ${departureDates.length}x${returnDates.length} combinações de datas...`);

  for (const depDate of departureDates) {
    for (const retDate of returnDates) {
      try {
        const offers = await searchFlightOffers({
          ...otherParams,
          departureDate: depDate,
          returnDate: retDate,
          max: 5 // Apenas top 5 de cada combinação
        });

        if (offers.length > 0) {
          const cheapest = offers[0]; // Já vem ordenado por preço
          results.push({
            departureDate: depDate,
            returnDate: retDate,
            price: cheapest.price.totalBRL,
            currency: 'BRL',
            originalPrice: cheapest.price.total,
            originalCurrency: cheapest.price.currency,
            offer: cheapest,
            savings: null // Calculado depois
          });
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar ${depDate} - ${retDate}:`, error.message);
      }
    }
  }

  // Ordena por preço
  results.sort((a, b) => a.price - b.price);

  // Calcula economia em relação à data original
  const originalDateResult = results.find(
    r => r.departureDate === departureDate && r.returnDate === returnDate
  );
  
  if (originalDateResult) {
    const originalPrice = originalDateResult.price;
    results.forEach(r => {
      r.savings = originalPrice - r.price;
      r.savingsPercent = ((r.savings / originalPrice) * 100).toFixed(1);
    });
  }

  return results;
}

/**
 * Busca voos em aeroportos alternativos próximos
 */
export async function searchNearbyAirports(params) {
  const { originLocationCode, destinationLocationCode, ...otherParams } = params;
  
  // Aeroportos alternativos comuns
  const nearbyAirports = {
    'GRU': ['CGH', 'VCP'], // São Paulo: Congonhas, Viracopos
    'GIG': ['SDU'], // Rio: Santos Dumont
    'MAD': ['MAD'], // Madrid
    'BCN': ['GRO', 'REU'], // Barcelona: Girona, Reus
    'NYC': ['JFK', 'EWR', 'LGA'], // Nova York
    'LON': ['LHR', 'LGW', 'STN', 'LTN'], // Londres
    'PAR': ['CDG', 'ORY'], // Paris
    'MIL': ['MXP', 'LIN', 'BGY'], // Milão
    'ROM': ['FCO', 'CIA'], // Roma
  };

  const origins = [originLocationCode, ...(nearbyAirports[originLocationCode] || [])];
  const destinations = [destinationLocationCode, ...(nearbyAirports[destinationLocationCode] || [])];
  
  const results = [];

  console.log(`🔍 Buscando em ${origins.length}x${destinations.length} combinações de aeroportos...`);

  for (const origin of origins) {
    for (const destination of destinations) {
      if (origin === originLocationCode && destination === destinationLocationCode) {
        continue; // Pula a combinação original (já foi buscada)
      }

      try {
        const offers = await searchFlightOffers({
          ...otherParams,
          originLocationCode: origin,
          destinationLocationCode: destination,
          max: 3
        });

        if (offers.length > 0) {
          const cheapest = offers[0];
          results.push({
            origin,
            destination,
            price: cheapest.price.totalBRL,
            currency: 'BRL',
            originalPrice: cheapest.price.total,
            originalCurrency: cheapest.price.currency,
            offer: cheapest
          });
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar ${origin} → ${destination}:`, error.message);
      }
    }
  }

  return results.sort((a, b) => a.price - b.price);
}

/**
 * Busca voos com diferentes classes de serviço
 */
export async function searchDifferentClasses(params) {
  const classes = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];
  const results = [];

  console.log(`🔍 Buscando em ${classes.length} classes de serviço...`);

  for (const travelClass of classes) {
    try {
      const offers = await searchFlightOffers({
        ...params,
        travelClass,
        max: 3
      });

      if (offers.length > 0) {
        const cheapest = offers[0];
        results.push({
          class: travelClass,
          price: cheapest.price.totalBRL,
          currency: 'BRL',
          originalPrice: cheapest.price.total,
          originalCurrency: cheapest.price.currency,
          offer: cheapest
        });
      }
    } catch (error) {
      console.log(`⚠️ Erro ao buscar classe ${travelClass}:`, error.message);
    }
  }

  return results;
}

/**
 * Busca completa - combina todas as estratégias
 */
export async function findCheapestFlights(params) {
  console.log('🚀 Iniciando busca inteligente de voos mais baratos...');
  
  const results = {
    original: null,
    flexibleDates: [],
    nearbyAirports: [],
    differentClasses: [],
    bestOverall: null
  };

  try {
    // 1. Busca original
    console.log('1️⃣ Buscando voo original...');
    const originalOffers = await searchFlightOffers({ ...params, max: 1 });
    if (originalOffers.length > 0) {
      results.original = {
        price: originalOffers[0].price.totalBRL,
        currency: 'BRL',
        offer: originalOffers[0]
      };
    }

    // 2. Datas flexíveis (apenas se não for muito próximo)
    const departureDate = new Date(params.departureDate);
    const daysUntilDeparture = Math.floor((departureDate - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeparture > 7) {
      console.log('2️⃣ Buscando datas flexíveis...');
      results.flexibleDates = await searchFlexibleDates(params);
    }

    // 3. Aeroportos alternativos
    console.log('3️⃣ Buscando aeroportos próximos...');
    results.nearbyAirports = await searchNearbyAirports(params);

    // 4. Classes diferentes
    console.log('4️⃣ Buscando classes de serviço...');
    results.differentClasses = await searchDifferentClasses(params);

    // 5. Encontra a melhor opção geral
    const allOptions = [
      results.original,
      ...results.flexibleDates,
      ...results.nearbyAirports,
      ...results.differentClasses
    ].filter(Boolean);

    if (allOptions.length > 0) {
      results.bestOverall = allOptions.reduce((min, curr) => 
        curr.price < min.price ? curr : min
      );

      if (results.original) {
        const savings = results.original.price - results.bestOverall.price;
        results.bestOverall.savings = savings;
        results.bestOverall.savingsPercent = ((savings / results.original.price) * 100).toFixed(1);
      }
    }

    console.log('✅ Busca inteligente concluída!');
    return results;

  } catch (error) {
    console.error('❌ Erro na busca inteligente:', error);
    throw error;
  }
}

/**
 * Gera array de datas ao redor de uma data central
 */
function getDateRange(dateString, days) {
  const dates = [];
  const centerDate = new Date(dateString);

  for (let i = -days; i <= days; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

/**
 * Formata resultado para exibição
 */
export function formatSearchResults(results) {
  return {
    summary: {
      totalOptions: (results.flexibleDates?.length || 0) + 
                   (results.nearbyAirports?.length || 0) + 
                   (results.differentClasses?.length || 0),
      originalPrice: results.original?.price,
      bestPrice: results.bestOverall?.price,
      savings: results.bestOverall?.savings,
      savingsPercent: results.bestOverall?.savingsPercent
    },
    recommendations: {
      bestDeal: results.bestOverall,
      flexibleDates: results.flexibleDates?.slice(0, 5),
      nearbyAirports: results.nearbyAirports?.slice(0, 3),
      differentClasses: results.differentClasses
    }
  };
}
