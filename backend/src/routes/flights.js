import express from 'express';
import {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  getPriceHistory,
  getFlightStats
} from '../models/Flight.js';
import { getLowestPrice, searchLocations, searchFlightOffers } from '../services/amadeus.js';
import { checkFlightPrice } from '../workers/monitor.js';
import { findCheapestFlights, formatSearchResults } from '../services/smart-search.js';

const router = express.Router();

// GET /api/flights/airports/search - Buscar aeroportos
router.get('/airports/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const locations = await searchLocations(q);
  res.json(locations);
});

// POST /api/flights/search/smart - Busca inteligente de voos mais baratos
router.post('/search/smart', async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults = 1,
      children = 0,
      infants = 0,
      travelClass = 'ECONOMY'
    } = req.body;

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['originLocationCode', 'destinationLocationCode', 'departureDate']
      });
    }

    console.log('🔍 Smart search request:', req.body);

    const results = await findCheapestFlights({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass
    });

    const formatted = formatSearchResults(results);
    res.json(formatted);

  } catch (error) {
    console.error('❌ Smart search error:', error);
    res.status(500).json({ 
      error: 'Failed to perform smart search', 
      message: error.message 
    });
  }
});

// GET /api/flights/:id/offers - Buscar ofertas em tempo real
router.get('/:id/offers', async (req, res) => {
  const flight = await getFlightById(req.params.id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  try {
    const offers = await searchFlightOffers({
      originLocationCode: flight.origin,
      destinationLocationCode: flight.destination,
      departureDate: flight.departure_date.split('T')[0],
      returnDate: flight.return_date ? flight.return_date.split('T')[0] : null,
      adults: flight.adults || 1,
      children: flight.children || 0,
      infants: flight.infants || 0,
      travelClass: flight.travel_class || 'ECONOMY',
      max: 20
    });

    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers', message: error.message });
  }
});

// GET /api/flights - Listar todos os voos
router.get('/', async (req, res) => {
  const flights = await getAllFlights();
  res.json(flights);
});

// POST /api/flights - Criar novo monitoramento
router.post('/', async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    targetPrice,
    notificationEmail,
    notificationTelegramChatId
  } = req.body;

  // Validação
  if (!origin || !destination || !departureDate || !notificationEmail) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['origin', 'destination', 'departureDate', 'notificationEmail']
    });
  }

  const flight = await createFlight({
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    targetPrice,
    notificationEmail,
    notificationTelegramChatId
  });

  res.status(201).json(flight);
});

// GET /api/flights/:id - Detalhes do voo
router.get('/:id', async (req, res) => {
  const flight = await getFlightById(req.params.id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  res.json(flight);
});

// PUT /api/flights/:id - Atualizar voo
router.put('/:id', async (req, res) => {
  const flight = await getFlightById(req.params.id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  const allowedUpdates = [
    'target_price',
    'min_price',
    'max_price',
    'notification_email',
    'notification_telegram_chat_id',
    'is_active'
  ];

  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  const updated = await updateFlight(req.params.id, updates);
  res.json(updated);
});

// DELETE /api/flights/:id - Deletar voo
router.delete('/:id', async (req, res) => {
  const flight = await getFlightById(req.params.id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  await deleteFlight(req.params.id);
  res.json({ message: 'Flight deleted successfully' });
});

// POST /api/flights/:id/check - Forçar verificação de preço
router.post('/:id/check', async (req, res) => {
  const flight = await getFlightById(req.params.id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  const result = await checkFlightPrice(flight);
  res.json(result);
});

// GET /api/flights/:id/history - Histórico de preços
router.get('/:id/history', async (req, res) => {
  const flight = await getFlightById(req.params.id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  const limit = parseInt(req.query.limit) || 100;
  const history = await getPriceHistory(req.params.id, limit);
  
  res.json(history);
});

// GET /api/flights/:id/stats - Estatísticas
router.get('/:id/stats', async (req, res) => {
  const flight = await getFlightById(req.params.id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  const stats = await getFlightStats(req.params.id);
  
  if (!stats) {
    return res.json({
      message: 'No price history available yet',
      flight
    });
  }

  res.json({
    flight,
    stats
  });
});

export default router;
