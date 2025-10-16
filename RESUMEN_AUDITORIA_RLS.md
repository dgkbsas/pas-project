# 🔒 Auditoría y Corrección de Políticas RLS - Supabase

**Fecha:** 2025-01-16
**Proyecto:** PAS Manager (007PasProject)

---

## 📋 Resumen Ejecutivo

### Problemas Identificados

1. **❌ RLS DESHABILITADO** en tablas críticas (`clients`, `policies`, `users`)
   - Archivo: `migrations/fix-rls-temp.sql`
   - Esto permite acceso sin restricciones a los datos

2. **❌ POLÍTICAS DUPLICADAS/CONFLICTIVAS**
   - `schema.sql` crea políticas básicas
   - `enable-rls-policies.sql` crea políticas más completas
   - Múltiples políticas con nombres diferentes pero funcionalidad similar

3. **⚠️ MIGRACIONES DESORGANIZADAS**
   - 18 archivos de migración sin orden claro de ejecución
   - Algunos archivos repiten operaciones (agregar campos que ya existen)
   - Migraciones de "migración de datos" sin lógica clara

4. **⚠️ FUNCIÓN HELPER INCONSISTENTE**
   - `auth.user_company_id()` definida en `enable-rls-policies.sql`
   - No está claro si se ejecutó correctamente
   - Algunas políticas la usan, otras usan subqueries directas

---

## 📊 Estado Actual de la Base de Datos

### Tablas Existentes

| Tabla                 | Registros | Estado    |
|-----------------------|-----------|-----------|
| companies             | 1         | ✅ Activa |
| users                 | 1         | ✅ Activa |
| clients               | 12        | ✅ Activa |
| policies              | 47        | ✅ Activa |
| insurance_companies   | 9         | ✅ Activa |
| policy_followups      | 0         | ✅ Activa |
| policy_alerts         | 0         | ✅ Activa |
| configuration         | 5         | ✅ Activa |

### Estado de RLS

**No se pudo verificar directamente**, pero basándose en `fix-rls-temp.sql`:
- ❌ `clients` - RLS DESHABILITADO
- ❌ `policies` - RLS DESHABILITADO
- ❌ `users` - RLS DESHABILITADO
- ❓ Otras tablas - Estado desconocido

---

## 🔧 Solución Implementada

### Archivo de Migración Creado

**`migrations/20250116_cleanup_rls_policies.sql`**

Este archivo:
1. ✅ Elimina TODAS las políticas RLS existentes
2. ✅ Re-habilita RLS en todas las tablas
3. ✅ Crea la función helper `auth.user_company_id()` optimizada
4. ✅ Crea políticas limpias, sin duplicados, optimizadas

### Políticas Creadas (por tabla)

#### **companies** (3 políticas)
- `companies_select_own` - Ver su propia compañía
- `companies_update_admin` - Admins actualizan su compañía
- `companies_insert_authenticated` - Crear compañías (onboarding)

#### **users** (5 políticas)
- `users_select_company` - Ver usuarios de su compañía
- `users_update_self` - Actualizar propio perfil
- `users_update_admin` - Admins actualizan usuarios
- `users_insert_admin` - Admins crean usuarios
- `users_insert_onboarding` - Inserción inicial (onboarding)

#### **clients** (4 políticas)
- `clients_select_company` - Ver clientes de su compañía
- `clients_insert_agent_admin` - Agentes/admins crean clientes
- `clients_update_agent_admin` - Agentes/admins actualizan clientes
- `clients_delete_agent_admin` - Agentes/admins eliminan clientes

#### **policies** (4 políticas)
- `policies_select_company` - Ver pólizas de su compañía
- `policies_insert_agent_admin` - Agentes/admins crean pólizas
- `policies_update_agent_admin` - Agentes/admins actualizan pólizas
- `policies_delete_agent_admin` - Agentes/admins eliminan pólizas

#### **policy_alerts** (4 políticas)
- `policy_alerts_select_own` - Ver propias alertas
- `policy_alerts_insert_own` - Crear alertas
- `policy_alerts_update_own` - Actualizar alertas
- `policy_alerts_delete_own` - Eliminar alertas

#### **policy_followups** (4 políticas)
- `policy_followups_select_company` - Ver followups de su compañía
- `policy_followups_insert_company` - Crear followups
- `policy_followups_update_own` - Actualizar propios followups
- `policy_followups_delete_own` - Eliminar propios followups

#### **insurance_companies** (4 políticas)
- `insurance_companies_select_company` - Ver aseguradoras
- `insurance_companies_insert_agent_admin` - Crear aseguradoras
- `insurance_companies_update_agent_admin` - Actualizar aseguradoras
- `insurance_companies_delete_admin` - Admins eliminan aseguradoras

