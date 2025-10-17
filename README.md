# PAS Manager - Sistema de Gestión de Seguros

Sistema completo de gestión de pólizas de seguros con autenticación, RLS (Row Level Security) y multi-tenancy.

**Estado:** ✅ Listo para producción | **Última auditoría:** 2025-01-16

---

## 📊 Estructura de Base de Datos

### **Tablas Principales**

#### 1. **companies** - Compañías/Organizaciones
Almacena las organizaciones que usan el sistema (multi-tenant).

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `name` | TEXT | Nombre de la compañía |
| `address` | TEXT | Dirección |
| `city` | TEXT | Ciudad |
| `postal_code` | TEXT | Código postal |
| `phone` | TEXT | Teléfono |
| `active` | BOOLEAN | Estado activo/inactivo |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**RLS:** ✅ Habilitado (3 políticas)

---

#### 2. **users** - Usuarios del Sistema
Usuarios autenticados vinculados a una compañía.

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK, FK→auth.users) | ID del usuario autenticado |
| `company_id` | UUID (FK→companies) | Compañía a la que pertenece |
| `email` | TEXT (UNIQUE) | Email del usuario |
| `full_name` | TEXT | Nombre completo |
| `role` | ENUM | Rol: admin, agent, guest |
| `alert_days_before_expiry` | INTEGER | Días de alerta antes del vencimiento |
| `active` | BOOLEAN | Estado del usuario |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Roles disponibles:**
- `admin`: Control total de la compañía
- `agent`: Gestión de clientes y pólizas
- `guest`: Solo lectura

**RLS:** ✅ Habilitado (5 políticas)

---

#### 3. **clients** - Clientes
Clientes de seguros de cada compañía.

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `company_id` | UUID (FK→companies) | Compañía dueña del cliente |
| `created_by` | UUID (FK→users) | Usuario que creó el registro |
| `first_name` | TEXT | Nombre |
| `last_name` | TEXT | Apellido |
| `document_number` | TEXT | DNI/CUIT |
| `birth_date` | DATE | Fecha de nacimiento |
| `email_primary` | TEXT | Email principal |
| `email_secondary` | TEXT | Email secundario |
| `phone` | TEXT | Teléfono celular |
| `phone_landline` | VARCHAR | Teléfono fijo |
| `street` | TEXT | Calle |
| `street_number` | TEXT | Número |
| `floor` | VARCHAR | Piso |
| `apartment` | VARCHAR | Departamento |
| `postal_code` | TEXT | Código postal |
| `city` | TEXT | Ciudad |
| `province` | TEXT | Provincia |
| `alias_pas` | TEXT | Alias interno |
| `referred_by` | TEXT | Referido por |
| `observations` | TEXT | Observaciones |
| `assigned_to` | UUID (FK→users) | Agente asignado |
| `active` | BOOLEAN | Estado activo/inactivo |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |
| `last_edited_by` | UUID (FK→users) | Último editor |

**RLS:** ✅ Habilitado (4 políticas)

---

#### 4. **policies** - Pólizas de Seguros
Pólizas de seguros de los clientes.

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `client_id` | UUID (FK→clients) | Cliente dueño de la póliza |
| `company_id` | UUID (FK→companies) | Compañía |
| `created_by` | UUID (FK→users) | Usuario creador |
| `policy_number` | TEXT | Número de póliza |
| `policy_type` | ENUM | Tipo de seguro |
| `payment_mode` | ENUM | Forma de pago |
| `start_date` | DATE | Fecha de inicio |
| `expiry_date` | DATE | Fecha de vencimiento |
| `vehicle_plate` | TEXT | Dominio del vehículo (opcional) |
| `vehicle_brand` | VARCHAR | Marca del vehículo |
| `vehicle_model` | VARCHAR | Modelo del vehículo |
| `insurer_id` | UUID (FK→insurance_companies) | Aseguradora |
| `review_date` | DATE | Fecha de revisión |
| `insured_sum` | DECIMAL(15,2) | Suma asegurada |
| `accessories` | TEXT | Accesorios |
| `premium` | DECIMAL(15,2) | Premio |
| `endorsement` | TEXT | Endoso |
| `observations` | TEXT | Observaciones |
| `active` | BOOLEAN | Estado |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |
| `last_edited_by` | UUID (FK→users) | Último editor |

**Tipos de póliza:** auto, moto, home, fire, various_risks, collective_life, mandatory_life, transport, technical, civil_liability, life_options, pets, malpractice, life_investment, guarantee, consortium, personal_accidents, art, agricultural, other

