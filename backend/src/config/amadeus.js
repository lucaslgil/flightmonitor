import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.AMADEUS_CLIENT_ID;
const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
const hostname = process.env.AMADEUS_ENV === 'production' ? 'production' : 'test';

if (!clientId || !clientSecret) {
  throw new Error('Missing Amadeus credentials. Check your .env file.');
}

export const amadeus = new Amadeus({
  clientId,
  clientSecret,
  hostname
});

console.log(`✅ Amadeus client initialized (${hostname} environment)`);
