# 🐳 Setup Supabase Local com Docker

## ⚡ Quick Start

### 1. Verificar Docker
```powershell
docker --version
```

Se não tiver instalado, baixe em: https://www.docker.com/products/docker-desktop

### 2. Iniciar Supabase Local
```powershell
cd c:\Users\Lucas\Desktop\trip\flight-monitor
docker-compose up -d
```

Isso vai iniciar:
- ✅ PostgreSQL (porta 5432)
- ✅ Supabase Studio (porta 3000)
- ✅ Kong API Gateway (porta 8000)
- ✅ PostgREST (API automática)
- ✅ Meta (gerenciamento)

### 3. Acessar Supabase Studio
Abra no navegador: http://localhost:3000

Credenciais:
- **Database URL:** `postgresql://postgres:postgres@localhost:5432/postgres`
- **Anon Key:** (já configurado no .env)
- **Service Key:** (já configurado no .env)

### 4. Executar Schema SQL

O schema já é executado automaticamente na primeira vez que o container inicia!

Para re-executar manualmente:
```powershell
docker exec -i flight-monitor-db psql -U postgres -d postgres < backend/src/scripts/schema.sql
```

### 5. Verificar Tabelas
```powershell
docker exec -it flight-monitor-db psql -U postgres -d postgres -c "\dt"
```

Deve mostrar:
- `flights_to_monitor`
- `price_history`

### 6. Iniciar Backend
```powershell
cd backend
npm install
npm run dev
```

### 7. Iniciar Frontend
```powershell
cd frontend
npm install
npm run dev
```

## 📊 Acessar os Serviços

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Supabase Studio:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Supabase API:** http://localhost:8000

## 🛠️ Comandos Úteis

### Ver logs dos containers
```powershell
docker-compose logs -f
```

### Parar tudo
```powershell
docker-compose down
```

### Reiniciar do zero (apaga dados!)
```powershell
docker-compose down -v
docker-compose up -d
```

### Conectar ao PostgreSQL
```powershell
docker exec -it flight-monitor-db psql -U postgres -d postgres
```

### Ver dados
```sql
-- Ver voos
SELECT * FROM flights_to_monitor;

-- Ver histórico de preços
SELECT * FROM price_history;

-- Stats
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active,
  MIN(lowest_price) as best_price
FROM flights_to_monitor;
```

## 🔧 Troubleshooting

### Porta 5432 já em uso
Se você já tem PostgreSQL instalado localmente:

1. Pare o PostgreSQL local
2. OU altere a porta no `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use 5433 no host
```

E atualize `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
```

### Porta 3000 já em uso
Altere no `docker-compose.yml`:
```yaml
studio:
  ports:
    - "3333:3000"  # Acesse via localhost:3333
```

### Schema não foi criado
Execute manualmente:
```powershell
docker exec -i flight-monitor-db psql -U postgres -d postgres < backend/src/scripts/schema.sql
```

## ✨ Vantagens do Setup Local

- ✅ Desenvolvimento offline
- ✅ Sem limites de API
- ✅ Dados locais (privacidade)
- ✅ Reset rápido para testes
- ✅ Sem custos
- ✅ Performance máxima

## 🚀 Quando Migrar para Cloud

Para produção, use Supabase Cloud:

1. Crie projeto em https://supabase.com
2. Execute o schema no SQL Editor
3. Atualize `.env` com as keys do cloud
4. Deploy!

## 📝 Credenciais Padrão (LOCAL)

```env
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

⚠️ **NUNCA** use essas keys em produção! São apenas para desenvolvimento local.
