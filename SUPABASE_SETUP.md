# 🚀 Setup Supabase - Guia Rápido

## Passo 1: Criar Conta Supabase

1. Acesse: https://supabase.com
2. Clique em **Start your project**
3. Faça login com GitHub

## Passo 2: Criar Novo Projeto

1. Clique em **New Project**
2. Preencha:
   - **Name:** `flight-monitor`
   - **Database Password:** (escolha uma senha forte e **anote**)
   - **Region:** South America (São Paulo) - mais próximo
   - **Pricing Plan:** Free (suficiente para desenvolvimento)
3. Clique em **Create new project**
4. Aguarde ~2 minutos (criação do banco)

## Passo 3: Obter Credenciais

1. No painel do projeto, vá em **Settings** (⚙️) → **API**
2. Você verá:

```
Project URL
https://xxxxxxxxxxxxx.supabase.co

Project API keys
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

service_role (secret!)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Copie** essas informações

## Passo 4: Configurar .env

Edite `backend\.env`:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:** 
- Use suas próprias keys (não as de exemplo)
- `service_role` é **secreta** - nunca commite no Git!

## Passo 5: Criar Tabelas (Schema SQL)

1. No Supabase, vá em **SQL Editor** (ícone </> na lateral)
2. Clique em **New query**
3. Copie e cole o conteúdo de `backend\src\scripts\schema.sql`:

```sql
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
```

4. Clique em **RUN** (ou Ctrl+Enter)
5. Você deve ver: "Success. No rows returned"

## Passo 6: Verificar Tabelas

1. Vá em **Table Editor** (ícone de tabela na lateral)
2. Você deve ver:
   - ✅ `flights_to_monitor`
   - ✅ `price_history`

## Passo 7: Configurar Políticas de Segurança (RLS)

Por padrão, Supabase bloqueia acesso público. Para desenvolvimento, vamos desabilitar temporariamente:

1. Em **Table Editor**, clique em `flights_to_monitor`
2. Vá na aba **Policies**
3. Clique em **Disable RLS** (Row Level Security)
4. Repita para `price_history`

⚠️ **Para produção**, configure políticas adequadas!

## Passo 8: Testar Conexão

```powershell
cd backend
npm run dev
```

Você deve ver:
```
✅ Supabase client initialized
✅ Amadeus client initialized (test environment)
🚀 Server running on port 3001
```

## Passo 9: Testar no Browser

1. Acesse: http://localhost:5174
2. Clique em **Novo Monitoramento**
3. Preencha os dados
4. Clique em **Criar Monitoramento**

Se funcionar, os dados aparecerão no Supabase Table Editor! 🎉

## 📊 Ver Dados no Supabase

1. Vá em **Table Editor**
2. Clique em `flights_to_monitor`
3. Veja os voos criados
4. Clique em `price_history` para ver histórico

## 🔧 Troubleshooting

### "Missing Supabase credentials"
- Verifique se o `.env` está com as keys corretas
- Certifique-se que o arquivo `.env` está em `backend/`

### "relation does not exist"
- Execute o schema SQL novamente
- Verifique se as tabelas foram criadas em **Table Editor**

### "permission denied"
- Desabilite RLS temporariamente
- Use `SUPABASE_SERVICE_KEY` no código se necessário

### "Invalid API key"
- Copie as keys novamente do painel
- Não use keys de exemplo
- Verifique se não tem espaços extras

## 🎯 Limites do Plano Free

- ✅ 500 MB de database
- ✅ 1 GB de bandwidth/mês
- ✅ 50.000 usuários ativos/mês
- ✅ 2 GB de storage de arquivos

**Suficiente para desenvolvimento e projetos pequenos!**

## 🚀 Quando Atualizar?

- Pro Plan ($25/mês): 8 GB database, 50 GB bandwidth
- Para produção séria
- Backup automático
- Suporte prioritário

## ✨ Pronto!

Agora você está usando Supabase hospedado (não precisa de PostgreSQL local). 

Todos os dados ficam no cloud e você pode acessar de qualquer lugar! 🌍
