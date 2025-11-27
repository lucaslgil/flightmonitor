# ✈️ Flight Monitor - Guia de Setup Completo

## 📋 Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org))
- Conta Supabase ([Criar conta](https://supabase.com))
- Conta Amadeus API ([Developer Portal](https://developers.amadeus.com))
- Conta Gmail/Outlook para envio de emails

---

## 🚀 Passo 1: Supabase Setup

### 1.1 Criar Projeto
1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Escolha nome, senha do banco, região
4. Aguarde criação (~2 minutos)

### 1.2 Obter Credenciais
1. No painel, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** (chave pública)
   - **service_role** (chave privada - NUNCA commite no Git!)

### 1.3 Executar Schema SQL
1. No painel Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo de `backend/src/scripts/schema.sql`
3. Cole e clique em **RUN**
4. Verifique se as tabelas foram criadas em **Table Editor**

✅ **Tabelas criadas:**
- `flights_to_monitor`
- `price_history`

---

## 🔑 Passo 2: Amadeus API Setup

### 2.1 Criar Conta
1. Acesse [https://developers.amadeus.com](https://developers.amadeus.com)
2. Clique em **Register**
3. Confirme email

### 2.2 Criar App
1. No dashboard, clique em **My Apps** → **Create New App**
2. Nome: "Flight Monitor"
3. Após criação, copie:
   - **API Key** (Client ID)
   - **API Secret** (Client Secret)

### 2.3 Entender Ambientes
- **Test**: Dados de teste gratuitos (use para desenvolvimento)
- **Production**: Dados reais (requer upgrade da conta)

🆓 **Para começar, use o ambiente TEST** (já configurado no .env.example)

---

## 📧 Passo 3: Email Setup (Gmail)

### 3.1 Criar Senha de App
1. Acesse [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Ative **Verificação em 2 etapas** (se não ativou)
3. Vá em **Senhas de app**
4. Selecione "Email" e "Outro (nome personalizado)"
5. Digite "Flight Monitor" e gere
6. **Copie a senha de 16 caracteres**

### 3.2 Alternativa: Outlook
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=seu@outlook.com
SMTP_PASS=sua_senha_normal
```

---

## 💻 Passo 4: Backend Setup

### 4.1 Instalar Dependências
```powershell
cd backend
npm install
```

### 4.2 Configurar Ambiente
```powershell
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
PORT=3001
NODE_ENV=development

# Amadeus (preencha com suas keys)
AMADEUS_CLIENT_ID=SEU_CLIENT_ID_AQUI
AMADEUS_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
AMADEUS_ENV=test

# Supabase (preencha com suas keys)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_KEY=sua_service_key

# Email (preencha com Gmail/Outlook)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu@gmail.com
SMTP_PASS=sua_senha_de_app_16_caracteres

# Telegram (OPCIONAL - deixe vazio se não usar)
TELEGRAM_BOT_TOKEN=

# Worker (não precisa alterar)
CRON_SCHEDULE=*/30 * * * *
CACHE_TTL_MINUTES=30
```

### 4.3 Iniciar Backend
```powershell
npm run dev
```

✅ **Backend rodando em:** `http://localhost:3001`

Teste: `http://localhost:3001/health` deve retornar `{"status":"ok"}`

---

## 🎨 Passo 5: Frontend Setup

### 5.1 Instalar Dependências
```powershell
cd frontend
npm install
```

### 5.2 Configurar Ambiente
```powershell
cp .env.example .env
```

Conteúdo do `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 5.3 Iniciar Frontend
```powershell
npm run dev
```

✅ **Frontend rodando em:** `http://localhost:5173`

---

## 🧪 Passo 6: Testar o Sistema

### 6.1 Acessar Interface
Abra `http://localhost:5173` no navegador

### 6.2 Criar Primeiro Monitoramento
1. Clique em **"Novo Monitoramento"**
2. Preencha:
   - Origem: `GRU` (São Paulo)
   - Destino: `JFK` (Nova York)
   - Data de Ida: Qualquer data futura
   - Email: Seu email para notificações
3. Clique em **"Criar Monitoramento"**

### 6.3 Forçar Verificação
1. No card do voo, clique em **"Verificar Agora"**
2. Aguarde ~10 segundos
3. Clique em **"Atualizar"** para ver o preço

### 6.4 Ver Detalhes
1. Clique no card do voo
2. Veja o gráfico de histórico
3. Confira estatísticas (menor, maior, média)

---

## 📊 Passo 7: Monitoramento Automático

O worker roda **automaticamente a cada 30 minutos** (configurável no `.env`).

### Alterar Frequência
Edite `CRON_SCHEDULE` no `.env`:

```env
# A cada 15 minutos
CRON_SCHEDULE=*/15 * * * *

# A cada 1 hora
CRON_SCHEDULE=0 * * * *

# A cada 6 horas
CRON_SCHEDULE=0 */6 * * *

# Todos os dias às 8h
CRON_SCHEDULE=0 8 * * *
```

**Formato:** `minuto hora dia mês dia-da-semana`

---

## 🔔 Passo 8: Configurar Notificações

### Email (já configurado)
- Emails são enviados automaticamente quando:
  - Preço cai mais de 5%
  - Preço-alvo é atingido

### Telegram (opcional)

1. **Criar Bot:**
   - Fale com [@BotFather](https://t.me/botfather) no Telegram
   - Envie `/newbot`
   - Escolha nome e username
   - Copie o **token**

2. **Obter Chat ID:**
   - Fale com seu bot
   - Acesse: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Copie o `chat.id`

3. **Configurar:**
   ```env
   TELEGRAM_BOT_TOKEN=seu_token_aqui
   ```

4. **Ao criar voo, preencha:**
   - Campo `notification_telegram_chat_id` com seu chat ID

---

## 🌐 Passo 9: Deploy (Produção)

### 9.1 Frontend (Vercel)

1. **Push para GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_USUARIO/flight-monitor.git
   git push -u origin main
   ```

2. **Deploy no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - **Import Project** → Selecione o repo
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://seu-backend.onrender.com/api
     ```
   - Clique em **Deploy**

✅ **Frontend online:** `https://seu-app.vercel.app`

### 9.2 Backend (Render)

1. **Criar Web Service:**
   - Acesse [render.com](https://render.com)
   - **New** → **Web Service**
   - Conecte GitHub e selecione o repo
   - Configure:
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

2. **Environment Variables:**
   Adicione todas as variáveis do `.env` (menos PORT)

3. **Deploy:**
   - Clique em **Create Web Service**
   - Aguarde deploy (~3 min)

✅ **Backend online:** `https://seu-backend.onrender.com`

4. **Atualizar Frontend:**
   - No Vercel, vá em **Settings** → **Environment Variables**
   - Altere `VITE_API_URL` para a URL do Render
   - Clique em **Redeploy**

---

## 🛠️ Troubleshooting

### Backend não inicia
```powershell
# Verifique Node.js
node --version  # Deve ser 18+

# Reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro "Missing Supabase credentials"
- Confira se o `.env` está preenchido corretamente
- Certifique-se que o `.env` está no diretório `backend/`

### Erro "Amadeus API error"
- Verifique se as keys estão corretas
- Confirme que está usando `AMADEUS_ENV=test`
- Teste as keys no [Amadeus Playground](https://developers.amadeus.com/playground)

### Email não enviado
- Verifique se a senha de app está correta (16 caracteres sem espaços)
- Teste SMTP manualmente:
  ```javascript
  node -e "require('./src/services/email.js').sendPriceAlert({to:'seu@email.com',flightData:{origin:'GRU',destination:'JFK',departureDate:'2024-12-01',adults:1,travelClass:'ECONOMY',currency:'BRL'},currentPrice:1500,previousPrice:1600,targetPrice:1400})"
  ```

### Frontend não conecta ao Backend
- Verifique se o backend está rodando (`http://localhost:3001/health`)
- Confira se `VITE_API_URL` no `.env` está correto
- Abra o Console do navegador (F12) e veja erros

---

## 📚 Comandos Úteis

### Backend
```powershell
npm run dev       # Desenvolvimento (auto-reload)
npm start         # Produção
npm run migrate   # Ver SQL para migrations
```

### Frontend
```powershell
npm run dev       # Desenvolvimento
npm run build     # Build produção
npm run preview   # Preview build
```

---

## 🎯 Próximos Passos

- ✅ Configure Telegram para notificações adicionais
- ✅ Adicione mais voos para monitorar
- ✅ Experimente diferentes códigos IATA
- ✅ Ajuste o preço-alvo para testar alertas
- ✅ Faça deploy em produção
- ✅ Configure domínio customizado no Vercel

---

## 🆘 Suporte

- **Amadeus API Docs:** https://developers.amadeus.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Códigos IATA:** https://www.iata.org/en/publications/directories/code-search/

---

**🎉 Pronto! Seu sistema está funcionando!**
