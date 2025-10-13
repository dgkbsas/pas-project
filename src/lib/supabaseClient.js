import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL o SUPABASE_ANON_KEY no están definidos en .env');
}

// Cliente de Supabase usando ANON KEY (seguro para cliente)
// NUNCA use SUPABASE_SERVICE_ROLE_KEY en código cliente
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default supabase;
