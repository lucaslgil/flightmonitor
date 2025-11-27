// Cache de taxas de câmbio
const exchangeRateCache = {
  rates: {},
  timestamp: null,
  TTL: 3600000 // 1 hora
};

/**
 * Busca taxas de câmbio atualizadas (API gratuita)
 */
async function fetchExchangeRates() {
  try {
    // Usando API gratuita do Banco Central do Brasil
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    exchangeRateCache.rates = data.rates;
    exchangeRateCache.timestamp = Date.now();
    
    console.log('✅ Exchange rates updated');
    return data.rates;
  } catch (error) {
    console.error('❌ Error fetching exchange rates:', error.message);
    
    // Taxas de fallback (aproximadas)
    return {
      BRL: 5.80,
      EUR: 0.92,
      GBP: 0.79,
      USD: 1.00
    };
  }
}

/**
 * Converte valor de uma moeda para outra
 */
export async function convertCurrency(amount, fromCurrency, toCurrency = 'BRL') {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Verifica se precisa atualizar cache
  const now = Date.now();
  if (!exchangeRateCache.timestamp || now - exchangeRateCache.timestamp > exchangeRateCache.TTL) {
    await fetchExchangeRates();
  }

  const rates = exchangeRateCache.rates;

  // Converte para USD primeiro (moeda base)
  const amountInUSD = fromCurrency === 'USD' 
    ? amount 
    : amount / (rates[fromCurrency] || 1);

  // Converte de USD para moeda desejada
  const convertedAmount = toCurrency === 'USD' 
    ? amountInUSD 
    : amountInUSD * (rates[toCurrency] || 1);

  return parseFloat(convertedAmount.toFixed(2));
}

/**
 * Formata valor em BRL
 */
export function formatBRL(amount) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

/**
 * Converte e formata para BRL
 */
export async function convertAndFormatToBRL(amount, fromCurrency) {
  const brlAmount = await convertCurrency(amount, fromCurrency, 'BRL');
  return {
    value: brlAmount,
    formatted: formatBRL(brlAmount),
    original: {
      value: amount,
      currency: fromCurrency
    }
  };
}

// Inicializa cache ao carregar módulo
fetchExchangeRates();

// Atualiza taxas a cada hora
setInterval(fetchExchangeRates, exchangeRateCache.TTL);
