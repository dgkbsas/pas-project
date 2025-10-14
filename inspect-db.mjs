#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectDatabase() {
  console.log('=== LISTADO DE TABLAS ===\n');

  // Las tablas conocidas en la base de datos según los types del frontend
  const knownTables = [
    'companies',
    'users',
    'clients',
    'policies',
    'policy_alerts',
    'policy_followups',
    'company_invitations',
    'insurance_companies'
  ];

  console.log('Inspeccionando tablas:', knownTables.join(', '));
  console.log('\n');

  // Para cada tabla, obtener información
  for (const tableName of knownTables) {
    console.log(`\n=== TABLA: ${tableName} ===`);

    try {
      // Intentar obtener un registro de muestra para ver la estructura
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`  ⚠️  Error accediendo a la tabla: ${error.message}`);
        continue;
      }

      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`  Columnas (${columns.length}): ${columns.join(', ')}`);
      } else {
        // Tabla existe pero está vacía
        console.log('  ✓ Tabla existe (sin datos)');
      }
    } catch (err) {
      console.log(`  ✗ Tabla no existe o no accesible: ${err.message}`);
    }
  }
}

inspectDatabase().catch(console.error);
