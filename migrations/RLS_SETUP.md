# Row Level Security (RLS) Setup Guide

## ¿Qué es RLS?

Row Level Security (RLS) es una característica de seguridad en PostgreSQL/Supabase que controla qué filas de una tabla puede ver o modificar cada usuario. Es **crucial para producción** porque:

- ✅ Previene que usuarios accedan a datos de otras empresas
- ✅ Protege contra ataques de inyección SQL
- ✅ Funciona a nivel de base de datos (no puede ser evitado desde el código)
- ✅ Simplifica la lógica de seguridad en tu aplicación

## Cómo funciona en PAS Manager

### Estructura de seguridad:

1. **Autenticación**: Usuario inicia sesión con Supabase Auth
2. **Identificación**: Sistema obtiene `auth.uid()` del usuario autenticado
3. **Autorización**: RLS policies verifican:
   - ¿Este usuario pertenece a qué empresa? (`company_id`)
   - ¿Qué rol tiene? (`admin`, `agent`, `guest`)
   - ¿Puede acceder a este dato específico?

### Ejemplo:

```typescript
// Tu código en la aplicación:
const { data } = await supabase
  .from('clients')
  .select('*');

// RLS automáticamente filtra:
// WHERE clients.company_id = (
//   SELECT company_id FROM users WHERE id = auth.uid()
// )
```

**Sin RLS**: Obtendría TODOS los clientes de TODAS las empresas ❌
**Con RLS**: Solo obtiene clientes de SU empresa ✅

## Instalación

### Paso 1: Ejecutar la migración

1. Ve a tu dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (menú izquierdo)
4. Click en **+ New query**
5. Copia y pega TODO el contenido de `enable-rls-policies.sql`
6. Click en **Run** (o presiona Ctrl/Cmd + Enter)

### Paso 2: Verificar que funcionó

Al final del script, deberías ver dos tablas de resultados:

**Tabla 1 - RLS habilitado:**
```
tablename              | rls_enabled
-----------------------|------------
clients                | true
companies              | true
policies               | true
...
```

**Tabla 2 - Políticas creadas:**
```
tablename    | policyname                           | command
-------------|--------------------------------------|--------
clients      | Users can view clients in company    | SELECT
clients      | Users can create clients in company  | INSERT
...
```

Si ves `true` en rls_enabled y múltiples policies, ¡está funcionando!

### Paso 3: Probar en tu aplicación

```bash
# Tu aplicación debería funcionar normalmente
npm run dev
```

**¿Qué esperar?**
- ✅ Login funciona normal
- ✅ Puedes ver tus clientes
- ✅ Puedes crear/editar pólizas
- ❌ NO puedes ver datos de otras empresas (incluso si conoces los IDs)

## Políticas implementadas

### 🏢 Companies (Empresas)

| Acción | Quién | Condición |
|--------|-------|-----------|
| SELECT | Todos | Solo su propia empresa |
| UPDATE | Admins | Solo su propia empresa |

### 👥 Users (Usuarios)

| Acción | Quién | Condición |
|--------|-------|-----------|
| SELECT | Todos | Usuarios de su empresa o su propio perfil |
| UPDATE | Todos | Solo su propio perfil |
| ALL | Admins | Todos los usuarios de su empresa |

### 📇 Clients (Clientes)

| Acción | Quién | Condición |
|--------|-------|-----------|
| SELECT | Todos | Clientes de su empresa |
| INSERT | Todos | En su empresa |
| UPDATE | Todos | Clientes de su empresa |
| DELETE | Admin/Agent | Clientes de su empresa |

### 📋 Policies (Pólizas)

| Acción | Quién | Condición |
|--------|-------|-----------|
| SELECT | Todos | Pólizas de su empresa |
| INSERT | Todos | En su empresa |
| UPDATE | Todos | Pólizas de su empresa |
| DELETE | Admin/Agent | Pólizas de su empresa |

### 🔔 Policy Alerts (Alertas)

| Acción | Quién | Condición |
|--------|-------|-----------|
| SELECT | Todos | Solo sus propias alertas |
| INSERT | Sistema | Para pólizas de su empresa |
| UPDATE | Todos | Solo sus propias alertas |
| DELETE | Todos | Solo sus propias alertas |

### 📝 Policy Followups (Seguimientos)

| Acción | Quién | Condición |
|--------|-------|-----------|
| SELECT | Todos | Seguimientos de pólizas de su empresa |
| INSERT | Todos | Para pólizas de su empresa |
| UPDATE | Creador | Solo los que creó |
| DELETE | Creador | Solo los que creó |