**Modos de pago:** monthly, quarterly, biannual, annual, single_payment

**RLS:** ✅ Habilitado (4 políticas)

---

#### 5. **insurance_companies** - Aseguradoras

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `company_id` | UUID (FK→companies) | Compañía dueña |
| `name` | VARCHAR(255) | Nombre de la aseguradora |
| `code` | VARCHAR(50) | Código corto |
| `contact_email` | VARCHAR(255) | Email de contacto |
| `contact_phone` | VARCHAR(50) | Teléfono |
| `website` | VARCHAR(255) | Sitio web |
| `active` | BOOLEAN | Estado |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |
| `created_by` | UUID (FK→auth.users) | Creador |

**RLS:** ✅ Habilitado (4 políticas)

---

#### 6. **policy_alerts** - Alertas de Pólizas

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `policy_id` | UUID (FK→policies) | Póliza relacionada |
| `user_id` | UUID (FK→users) | Usuario que crea la alerta |
| `alert_date` | DATE | Fecha de la alerta |
| `message` | TEXT | Mensaje de alerta |
| `is_read` | BOOLEAN | Leída/No leída |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

**RLS:** ✅ Habilitado (4 políticas)

---

#### 7. **policy_followups** - Seguimientos de Pólizas

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `policy_id` | UUID (FK→policies) | Póliza relacionada |
| `followup_type` | VARCHAR(100) | Tipo de seguimiento |
| `date` | DATE | Fecha del seguimiento |
| `description` | TEXT | Descripción |
| `status` | VARCHAR(50) | Estado |
| `created_by` | UUID (FK→auth.users) | Usuario creador |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**RLS:** ✅ Habilitado (4 políticas)

---

#### 8. **configuration** - Configuraciones

| Columna | Tipo | Propósito |
|---------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `company_id` | UUID (FK→companies) | Compañía |
| `config_key` | VARCHAR(100) | Clave de configuración |
| `config_value` | JSONB | Valor en JSON |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |
| `updated_by` | UUID (FK→auth.users) | Usuario que actualizó |

**Configuraciones disponibles:** payment_modes, policy_types, alert_settings, followup_types, currency

**RLS:** ✅ Habilitado (4 políticas)

---

## 🔗 Relaciones entre Tablas

```
companies (1) ──┬─→ (N) users
                ├─→ (N) clients
                ├─→ (N) policies
                ├─→ (N) insurance_companies
                └─→ (N) configuration

users (1) ──┬─→ (N) clients [created_by]
            ├─→ (N) clients [assigned_to]
            ├─→ (N) policies [created_by]
            ├─→ (N) policy_alerts
            └─→ (N) policy_followups

clients (1) ──→ (N) policies

policies (1) ──┬─→ (N) policy_alerts
               └─→ (N) policy_followups

insurance_companies (1) ──→ (N) policies [insurer_id]
```

---

## 🔒 Políticas RLS (Row Level Security)

| Tabla | Políticas | SELECT | INSERT | UPDATE | DELETE |
|-------|-----------|--------|--------|--------|--------|
| companies | 3 | ✅ | ✅ | ✅ (admin) | ❌ |
| users | 5 | ✅ | ✅ | ✅ | ❌ |
| clients | 4 | ✅ | ✅ (agent+) | ✅ (agent+) | ✅ (agent+) |
| policies | 4 | ✅ | ✅ (agent+) | ✅ (agent+) | ✅ (agent+) |
| policy_alerts | 4 | ✅ (own) | ✅ (own) | ✅ (own) | ✅ (own) |
| policy_followups | 4 | ✅ | ✅ | ✅ (own) | ✅ (own) |
| insurance_companies | 4 | ✅ | ✅ (agent+) | ✅ (agent+) | ✅ (admin) |
| configuration | 4 | ✅ | ✅ (admin) | ✅ (admin) | ✅ (admin) |

**Leyenda:** `(own)` = solo propios | `(agent+)` = agentes y admins | `(admin)` = solo admins

**Función Helper:** `public.get_user_company_id()` - Devuelve el company_id del usuario autenticado

---

## ⚙️ Funciones RPC (Para MCP y CLI)

### **1. get_all_tables()**
Ver todas las tablas con su estado de RLS
```sql
SELECT * FROM public.get_all_tables();
```

### **2. get_rls_status()**
Estado completo de RLS por tabla
```sql
SELECT * FROM public.get_rls_status();
```

### **3. get_all_policies()**
Ver todas las políticas RLS creadas
```sql
SELECT * FROM public.get_all_policies();
```

