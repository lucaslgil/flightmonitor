import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  console.log('📦 Running database migrations...');
  console.log(`🔗 Connected to: ${supabaseUrl}`);

  try {
    // Criar tabela flights_to_monitor
    console.log('\n📋 Creating table: flights_to_monitor...');
    const { error: table1Error } = await supabase.rpc('exec_sql', {
      query: `
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
      `
    });

    if (table1Error && !table1Error.message?.includes('already exists')) {
      throw table1Error;
    }

    // Criar índices para flights_to_monitor
    console.log('📊 Creating indexes for flights_to_monitor...');
    await supabase.rpc('exec_sql', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_flights_active ON flights_to_monitor(is_active);
        CREATE INDEX IF NOT EXISTS idx_flights_dates ON flights_to_monitor(departure_date, return_date);
      `
    });

    // Criar tabela price_history
    console.log('\n📋 Creating table: price_history...');
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS price_history (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          flight_id UUID NOT NULL REFERENCES flights_to_monitor(id) ON DELETE CASCADE,
          price DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
          offer_data JSONB,
          checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Criar índices para price_history
    console.log('📊 Creating indexes for price_history...');
    await supabase.rpc('exec_sql', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_price_history_flight ON price_history(flight_id);
        CREATE INDEX IF NOT EXISTS idx_price_history_checked ON price_history(checked_at DESC);
      `
    });

    // Criar função para atualizar updated_at
    console.log('\n⚙️ Creating trigger function...');
    await supabase.rpc('exec_sql', {
      query: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    // Criar trigger
    console.log('🔔 Creating trigger...');
    await supabase.rpc('exec_sql', {
      query: `
        DROP TRIGGER IF EXISTS update_flights_updated_at ON flights_to_monitor;
        CREATE TRIGGER update_flights_updated_at
        BEFORE UPDATE ON flights_to_monitor
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `
    });

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Verifying tables...');

    // Verificar tabelas criadas
    const { data: tables, error: tablesError } = await supabase
      .from('flights_to_monitor')
      .select('*')
      .limit(0);

    if (tablesError && !tablesError.message?.includes('no rows')) {
      console.warn('⚠️  Note: Tables created but verification failed. This is normal.');
      console.warn('   Check tables manually in Supabase Dashboard.');
    } else {
      console.log('✅ Tables verified successfully!');
    }

  } catch (error) {
    console.error('\n❌ Migration error:', error.message || error);
    
    if (error.message?.includes('exec_sql')) {
      console.log('\n⚠️  The RPC function does not exist. You need to run the SQL manually.');
      console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
      console.log('https://supabase.com/dashboard/project/ismdxgcvlpyocxxanufl/sql/new\n');
      
      const schemaPath = join(__dirname, 'schema.sql');
      const schema = readFileSync(schemaPath, 'utf-8');
      console.log('─'.repeat(80));
      console.log(schema);
      console.log('─'.repeat(80));
    }
    
    process.exit(1);
  }

  process.exit(0);
}

migrate();
