import { amadeus } from '../config/amadeus.js';
import { searchAirports } from './airports-data.js';
import { convertCurrency } from './currency.js';

const cache = new Map();
const CACHE_TTL = parseInt(process.env.CACHE_TTL_MINUTES || '30') * 60 * 1000;

/**
 * Busca aeroportos/cidades por keyword
 */
export async function searchLocations(keyword) {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  const cacheKey = `location_${keyword.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Tenta usar a API do Amadeus primeiro
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'AIRPORT,CITY'
    });

    const locations = response.data.map(location => ({
      iataCode: location.iataCode,
      name: location.name,
      city: location.address?.cityName || '',
      country: location.address?.countryName || '',
      type: location.subType,
      label: `${location.iataCode} - ${location.name}${location.address?.cityName ? ', ' + location.address.cityName : ''}`
    }));

    cache.set(cacheKey, { data: locations, timestamp: Date.now() });
    console.log(`✅ Found ${locations.length} airports via Amadeus API`);
    return locations;
  } catch (error) {
    console.log('🔄 Using local airport database (Amadeus API not available)');
    
    // Usa banco de dados local como fallback
    const results = searchAirports(keyword);
    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  }
}

/**
 * Busca ofertas de voo no Amadeus
 */
export async function searchFlightOffers({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  returnDate = null,
  adults = 1,
  children = 0,
  infants = 0,
  travelClass = 'ECONOMY',
  max = 10
}) {
  const cacheKey = JSON.stringify({
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass
  });

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('✅ Cache hit for flight search');
    return cached.data;
  }

  const params = {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    max,
    travelClass
  };

  if (returnDate) params.returnDate = returnDate;
  if (children > 0) params.children = children;
  if (infants > 0) params.infants = infants;

  try {
    console.log('🔍 Searching flights:', params);
    const response = await amadeus.shopping.flightOffersSearch.get(params);
    
    const offers = await Promise.all(response.data.map(async offer => {
      const priceInBRL = await convertCurrency(
        parseFloat(offer.price.total),
        offer.price.currency,
        'BRL'
      );

      return {
        id: offer.id,
        price: {
          total: parseFloat(offer.price.total),
          currency: offer.price.currency,
          totalBRL: priceInBRL
        },
        itineraries: offer.itineraries.map(itinerary => ({
          duration: itinerary.duration,
          segments: itinerary.segments.map(segment => ({
            departure: {
              iataCode: segment.departure.iataCode,
              terminal: segment.departure.terminal,
              at: segment.departure.at
            },
            arrival: {
              iataCode: segment.arrival.iataCode,
              terminal: segment.arrival.terminal,
              at: segment.arrival.at
            },
            carrierCode: segment.carrierCode,
            carrierName: segment.operating?.carrierCode || segment.carrierCode,
            number: segment.number,
            aircraft: segment.aircraft?.code,
            duration: segment.duration,
            numberOfStops: segment.numberOfStops || 0,
            blacklistedInEU: segment.blacklistedInEU || false
          }))
        })),
        validatingAirlineCodes: offer.validatingAirlineCodes,
        numberOfBookableSeats: offer.numberOfBookableSeats
      };
    }));

    // Cache result
    cache.set(cacheKey, {
      data: offers,
      timestamp: Date.now()
    });

    console.log(`✅ Found ${offers.length} offers`);
    return offers;
  } catch (error) {
    console.error('❌ Amadeus API error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Retorna o menor preço encontrado
 */
export async function getLowestPrice(searchParams) {
  const offers = await searchFlightOffers(searchParams);
  
  if (offers.length === 0) {
    return null;
  }

  const lowest = offers.reduce((min, offer) => 
    offer.price.totalBRL < min.price.totalBRL ? offer : min
  );

  return {
    price: lowest.price.totalBRL,
    currency: 'BRL',
    originalPrice: lowest.price.total,
    originalCurrency: lowest.price.currency,
    offer: lowest
  };
}

/**
 * Limpa cache antigo
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}, CACHE_TTL);
