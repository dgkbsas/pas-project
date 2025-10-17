#!/bin/bash
# Script para ejecutar queries SQL en Supabase usando el CLI

# Cargar variables de entorno
source .env

# Verificar que tenemos el access token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ Error: SUPABASE_ACCESS_TOKEN no encontrado en .env"
  exit 1
fi

# Si no se proporciona una query, mostrar ayuda
if [ -z "$1" ]; then
  echo "📋 Uso: ./scripts/query-supabase.sh \"SELECT * FROM table\""
  echo ""
  echo "Ejemplos:"
  echo "  ./scripts/query-supabase.sh \"SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'\""
  echo "  ./scripts/query-supabase.sh \"SELECT * FROM clients LIMIT 5\""
  echo "  ./scripts/query-supabase.sh \"SELECT COUNT(*) FROM policies\""
  exit 0
fi

# Ejecutar la query
QUERY="$1"

# Usar psql a través del CLI de Supabase
echo "🔍 Ejecutando query..."
echo "SQL: $QUERY"
echo ""

# Crear archivo temporal con la query
TEMP_FILE=$(mktemp)
echo "$QUERY" > "$TEMP_FILE"

# Ejecutar usando npx supabase (que ya está linkeado)
npx supabase db execute -f "$TEMP_FILE"

# Limpiar
rm "$TEMP_FILE"
