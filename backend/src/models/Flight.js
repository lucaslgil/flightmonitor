import { supabase } from '../config/supabase.js';

export async function createFlight(data) {
  const { data: flight, error } = await supabase
    .from('flights_to_monitor')
    .insert({
      origin: data.origin,
      destination: data.destination,
      departure_date: data.departureDate,
      return_date: data.returnDate || null,
      adults: data.adults || 1,
      children: data.children || 0,
      infants: data.infants || 0,
      travel_class: data.travelClass || 'ECONOMY',
      target_price: data.targetPrice || null,
      min_price: data.minPrice || null,
      max_price: data.maxPrice || null,
      notification_email: data.notificationEmail,
      notification_telegram_chat_id: data.notificationTelegramChatId || null,
      is_active: true,
      last_checked_at: null,
      last_price: null,
      lowest_price: null
    })
    .select()
    .single();

  if (error) throw error;
  return flight;
}

export async function getAllFlights() {
  const { data, error } = await supabase
    .from('flights_to_monitor')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getFlightById(id) {
  const { data, error } = await supabase
    .from('flights_to_monitor')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateFlight(id, updates) {
  const { data, error } = await supabase
    .from('flights_to_monitor')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFlight(id) {
  const { error } = await supabase
    .from('flights_to_monitor')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getActiveFlights() {
  const { data, error } = await supabase
    .from('flights_to_monitor')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

export async function addPriceHistory(flightId, price, currency, offerData = null) {
  const { data, error } = await supabase
    .from('price_history')
    .insert({
      flight_id: flightId,
      price,
      currency,
      offer_data: offerData
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPriceHistory(flightId, limit = 100) {
  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('flight_id', flightId)
    .order('checked_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getFlightStats(flightId) {
  const history = await getPriceHistory(flightId);

  if (history.length === 0) {
    return null;
  }

  const prices = history.map(h => h.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const current = history[0].price;

  return {
    current,
    lowest,
    highest,
    average: parseFloat(average.toFixed(2)),
    currency: history[0].currency,
    totalChecks: history.length,
    lastChecked: history[0].checked_at
  };
}
