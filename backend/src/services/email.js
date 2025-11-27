import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendPriceAlert({
  to,
  flightData,
  currentPrice,
  previousPrice,
  targetPrice
}) {
  const priceChange = previousPrice ? currentPrice - previousPrice : 0;
  const changePercent = previousPrice ? ((priceChange / previousPrice) * 100).toFixed(1) : 0;
  const isDecrease = priceChange < 0;
  
  const subject = isDecrease 
    ? `✈️ Preço caiu! ${flightData.origin} → ${flightData.destination}`
    : `✈️ Alerta de Preço - ${flightData.origin} → ${flightData.destination}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
        .price-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .price { font-size: 48px; font-weight: bold; color: ${isDecrease ? '#10b981' : '#ef4444'}; }
        .change { font-size: 20px; color: ${isDecrease ? '#10b981' : '#ef4444'}; font-weight: bold; }
        .flight-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .route { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .detail { margin: 8px 0; }
        .label { font-weight: bold; color: #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Alerta de Preço de Voo</h1>
        </div>
        <div class="content">
          <div class="flight-info">
            <div class="route">${flightData.origin} ✈️ ${flightData.destination}</div>
            <div class="detail"><span class="label">Data:</span> ${new Date(flightData.departureDate).toLocaleDateString('pt-BR')}</div>
            ${flightData.returnDate ? `<div class="detail"><span class="label">Volta:</span> ${new Date(flightData.returnDate).toLocaleDateString('pt-BR')}</div>` : ''}
            <div class="detail"><span class="label">Passageiros:</span> ${flightData.adults} adulto(s)</div>
            <div class="detail"><span class="label">Classe:</span> ${flightData.travelClass}</div>
          </div>

          <div class="price-box">
            <div class="price">${flightData.currency} ${currentPrice.toFixed(2)}</div>
            ${previousPrice ? `
              <div class="change">
                ${isDecrease ? '📉' : '📈'} ${isDecrease ? '' : '+'}${priceChange.toFixed(2)} (${changePercent}%)
              </div>
            ` : ''}
            ${targetPrice && currentPrice <= targetPrice ? `
              <div style="margin-top: 15px; padding: 10px; background: #10b981; color: white; border-radius: 5px;">
                🎯 Preço-alvo atingido!
              </div>
            ` : ''}
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666;">
            <small>Você está recebendo este email porque configurou monitoramento para este voo.</small>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Flight Monitor" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
}