#### **configuration** (4 políticas)
- `configuration_select_company` - Ver configuración
- `configuration_insert_admin` - Admins crean configuración
- `configuration_update_admin` - Admins actualizan configuración
- `configuration_delete_admin` - Admins eliminan configuración

---

## 🚀 Cómo Aplicar la Migración

### Opción 1: Manual (Recomendado)

1. Abre [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (`cnwaaqvgwndsovmbchxp`)
3. Ve a **SQL Editor** en el menú lateral
4. Haz clic en **New query**
5. Copia y pega el contenido de:
   ```
   migrations/20250116_cleanup_rls_policies.sql
   ```
6. Haz clic en **Run** (▶️)
7. Verifica que no hay errores en la consola
8. Al final verás dos tablas mostrando:
   - Estado de RLS en cada tabla
   - Número de políticas creadas por tabla

### Opción 2: Usando Node.js (Requiere pg module)

1. Instala el módulo pg:
   ```bash
   npm install pg
   ```

2. Agrega la contraseña de la base de datos a `.env`:
   ```bash
   DATABASE_PASSWORD=tu_password_aqui
   ```
   (La encuentras en: Supabase Dashboard → Settings → Database → Connection string)

3. Ejecuta el script:
   ```bash
   node scripts/execute-sql-migration.mjs
   ```

---

## 🧹 Limpieza de Migraciones Recomendada

### Archivos a Revisar/Eliminar

Estos archivos pueden contener duplicados o lógica problemática:

1. ❌ **`fix-rls-temp.sql`** - ELIMINAR (desactiva RLS)
2. ⚠️ **`enable-rls-policies.sql`** - Reemplazado por la nueva migración
3. ⚠️ **`schema.sql`** - Mantener como referencia, pero políticas reemplazadas
4. ⚠️ **`add-company-insert-policy.sql`** - Ya incluido en nueva migración
5. ⚠️ Archivos de migración de direcciones (múltiples):
   - `add_client_address_fields.sql`
   - `migrate_address_data.sql`
   - `migrate_address_data_simple.sql`
   - `20250113_add_address_fields.sql`

### Migraciones de Datos a Revisar

Estos archivos modifican/migran datos existentes. Verificar si ya se ejecutaron:
- `seed_insurance_companies.sql` - Requiere email del usuario
- `migrate_address_data*.sql` - Migración de campos de dirección

---

## ✅ Verificación Post-Migración

Después de aplicar la migración, verifica:

### 1. RLS Habilitado en Todas las Tablas

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Resultado esperado:** `rowsecurity = true` para todas las tablas.

### 2. Políticas Creadas

```sql
SELECT tablename, COUNT(*) as num_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Resultado esperado:** ~32 políticas en total (distribuidas entre las 8 tablas).

### 3. Función Helper Existe

```sql
SELECT proname, pronargs
FROM pg_proc
WHERE proname = 'user_company_id';
```

**Resultado esperado:** 1 función llamada `user_company_id`.

### 4. Prueba en la Aplicación

1. Inicia sesión en la aplicación
2. Navega a `/clientes`
3. Verifica que puedes ver los clientes
4. Intenta crear un nuevo cliente
5. Verifica que NO hay errores 404 o de acceso denegado

---

## 🔐 Seguridad y Coherencia Backend-Frontend

### Frontend

El frontend usa:
- `locals.supabase` (cliente autenticado con ANON_KEY)
- Endpoints API: `/api/clients`, `/api/company`, etc.
- Los endpoints verifican autenticación antes de acceder a datos

### Backend (Políticas RLS)

Las políticas aseguran:
- ✅ Los usuarios solo ven datos de su compañía
- ✅ Los roles se respetan (admin > agent > guest)
- ✅ Los guests solo tienen lectura (si implementas este rol)
- ✅ Las operaciones CRUD están protegidas por rol

### Coherencia

**✅ COHERENTE**: Las políticas RLS nuevas están alineadas con:
- Cómo el frontend hace queries
- Los permisos esperados por rol
- La lógica de negocio de la aplicación

---

## 📝 Próximos Pasos

1. **Aplicar la migración** `20250116_cleanup_rls_policies.sql`
2. **Verificar** que no hay errores en la aplicación
3. **Eliminar** el archivo `fix-rls-temp.sql`
4. **Limpiar** migraciones duplicadas/innecesarias
5. **Documentar** el orden correcto de ejecución de migraciones
6. **Implementar** sistema de versionado de migraciones (ej: Flyway, db-migrate)

---

## 🎯 Resultado Esperado

Después de aplicar esta migración:

✅ RLS habilitado en todas las tablas
✅ Políticas limpias y sin duplicados
✅ Sin errores 404 de acceso
✅ Función helper optimizada
✅ Permisos consistentes por rol
✅ Backend coherente con frontend

---

**Generado por:** Claude Code
**Fecha:** 2025-01-16
