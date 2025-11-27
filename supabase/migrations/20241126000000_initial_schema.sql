-- Tabela de voos monitorados
CREATE TABLE IF NOT EXISTS flights_to_monitor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  infants INTEGER NOT NULL DEFAULT 0,
  travel_class VARCHAR(20) NOT NULL DEFAULT 'ECONOMY',
  target_price DECIMAL(10,2),
  notification_email VARCHAR(255) NOT NULL,
  notification_telegram_chat_id VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  last_price DECIMAL(10,2),
  lowest_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_flights_active ON flights_to_monitor(is_active);
CREATE INDEX IF NOT EXISTS idx_flights_dates ON flights_to_monitor(departure_date, return_date);

-- Tabela de histórico de preços
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id UUID NOT NULL REFERENCES flights_to_monitor(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
  offer_data JSONB,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_price_history_flight ON price_history(flight_id);
CREATE INDEX IF NOT EXISTS idx_price_history_checked ON price_history(checked_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_flights_updated_at
BEFORE UPDATE ON flights_to_monitor
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - opcional, descomente se quiser adicionar autenticação
-- ALTER TABLE flights_to_monitor ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view their own flights"
--   ON flights_to_monitor FOR SELECT
--   USING (auth.email() = notification_email);

-- CREATE POLICY "Users can insert their own flights"
--   ON flights_to_monitor FOR INSERT
--   WITH CHECK (auth.email() = notification_email);
