#!/usr/bin/env node

/**
 * Setup Database Schema
 *
 * This script reads and executes the schema.sql file to set up all tables,
 * RLS policies, and initial data in your Supabase database.
 *
 * Usage: node scripts/setup-database.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

// Create admin client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Setting up database schema...\n');

  try {
    // Read the schema file
    const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    console.log('📄 Schema file loaded successfully');
    console.log('⚠️  NOTE: You need to execute this SQL in Supabase SQL Editor:\n');
    console.log('   1. Go to: ' + SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/'));
    console.log('   2. Navigate to: SQL Editor');
    console.log('   3. Create a new query');
    console.log('   4. Copy and paste the content from: supabase/schema.sql');
    console.log('   5. Click "Run"\n');

    console.log('📋 Alternatively, copy this SQL and execute it manually:\n');
    console.log('=' + '='.repeat(70));
    console.log(schema);
    console.log('=' + '='.repeat(70));

    console.log('\n✅ Once executed, your database will have:');
    console.log('   - companies table');
    console.log('   - users table');
    console.log('   - clients table');
    console.log('   - policies table');
    console.log('   - policy_alerts table');
    console.log('   - All RLS policies configured');
    console.log('   - Proper indexes for performance');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