### **4. get_table_schema(table_name)**
Ver el esquema completo de una tabla
```sql
SELECT * FROM public.get_table_schema('clients');
```

### **5. get_table_counts()**
Contar registros en todas las tablas
```sql
SELECT * FROM public.get_table_counts();
```

### **6. get_functions()**
Ver todas las funciones personalizadas
```sql
SELECT * FROM public.get_functions();
```

### **7. exec_sql(sql)** ⚠️ Solo Admins
Ejecutar SQL arbitrario (requiere rol admin)
```sql
SELECT * FROM public.exec_sql('SELECT COUNT(*) FROM clients WHERE active = true');
```

---

## 🛠️ Uso desde MCP (Claude Code)

### **Opción 1: Funciones RPC**

```javascript
// Ver estado de RLS
const { data } = await supabase.rpc('get_rls_status');

// Ver esquema de una tabla
const { data } = await supabase.rpc('get_table_schema', {
  p_table_name: 'clients'
});
```

### **Opción 2: Herramientas MCP**

```javascript
// Leer datos
mcp__supabase__select_data({
  table_name: "clients",
  columns: "id, first_name, last_name",
  limit: 10
})

// Insertar
mcp__supabase__insert_data({
  table_name: "clients",
  data: { company_id: "...", first_name: "Juan", last_name: "Pérez" }
})

// Actualizar
mcp__supabase__update_data({
  table_name: "clients",
  filters: { id: "..." },
  data: { phone: "123456789" }
})

// Eliminar
mcp__supabase__delete_data({
  table_name: "clients",
  filters: { id: "..." }
})
```

---

## 🖥️ Uso desde CLI de Supabase

### **Instalación**

```bash
# Con pnpm
pnpm add -D supabase

# Con npm
npm install -g supabase
```

### **Configuración**

```bash
# Agregar al .env
SUPABASE_ACCESS_TOKEN=tu_access_token_aqui

# Vincular proyecto
npx supabase link --project-ref cnwaaqvgwndsovmbchxp
```

### **Comandos**

```bash
# Listar proyectos
npx supabase projects list

# Dump de la base de datos
npx supabase db dump -f backup.sql

# Pull del esquema remoto
npx supabase db pull
```

---

## 📝 Scripts Útiles

```bash
# Probar funciones RPC
node scripts/test-rpc-functions.mjs

# Verificar migraciones
node scripts/verify-migrations.mjs

# Inspeccionar base de datos
node scripts/inspect-database.mjs
```

---

## 🚀 Aplicar Migraciones

### **1. Limpieza de RLS**
```
migrations/20250116_cleanup_rls_policies_fixed.sql
```
- Elimina políticas duplicadas
- Re-habilita RLS en todas las tablas
- Crea función `get_user_company_id()`
- Crea 32 políticas optimizadas

### **2. Funciones RPC**
```
migrations/20250116_create_admin_rpc_functions.sql
```
- Crea 7 funciones RPC
- Permite acceso a metadatos

### **3. Fix de get_all_policies**
```
migrations/20250116_fix_get_all_policies_v2.sql
```
- Corrige error en función

### **Cómo Aplicar**

1. Abre [Supabase Dashboard](https://supabase.com/dashboard/project/cnwaaqvgwndsovmbchxp/sql)
2. Ve a **SQL Editor**
3. **+ New query**
4. Copia y pega el archivo de migración
5. **Run** ▶️

---

## 📊 Estado Actual

**Datos:**
- 1 compañía
- 1 usuario (admin)
- 12 clientes
- 47 pólizas
- 9 aseguradoras

**Seguridad:**
- ✅ RLS habilitado en 9 tablas
- ✅ 32 políticas RLS activas
- ✅ Aislamiento multi-tenant
- ✅ Permisos por rol
- ✅ Sin errores 404

**Funciones:**
- ✅ 8 funciones personalizadas
- ✅ Acceso desde MCP, CLI, frontend

---

## 🏗️ Stack Tecnológico

- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Frontend:** SvelteKit 5 (Runes)
- **Base de Datos:** PostgreSQL 15+
- **Autenticación:** Supabase Auth
- **MCP:** Supabase MCP Server
- **CLI:** Supabase CLI
- **Package Manager:** pnpm

---

## 📞 Información del Proyecto

- **Proyecto:** pas-project
- **Project Ref:** cnwaaqvgwndsovmbchxp
- **URL:** https://cnwaaqvgwndsovmbchxp.supabase.co
- **Región:** us-east-2

---

✅ **El sistema está listo para producción** 🚀

*Última actualización: 2025-01-16*
