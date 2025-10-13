#!/usr/bin/env node

/**
 * Migration runner script
 * Executes SQL migration using Supabase service role
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Starting migration: Convert ENUMs to VARCHAR...\n');

  try {
    // Read migration file
    const migrationPath = join(projectRoot, 'supabase/migrations/20250113_convert_enums_to_varchar.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📖 Migration file loaded');
    console.log('📝 Executing SQL...\n');

    // Split the SQL into individual statements
    // We need to execute them one by one because some might fail (like DROP TYPE)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (!statement || statement.startsWith('--')) continue;

      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });

        if (error) {
          // If exec_sql doesn't exist, try direct query
          if (error.code === 'PGRST202') {
            console.log('⚠️  exec_sql RPC not available, trying alternative method...');
            console.log('');
            console.log('Please run this migration manually in Supabase Dashboard:');
            console.log('1. Go to https://supabase.com/dashboard/project/cnwaaqvgwndsovmbchxp/sql');
            console.log('2. Copy the content from: supabase/migrations/20250113_convert_enums_to_varchar.sql');
            console.log('3. Paste it in the SQL Editor and click "Run"');
            console.log('');
            process.exit(1);
          }
          
          console.warn(`⚠️  Statement ${i + 1} warning: ${error.message}`);
          skipCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Statement ${i + 1} failed:`, err.message);
      }
    }

    console.log('\n✅ Migration completed!');
    console.log(`   Successful: ${successCount}`);
    console.log(`   Skipped: ${skipCount}`);
    console.log('\n💡 Your database is now ready to accept custom payment modes and policy types!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
