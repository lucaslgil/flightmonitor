# ✈️ Flight Monitor - Sistema de Monitoramento Automático de Preços

Sistema completo de monitoramento de voos com integração Amadeus API, backend Node.js/Express e frontend React.

## 🏗️ Arquitetura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │◄────►│   Node.js    │◄────►│   Supabase  │
│  Frontend   │      │   Backend    │      │  PostgreSQL │
└─────────────┘      └──────┬───────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Amadeus API │
                     └──────────────┘
```

## 📦 Tecnologias

**Backend:**
- Node.js 18+
- Express 4
- @amadeus/amadeus
- @supabase/supabase-js
- node-cron (monitoramento automático a cada 30 min)
- nodemailer (notificações email)
- node-telegram-bot-api (notificações Telegram)
- axios (conversão de moeda)

**Frontend:**
- React 18 + Vite
- TailwindCSS (dark theme)
- Recharts (gráficos)
- React Router
- Axios

**Database:**
- Supabase (PostgreSQL)

**APIs Externas:**
- Amadeus API (busca de voos)
- ExchangeRate-API (conversão BRL)

**Deploy:**
- Frontend: Vercel
- Backend: Render/Railway/Vercel Functions

## 🚀 Quick Start

### 1. Clone o repositório
```bash
git clone <seu-repo>
cd flight-monitor
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Preencha as variáveis no .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_URL
npm run dev
```

### 4. Database Setup

Execute as migrations no Supabase:
```bash
cd backend
npm run migrate
```

## ⚙️ Configuração

### Backend (.env)
```env
PORT=3001
NODE_ENV=development

# Amadeus
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
AMADEUS_ENV=test

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_password

# Telegram (opcional)
TELEGRAM_BOT_TOKEN=your_bot_token
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📊 Funcionalidades

### ✅ Cadastro de Voos
- Origem/Destino (IATA)
- Data do voo
- Passageiros
- Classe
- Preço-alvo

### ✅ Busca Inteligente de Aeroportos
- **200+ aeroportos** em banco de dados global
- **Busca por IATA, cidade ou país** (ex: "GRU", "São Paulo", "Brazil")
- **Aliases inteligentes** (ex: "Guarulhos" encontra GRU)
- **Sistema de pontuação** para resultados mais relevantes
- **Suporte a acentuação** ("São Paulo" = "Sao Paulo")

### ✅ Conversão de Moeda (BRL)
- **Todos os preços em Real Brasileiro (R$)**
- **Atualização automática** de taxas de câmbio (a cada hora)
- **Cache inteligente** para performance
- API: exchangerate-api.com

### ✅ Busca Inteligente de Voos Baratos
- **Datas Flexíveis**: Busca ±3 dias da data desejada
- **Aeroportos Próximos**: Verifica aeroportos alternativos
- **Comparação de Classes**: Economy vs Premium Economy vs Business
- **Recomendações Automáticas**: Mostra as melhores opções com economia

### ✅ Detalhes Completos dos Voos
- **Informações de cada trecho**: Horários, duração, companhia
- **84+ companhias aéreas** identificadas
- **90+ modelos de aeronaves** com nomes completos
- **Conexões e escalas**: Tempo de espera calculado
- **Interface expansível** para ver todos os detalhes

### ✅ Monitoramento Automático
- Consultas periódicas (a cada 30 minutos)
- Histórico de preços em BRL
- Detecção de variações
- Cache inteligente

### ✅ Notificações
- Email quando preço cai
- Telegram (opcional)
- Preço-alvo atingido

### ✅ Dashboard
- Gráfico de variação
- Histórico completo em BRL
- Melhor/Último preço
- Tendência

## 📚 Endpoints API

### Flights
- `GET /api/flights` - Listar voos monitorados
- `POST /api/flights` - Criar monitoramento
- `GET /api/flights/:id` - Detalhes do voo
- `PUT /api/flights/:id` - Atualizar monitoramento
- `DELETE /api/flights/:id` - Deletar monitoramento
- `POST /api/flights/:id/check` - Forçar verificação
- `POST /api/flights/search/smart` - **Busca inteligente** (datas flexíveis, aeroportos próximos, classes)

### Price History
- `GET /api/flights/:id/history` - Histórico de preços em BRL
- `GET /api/flights/:id/stats` - Estatísticas

### Exemplo: Busca Inteligente
```json
POST /api/flights/search/smart
{
  "origin": "GRU",
  "destination": "MAD",
  "departureDate": "2024-12-20",
  "adults": 1,
  "travelClass": "ECONOMY"
}

Response:
{
  "flexibleDates": [
    {
      "date": "2024-12-18",
      "offers": [...],
      "cheapest": { "totalBRL": "R$ 3.245,80" }
    }
  ],
  "nearbyAirports": [...],
  "differentClasses": [...],
  "recommendations": {
    "cheapest": { ... },
    "savings": "R$ 450,20"
  }
}
```

## 🔄 Worker de Monitoramento

O worker roda automaticamente a cada 30 minutos (configurável):

```javascript
// Cron: */30 * * * * (a cada 30 min)
- Busca voos ativos
- Consulta Amadeus
- Compara preços
- Salva histórico
- Dispara notificações
```

## 📈 Deploy

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
- Conecte o repo GitHub
- Configure environment variables
- Deploy automático

### Database (Supabase)
- Já está no cloud
- Configure RLS policies
- Backup automático

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Licença

MIT
