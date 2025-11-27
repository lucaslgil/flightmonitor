# 🐘 PostgreSQL Local Setup (Simples - Sem Docker)

Como Docker não está disponível, vamos usar PostgreSQL instalado localmente no Windows.

## 📥 Passo 1: Instalar PostgreSQL

### Opção 1: Instalador Oficial (Recomendado)
1. Baixe: https://www.postgresql.org/download/windows/
2. Execute o instalador EDB
3. Durante instalação:
   - Senha: `postgres`
   - Porta: `5432` (padrão)
   - Locale: `Portuguese, Brazil`
4. Instale pgAdmin 4 (vem junto)

### Opção 2: Scoop (se preferir)
```powershell
scoop install postgresql
```

## 🔧 Passo 2: Verificar Instalação

```powershell
# Ver versão
psql --version

# Deve mostrar algo como: psql (PostgreSQL) 16.x
```

## 🗄️ Passo 3: Criar Database

```powershell
# Conectar como superuser
psql -U postgres

# Dentro do psql:
CREATE DATABASE flight_monitor;
\c flight_monitor
\q
```

## 📊 Passo 4: Executar Schema

```powershell
cd c:\Users\Lucas\Desktop\trip\flight-monitor

# Executar o schema SQL
psql -U postgres -d flight_monitor -f backend\src\scripts\schema.sql
```

Deve ver:
```
CREATE TABLE
CREATE INDEX
CREATE TABLE
CREATE INDEX
CREATE FUNCTION
CREATE TRIGGER
```

## ✅ Passo 5: Verificar Tabelas

```powershell
psql -U postgres -d flight_monitor -c "\dt"
```

Deve listar:
- `flights_to_monitor`
- `price_history`

## 🔑 Passo 6: Configurar .env

O arquivo `backend\.env` já está configurado:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flight_monitor
```

Se você usou senha diferente, atualize!

## 🚀 Passo 7: Testar Conexão

```powershell
cd backend

# Testar conexão Node.js -> PostgreSQL
node -e "import('pg').then(({default:pkg})=>{const {Pool}=pkg;const pool=new Pool({connectionString:'postgresql://postgres:postgres@localhost:5432/flight_monitor'});pool.query('SELECT NOW()').then(r=>console.log('✅ Conectado!',r.rows[0])).catch(e=>console.error('❌ Erro:',e.message))})"
```

## 🎯 Passo 8: Iniciar Backend

```powershell
npm run dev
```

Deve ver:
```
✅ PostgreSQL client initialized
🚀 Server running on port 3001
```

## 📝 Comandos Úteis

### Ver dados no banco
```powershell
# Conectar
psql -U postgres -d flight_monitor

# Ver voos
SELECT * FROM flights_to_monitor;

# Ver histórico
SELECT * FROM price_history;

# Stats
SELECT COUNT(*) FROM flights_to_monitor WHERE is_active = true;

# Sair
\q
```

### Reset do banco (apaga tudo!)
```powershell
psql -U postgres -c "DROP DATABASE flight_monitor;"
psql -U postgres -c "CREATE DATABASE flight_monitor;"
psql -U postgres -d flight_monitor -f backend\src\scripts\schema.sql
```

### Backup
```powershell
pg_dump -U postgres -d flight_monitor > backup.sql
```

### Restore
```powershell
psql -U postgres -d flight_monitor < backup.sql
```

## 🛠️ Troubleshooting

### "psql: command not found"
PostgreSQL não está no PATH. Adicione manualmente:

1. Procure onde instalou (ex: `C:\Program Files\PostgreSQL\16\bin`)
2. Adicione ao PATH:
   - Windows + R → `sysdm.cpl`
   - Avançado → Variáveis de Ambiente
   - System Variables → Path → Editar
   - Novo → `C:\Program Files\PostgreSQL\16\bin`
3. Reabra PowerShell

### "connection refused"
PostgreSQL não está rodando:

```powershell
# Verificar serviço
Get-Service postgresql*

# Iniciar manualmente
Start-Service postgresql-x64-16
```

### "password authentication failed"
Senha incorreta. Resetar senha:

```powershell
# Parar serviço
Stop-Service postgresql-x64-16

# Editar pg_hba.conf (mudar md5 para trust temporariamente)
# Localização: C:\Program Files\PostgreSQL\16\data\pg_hba.conf

# Reiniciar
Start-Service postgresql-x64-16

# Conectar sem senha
psql -U postgres

# Resetar senha
ALTER USER postgres PASSWORD 'postgres';

# Sair e reverter pg_hba.conf
\q
```

## 🌐 Acessar via pgAdmin

1. Abra pgAdmin 4
2. **Add New Server**:
   - Name: `Flight Monitor Local`
   - Host: `localhost`
   - Port: `5432`
   - Database: `flight_monitor`
   - Username: `postgres`
   - Password: `postgres`
3. Conectar!

Agora você pode ver tabelas, rodar queries, ver dados visualmente.

## ✨ Pronto!

Banco configurado localmente! Próximo passo:

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Acesse: http://localhost:5173