### 🏢 Insurance Companies (Aseguradoras)

| Acción | Quién | Condición |
|--------|-------|-----------|
| SELECT | Todos | Aseguradoras de su empresa |
| INSERT | Admin/Agent | En su empresa |
| UPDATE | Admin/Agent | Aseguradoras de su empresa |
| DELETE | Admin | Aseguradoras de su empresa |

## Roles en el sistema

### 🔴 Admin
- Acceso completo a todos los datos de su empresa
- Puede crear/editar/eliminar usuarios
- Puede eliminar clientes y pólizas
- Puede gestionar configuración de la empresa

### 🟡 Agent
- Puede ver todos los datos de su empresa
- Puede crear/editar clientes y pólizas
- Puede eliminar clientes y pólizas
- Puede gestionar aseguradoras
- NO puede eliminar usuarios

### 🟢 Guest
- Solo lectura
- Puede ver clientes, pólizas, seguimientos
- NO puede crear, editar, ni eliminar nada

## Troubleshooting

### ❌ "new row violates row-level security policy"

**Causa**: Intentas insertar datos con un `company_id` que no es el tuyo

**Solución**: Asegúrate de que cuando creas registros, uses el `company_id` del usuario:

```typescript
// ❌ INCORRECTO
const { data } = await supabase
  .from('clients')
  .insert({
    first_name: 'Juan',
    // falta company_id o es incorrecto
  });

// ✅ CORRECTO
const user = await supabase.auth.getUser();
const userProfile = await supabase
  .from('users')
  .select('company_id')
  .eq('id', user.id)
  .single();

const { data } = await supabase
  .from('clients')
  .insert({
    first_name: 'Juan',
    company_id: userProfile.company_id,
    created_by: user.id
  });
```

### ❌ No puedo ver ningún dato después de habilitar RLS

**Causa posible 1**: Tu usuario no tiene `company_id` en la tabla `users`

**Solución**:
```sql
-- Verificar en Supabase SQL Editor:
SELECT id, email, company_id, role FROM users WHERE email = 'tu@email.com';

-- Si company_id es NULL, asignarlo:
UPDATE users
SET company_id = (SELECT id FROM companies LIMIT 1)
WHERE email = 'tu@email.com';
```

**Causa posible 2**: El usuario no está autenticado correctamente

**Solución**: Verificar que el login funciona:
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('Usuario autenticado:', user);
// Debe mostrar el usuario, NO null
```

### ❌ Algunos datos aparecen, otros no

**Causa**: Los datos tienen diferentes `company_id`

**Solución**: Verificar consistencia:
```sql
-- En Supabase SQL Editor:
SELECT
  c.id,
  c.first_name,
  c.company_id as client_company,
  u.company_id as user_company
FROM clients c
CROSS JOIN users u
WHERE u.email = 'tu@email.com';
```

Si `client_company` ≠ `user_company`, necesitas:
1. Actualizar los datos para que tengan el mismo `company_id`
2. O crear/usar un usuario con el `company_id` correcto

## Deshabilitar RLS (SOLO para debug local)

**⚠️ ADVERTENCIA**: Nunca deshabilitar RLS en producción

Si necesitas debugear localmente:

```sql
-- Deshabilitar temporalmente
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE policies DISABLE ROW LEVEL SECURITY;

-- ... hacer debug ...

-- IMPORTANTE: Volver a habilitar
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
```

## Resumen

✅ **DO (Hacer)**:
- Mantener RLS habilitado en producción
- Asignar `company_id` correctamente en INSERT
- Asignar `created_by: auth.uid()` en registros nuevos
- Usar ANON key en tu aplicación (ya configurado)
- Probar con diferentes roles de usuario

❌ **DON'T (No hacer)**:
- Deshabilitar RLS en producción
- Usar SERVICE_ROLE_KEY en código cliente
- Intentar bypassear RLS con lógica en el código
- Exponer IDs de otras empresas en URLs

## Próximos pasos

1. ✅ Ejecutar `enable-rls-policies.sql` en Supabase
2. ✅ Verificar que RLS está habilitado
3. ✅ Probar login y funcionalidad básica
4. ✅ Crear usuarios de prueba con diferentes roles
5. ✅ Verificar que cada rol tiene los permisos correctos

¿Necesitas ayuda? Consulta:
- [Documentación oficial de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
