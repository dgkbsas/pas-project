# 🔒 Instrucciones para Aplicar la Migración de RLS

## ⚠️ IMPORTANTE: Leer antes de ejecutar

Esta migración va a:
1. ❌ **ELIMINAR TODAS** las políticas RLS existentes
2. ✅ Re-habilitar RLS en todas las tablas
3. ✅ Crear políticas limpias y optimizadas

**No habrá pérdida de datos**, solo se modifican las políticas de seguridad.

---

## 📋 Pasos para Aplicar la Migración

### 1. Accede a Supabase Dashboard

Abre tu navegador y ve a: https://supabase.com/dashboard

### 2. Selecciona tu Proyecto

Busca y selecciona el proyecto: **cnwaaqvgwndsovmbchxp**

### 3. Abre el SQL Editor

En el menú lateral izquierdo, haz clic en **SQL Editor**

### 4. Crea una Nueva Query

Haz clic en el botón **+ New query** (arriba a la derecha)

### 5. Copia el Contenido de la Migración

Abre el archivo:
```
migrations/20250116_cleanup_rls_policies.sql
```

Y copia **TODO** el contenido (518 líneas).

### 6. Pega en el SQL Editor

Pega todo el contenido en el editor de Supabase.

### 7. Ejecuta la Migración

Haz clic en el botón **Run** (▶️) o presiona **Cmd+Enter** (Mac) / **Ctrl+Enter** (Windows)

### 8. Verifica los Resultados

Al final de la ejecución, deberías ver dos tablas:

**Tabla 1: Estado de RLS**
```
tablename                | rls_status
-------------------------|------------------
clients                  | ✓ HABILITADO
companies                | ✓ HABILITADO
configuration            | ✓ HABILITADO
insurance_companies      | ✓ HABILITADO
policies                 | ✓ HABILITADO
policy_alerts            | ✓ HABILITADO
policy_followups         | ✓ HABILITADO
users                    | ✓ HABILITADO
```

**Tabla 2: Políticas Creadas**
```
tablename                | num_policies
-------------------------|-------------
clients                  | 4
companies                | 3
configuration            | 4
insurance_companies      | 4
policies                 | 4
policy_alerts            | 4
policy_followups         | 4
users                    | 5
```

**Total: ~32 políticas**

### 9. Verifica en tu Aplicación

1. Abre tu aplicación en el navegador
2. Inicia sesión
3. Ve a la página de **Clientes** (`/clientes`)
4. Verifica que puedes:
   - ✅ Ver la lista de clientes
   - ✅ Crear un nuevo cliente
   - ✅ Editar un cliente
   - ✅ Ver detalles de un cliente
5. **NO deberías ver errores 404** ni mensajes de "acceso denegado"

### 10. Prueba Otros Módulos

- Ve a **Pólizas** y verifica que funcionan correctamente
- Ve a **Configuración** y verifica acceso
- Prueba crear/editar/eliminar registros en diferentes secciones

---

## ✅ ¿Qué hace esta Migración?

### FASE 1: Limpieza
- Elimina TODAS las políticas RLS duplicadas/conflictivas

### FASE 2: Re-habilitar RLS
- Habilita Row Level Security en todas las tablas

### FASE 3: Función Helper
- Crea `auth.user_company_id()` para obtener la compañía del usuario

### FASE 4-11: Crear Políticas Limpias
- Crea políticas optimizadas para cada tabla
- Sin duplicados
- Sin conflictos
- Coherentes con el frontend

### FASE 12: Verificación
- Muestra el estado de RLS y políticas creadas

---

## 🔧 Solución de Problemas

### Error: "permission denied for schema pg_catalog"

**Solución:** Asegúrate de estar usando el usuario `postgres` con permisos de superusuario.

### Error: "function auth.user_company_id() does not exist"

**Solución:** La migración crea esta función. Si falla, verifica que tienes permisos para crear funciones en el esquema `auth`.

### Error: "policy ... already exists"

**Solución:** La FASE 1 elimina todas las políticas. Si ves este error, significa que la FASE 1 no se ejecutó correctamente. Ejecuta solo la FASE 1 primero:

```sql
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
      pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;
```

Luego ejecuta la migración completa de nuevo.

### La aplicación sigue mostrando errores 404

**Causas posibles:**
1. La migración no se ejecutó correctamente
2. El usuario no está autenticado
3. El usuario no tiene un `company_id` en la tabla `users`
4. Hay errores en el código del frontend

**Verificar:**
```sql
-- Ver tu usuario
SELECT id, email, company_id, role FROM users WHERE email = 'tu-email@example.com';

-- Ver tus clientes
SELECT id, first_name, last_name, company_id FROM clients LIMIT 10;

-- Verificar RLS
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

---

## 📞 Soporte

Si tienes problemas:

1. Verifica los logs de Supabase (Dashboard → Logs)
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que `auth.user_company_id()` existe:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'user_company_id';
   ```

---

## ✨ Después de Aplicar la Migración

### Archivos Modificados

- ✅ `migrations/20250116_cleanup_rls_policies.sql` - Nueva migración aplicada
- ❌ `migrations/fix-rls-temp.sql` - ELIMINADO (desactivaba RLS)
- 📦 `migrations/_archived/` - Migraciones obsoletas movidas aquí

### Próximos Pasos

1. Si todo funciona correctamente, puedes eliminar las migraciones en `_archived/`
2. Considera implementar un sistema de versionado de migraciones
3. Documenta el orden correcto de ejecución de migraciones restantes
4. Revisa las migraciones de datos (`seed_insurance_companies.sql`, etc.)

---

**¡Listo!** 🎉

Tu base de datos ahora tiene políticas RLS limpias, optimizadas y sin errores.
