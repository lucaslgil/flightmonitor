import TelegramBot from 'node-telegram-bot-api';

let bot = null;

if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  console.log('✅ Telegram bot initialized');
}

export async function sendTelegramAlert({
  chatId,
  flightData,
  currentPrice,
  previousPrice,
  targetPrice
}) {
  if (!bot) {
    console.warn('⚠️ Telegram bot not configured');
    return false;
  }

  const priceChange = previousPrice ? currentPrice - previousPrice : 0;
  const changePercent = previousPrice ? ((priceChange / previousPrice) * 100).toFixed(1) : 0;
  const isDecrease = priceChange < 0;

  const message = `
✈️ *Alerta de Voo*

🛫 ${flightData.origin} → ${flightData.destination}
📅 ${new Date(flightData.departureDate).toLocaleDateString('pt-BR')}
${flightData.returnDate ? `🔄 ${new Date(flightData.returnDate).toLocaleDateString('pt-BR')}` : ''}

💰 *Preço Atual:* ${flightData.currency} ${currentPrice.toFixed(2)}
${previousPrice ? `${isDecrease ? '📉' : '📈'} *Variação:* ${isDecrease ? '' : '+'}${priceChange.toFixed(2)} (${changePercent}%)` : ''}

${targetPrice && currentPrice <= targetPrice ? '🎯 *Preço-alvo atingido!*' : ''}

👥 ${flightData.adults} passageiro(s) | ${flightData.travelClass}
  `.trim();

  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log(`✅ Telegram sent to ${chatId}`);
    return true;
  } catch (error) {
    console.error('❌ Telegram error:', error);
    return false;
  }
}
