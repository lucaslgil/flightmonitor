import { supabaseAdmin } from '../config/supabase.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not available. Check SUPABASE_SERVICE_KEY.');
    process.exit(1);
  }

  const schemaPath = join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  console.log('📦 Running database migrations...');

  try {
    // Nota: Supabase JS client não executa SQL diretamente
    // Você precisa executar isso no Supabase SQL Editor ou usar pg client
    console.log('\n⚠️  IMPORTANTE:');
    console.log('Execute o seguinte SQL no Supabase SQL Editor:');
    console.log('https://app.supabase.com/project/_/sql\n');
    console.log('─'.repeat(80));
    console.log(schema);
    console.log('─'.repeat(80));
    console.log('\n✅ Copie e cole o SQL acima no editor SQL do Supabase.');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrate();
