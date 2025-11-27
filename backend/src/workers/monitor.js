import cron from 'node-cron';
import { getActiveFlights, addPriceHistory, updateFlight } from '../models/Flight.js';
import { getLowestPrice } from '../services/amadeus.js';
import { sendPriceAlert } from '../services/email.js';
import { sendTelegramAlert } from '../services/telegram.js';

const DEFAULT_CRON = process.env.CRON_SCHEDULE || '*/30 * * * *'; // A cada 30 minutos

/**
 * Verifica o preço de um voo específico
 */
export async function checkFlightPrice(flight) {
  console.log(`🔍 Checking flight ${flight.id}: ${flight.origin} → ${flight.destination}`);

  try {
    const result = await getLowestPrice({
      originLocationCode: flight.origin,
      destinationLocationCode: flight.destination,
      departureDate: flight.departure_date,
      returnDate: flight.return_date,
      adults: flight.adults,
      children: flight.children,
      infants: flight.infants,
      travelClass: flight.travel_class
    });

    if (!result) {
      console.log(`⚠️ No offers found for flight ${flight.id}`);
      return { success: false, message: 'No offers found' };
    }

    const { price, currency, offer } = result;

    // Salvar no histórico
    await addPriceHistory(flight.id, price, currency, offer);

    // Atualizar voo
    const updates = {
      last_checked_at: new Date().toISOString(),
      last_price: price
    };

    if (!flight.lowest_price || price < flight.lowest_price) {
      updates.lowest_price = price;
    }

    await updateFlight(flight.id, updates);

    // Verificar se deve notificar
    const shouldNotify = checkShouldNotify(flight, price);

    if (shouldNotify) {
      await sendNotifications(flight, price, currency);
      console.log(`📧 Notifications sent for flight ${flight.id}`);
    }

    console.log(`✅ Flight ${flight.id} checked: ${currency} ${price}`);

    return {
      success: true,
      price,
      currency,
      shouldNotify,
      offer
    };
  } catch (error) {
    console.error(`❌ Error checking flight ${flight.id}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Determina se deve enviar notificação
 */
function checkShouldNotify(flight, currentPrice) {
  // Se tiver faixa de preço definida (min/max)
  if (flight.min_price && flight.max_price) {
    // Notifica se estiver dentro da faixa
    if (currentPrice >= flight.min_price && currentPrice <= flight.max_price) {
      return true;
    }
  }
  // Fallback: Se tiver apenas max_price ou target_price
  else if (flight.max_price && currentPrice <= flight.max_price) {
    return true;
  }
  else if (flight.target_price && currentPrice <= flight.target_price) {
    return true;
  }

  // Se preço caiu em relação ao último
  if (flight.last_price && currentPrice < flight.last_price) {
    const decrease = ((flight.last_price - currentPrice) / flight.last_price) * 100;
    // Notifica se caiu mais de 5%
    if (decrease >= 5) {
      return true;
    }
  }

  return false;
}

/**
 * Envia notificações
 */
async function sendNotifications(flight, currentPrice, currency) {
  const flightData = {
    origin: flight.origin,
    destination: flight.destination,
    departureDate: flight.departure_date,
    returnDate: flight.return_date,
    adults: flight.adults,
    travelClass: flight.travel_class,
    currency
  };

  // Email
  if (flight.notification_email) {
    try {
      await sendPriceAlert({
        to: flight.notification_email,
        flightData,
        currentPrice,
        previousPrice: flight.last_price,
        targetPrice: flight.target_price
      });
    } catch (error) {
      console.error('Email notification error:', error);
    }
  }

  // Telegram
  if (flight.notification_telegram_chat_id) {
    try {
      await sendTelegramAlert({
        chatId: flight.notification_telegram_chat_id,
        flightData,
        currentPrice,
        previousPrice: flight.last_price,
        targetPrice: flight.target_price
      });
    } catch (error) {
      console.error('Telegram notification error:', error);
    }
  }
}

/**
 * Tarefa principal do worker
 */
async function monitorFlights() {
  console.log('🔄 Running flight monitoring worker...');
  console.log(`⏰ Current time: ${new Date().toLocaleString('pt-BR')}`);

  try {
    const flights = await getActiveFlights();
    console.log(`📋 Found ${flights.length} active flights to check`);

    if (flights.length === 0) {
      console.log('ℹ️ No active flights to monitor. Create a flight on the dashboard to start monitoring.');
      return;
    }

    for (const flight of flights) {
      await checkFlightPrice(flight);
      // Pequeno delay entre requisições
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('✅ Monitoring cycle completed');
  } catch (error) {
    console.error('❌ Worker error:', error);
  }
}

/**
 * Inicia o worker com cron
 */
export function startMonitoringWorker() {
  const schedule = DEFAULT_CRON;
  console.log(`📅 Starting monitoring worker with schedule: ${schedule}`);
  console.log(`ℹ️  Schedule explanation: Checks every 30 minutes`);
  
  // Executar imediatamente ao iniciar (após 5 segundos para dar tempo do servidor inicializar)
  setTimeout(() => {
    console.log('🚀 Running initial monitoring check...');
    monitorFlights();
  }, 5000);

  // Agendar execuções periódicas
  cron.schedule(schedule, monitorFlights);
  
  console.log('✅ Monitoring worker scheduled');
}
