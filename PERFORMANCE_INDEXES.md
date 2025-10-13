# Índices de Performance para PASManager

## 📊 Resumen

Este documento explica cómo aplicar los índices de base de datos para mejorar significativamente el rendimiento de las consultas en PASManager.

## 🎯 Beneficios

Los índices mejoran el rendimiento en:

- ✅ **Búsquedas**: Consultas de texto con ILIKE serán mucho más rápidas
- ✅ **Filtros**: Filtrar por estado, tipo, aseguradora, ciudad, etc.
- ✅ **Ordenamiento**: Ordenar por fecha, nombre, cantidad de pólizas
- ✅ **Joins**: Unir tablas (policies + clients) será más eficiente
- ✅ **Paginación**: Cargar páginas grandes será más rápido

### Mejora Esperada

- Consultas simples: **50-200% más rápidas**
- Búsquedas de texto: **300-500% más rápidas**
- Ordenamiento: **100-300% más rápido**

## 📋 Índices Creados

### Policies (Pólizas)
- `company_id` - Para filtrar por empresa
- `client_id` - Para políticas de un cliente
- `active` - Para filtrar activas/inactivas
- `company_id + active` - Combinación más común
- `expiry_date` - Para ordenar por vencimiento
- `created_at` - Para ordenar por fecha de creación
- `policy_type` - Para filtrar por tipo
- `insurer` - Para filtrar/ordenar por aseguradora
- `payment_mode` - Para filtrar por forma de pago
- `policy_number` (GIN) - Para búsqueda rápida de texto

### Clients (Clientes)
- `company_id` - Para filtrar por empresa
- `active` - Para filtrar activos/inactivos
- `company_id + active` - Combinación más común
- `first_name` - Para ordenar por nombre
- `last_name` - Para ordenar por apellido
- `created_at` - Para ordenar por fecha
- `updated_at` - Para ordenar por actualización
- `city` - Para filtrar por ciudad
- `first_name, last_name, email_primary` (GIN) - Para búsqueda rápida

### Insurance Companies (Aseguradoras)
- `company_id` - Para filtrar por empresa
- `active` - Para filtrar activas/inactivas
- `name` - Para ordenar por nombre

### Users (Usuarios)
- `company_id` - Para autorización
- `role` - Para permisos
- `company_id + role` - Combinación para checks de seguridad

## 🚀 Cómo Aplicar

### Opción 1: Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido de `supabase/migrations/create_performance_indexes.sql`
5. Ejecuta el script (Run)
6. Verifica que no haya errores

### Opción 2: CLI de Supabase

```bash
# Si tienes Supabase CLI instalado
supabase db push

# O aplica la migración manualmente
psql $DATABASE_URL -f supabase/migrations/create_performance_indexes.sql
```

## ✅ Verificación

Después de aplicar los índices, ejecuta esta query en SQL Editor para verificar:

```sql
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('policies', 'clients', 'insurance_companies', 'users')
ORDER BY tablename, indexname;
```

Deberías ver todos los índices listados con el prefijo `idx_`.

## 📈 Monitoreo de Performance

### Antes y Después

Para comparar el rendimiento, ejecuta estas queries antes y después:

```sql
-- Query de ejemplo para políticas
EXPLAIN ANALYZE
SELECT p.*, c.first_name, c.last_name
FROM policies p
JOIN clients c ON p.client_id = c.id
WHERE p.company_id = 'tu-company-id'
AND p.active = true
ORDER BY p.expiry_date DESC
LIMIT 30;

-- Query de ejemplo para clientes
EXPLAIN ANALYZE
SELECT *
FROM clients
WHERE company_id = 'tu-company-id'
AND first_name ILIKE '%search%'
ORDER BY first_name
LIMIT 30;
```

Busca estas métricas:
- **Planning Time**: Debería disminuir
- **Execution Time**: Debería disminuir significativamente
- **Index Scan** vs **Seq Scan**: Deberías ver más "Index Scan"

## 🔧 Mantenimiento

Los índices se mantienen automáticamente por PostgreSQL, pero es bueno:

1. **Ejecutar ANALYZE periódicamente** (cada semana o mes):
   ```sql
   ANALYZE policies;
   ANALYZE clients;
   ```

2. **Monitorear el tamaño de índices**:
   ```sql
   SELECT
       tablename,
       indexname,
       pg_size_pretty(pg_relation_size(indexrelid)) as index_size
   FROM pg_stat_user_indexes
   WHERE schemaname = 'public'
   ORDER BY pg_relation_size(indexrelid) DESC;
   ```

## ⚠️ Consideraciones

- Los índices ocupan espacio en disco (típicamente 10-20% del tamaño de la tabla)
- Los índices ralentizan ligeramente las operaciones INSERT/UPDATE (despreciable en este caso)
- En Supabase free tier, revisa los límites de almacenamiento

## 🔍 Índices GIN (Full-Text Search)

Los índices GIN (`gin_trgm_ops`) permiten búsquedas ultra-rápidas con `ILIKE`:

```sql
-- Esto será MUY rápido con los índices GIN
SELECT * FROM clients
WHERE first_name ILIKE '%john%'
OR last_name ILIKE '%doe%';
```

## 📚 Recursos

- [PostgreSQL Index Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [Supabase Performance](https://supabase.com/docs/guides/database/performance)
- [pg_trgm Extension](https://www.postgresql.org/docs/current/pgtrgm.html)

---

**Nota**: Después de aplicar estos índices, notarás una mejora significativa en la velocidad de la aplicación, especialmente al filtrar, ordenar y buscar.
