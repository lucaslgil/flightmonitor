-- Adiciona colunas para faixa de preço
ALTER TABLE flights_to_monitor 
  ADD COLUMN IF NOT EXISTS min_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS max_price DECIMAL(10,2);

-- Migra dados existentes de target_price para max_price
UPDATE flights_to_monitor 
SET max_price = target_price 
WHERE target_price IS NOT NULL AND max_price IS NULL;

-- Comentário: target_price será mantido por compatibilidade mas usaremos min_price/max_price como principal
