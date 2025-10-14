# Integración Supabase + MCP para Claude Code

Este proyecto está integrado con Supabase y configurado para usar el Model Context Protocol (MCP) con Claude Code.

## 🎯 Objetivo

Permitir que Claude Code interactúe directamente con tu base de datos de Supabase mediante un servidor MCP personalizado.

## 📋 Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

> ⚠️ **Seguridad**: El archivo `.env` está en `.gitignore` y NO debe subirse a git.

### Dónde encontrar las credenciales

1. Ve a tu dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **URL**: Project URL
   - **anon/public key**: `anon` `public`
   - **service_role key**: `service_role` `secret` (⚠️ Mantener privada)

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Las dependencias principales son:
- `@supabase/supabase-js`: Cliente de Supabase
- `@modelcontextprotocol/sdk`: SDK para crear servidores MCP
- `dotenv`: Para manejar variables de entorno

### 2. Configurar variables de entorno

Crea el archivo `.env` con tus credenciales (ver sección anterior).

### 3. Verificar la conexión

Ejecuta el script de verificación:

```bash
node scripts/test-supabase.mjs
```

## 🤖 Uso con Claude Code

### Configuración

El proyecto ya incluye la configuración necesaria en `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["mcp-server/supabase-server.mjs"],
      "env": {
        "SUPABASE_URL": "...",
        "SUPABASE_ANON_KEY": "...",
        "SUPABASE_SERVICE_ROLE_KEY": "..."
      }
    }
  }
}
```

### Uso en Claude Code

Cuando abras este proyecto con Claude Code, el servidor MCP "supabase" se cargará automáticamente.

#### Herramientas disponibles:

1. **`list_tables`** - Lista todas las tablas en la base de datos
   ```
   "Lista todas las tablas de mi base de datos"
   ```

2. **`get_table_schema`** - Obtiene el esquema de una tabla específica
   ```
   "Muéstrame el esquema de la tabla usuarios"
   ```

3. **`select_data`** - Consulta datos de una tabla
   ```
   "Obtén todos los usuarios activos"
   "Muéstrame los últimos 10 posts"
   ```

4. **`insert_data`** - Inserta datos en una tabla
   ```
   "Inserta un nuevo usuario con email test@example.com"
   ```

5. **`update_data`** - Actualiza datos existentes
   ```
   "Actualiza el usuario con id 1, cambia su estado a 'active'"
   ```

6. **`delete_data`** - Elimina datos de una tabla
   ```
   "Elimina el post con id 5"
   ```

7. **`query_database`** - Ejecuta consultas SQL personalizadas
   ```
   "Ejecuta: SELECT COUNT(*) FROM usuarios WHERE created_at > '2024-01-01'"
   ```

### Ejemplos de prompts

```
"¿Qué tablas hay en mi base de datos?"

"Muéstrame el esquema de la tabla 'productos'"

"Lista los últimos 5 usuarios registrados"

"Inserta un nuevo producto: {nombre: 'Widget', precio: 29.99, stock: 100}"

"Actualiza el stock del producto con id 3 a 50"

"Cuenta cuántos usuarios hay registrados"
```

## 📦 Uso en tu aplicación

Para usar Supabase en tu código de aplicación (no en Claude Code):

```javascript
import { supabase } from './src/lib/supabaseClient.js';

// Consultar datos
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .limit(10);

// Insertar datos
const { data, error } = await supabase
  .from('usuarios')
  .insert({ email: 'test@example.com', nombre: 'Test User' });
```

> ⚠️ **Importante**: El cliente en `src/lib/supabaseClient.js` usa `SUPABASE_ANON_KEY`, NO la service role key. Esto es seguro para usar en el código de tu aplicación.

## 🔒 Seguridad

### ⚠️ NUNCA hacer:

- ❌ Subir `.env` a git
- ❌ Exponer `SUPABASE_SERVICE_ROLE_KEY` en código cliente
- ❌ Usar service role key en bundles del frontend
- ❌ Compartir credenciales en documentos o chat

### ✅ Siempre hacer:

- ✅ Mantener `.env` en `.gitignore`
- ✅ Usar `SUPABASE_ANON_KEY` en código cliente
- ✅ Configurar Row Level Security (RLS) en tus tablas
- ✅ Usar service role key solo en entornos locales o backend seguro

## 🔧 Row Level Security (RLS)

Para producción, es **crítico** habilitar RLS en todas tus tablas:

1. Ve a tu tabla en el dashboard de Supabase
2. Click en "RLS" → "Enable RLS"
3. Crea políticas para controlar quién puede leer/escribir datos

Ejemplo de política:
```sql
-- Permitir a usuarios autenticados leer sus propios datos
CREATE POLICY "Los usuarios pueden ver sus propios datos"
ON usuarios FOR SELECT
USING (auth.uid() = id);
```

## 📁 Estructura del Proyecto

```
007PasProject/
├── .env                          # Credenciales (NO subir a git)
├── .gitignore                    # Protege archivos sensibles
├── .claude/
│   └── settings.local.json       # Config MCP (NO subir a git)
├── mcp-server/
│   └── supabase-server.mjs       # Servidor MCP personalizado
├── src/
│   └── lib/
│       └── supabaseClient.js     # Cliente Supabase para tu app
├── scripts/
│   └── test-supabase.mjs         # Script de verificación
├── package.json
└── SUPABASE.md                   # Esta documentación
```

## 🐛 Troubleshooting

### Claude Code no detecta el servidor MCP

1. Verifica que `.claude/settings.local.json` exista
2. Revisa que el JSON sea válido (sin errores de sintaxis)
3. Reinicia Claude Code o tu IDE
4. Verifica que las variables de entorno estén correctas

### Error de conexión a Supabase

1. Verifica que las credenciales en `.env` sean correctas
2. Ejecuta `node scripts/test-supabase.mjs` para diagnóstico
3. Verifica que tu proyecto de Supabase esté activo
4. Revisa el dashboard de Supabase por problemas

### Error 401/403

- Verifica que estés usando la key correcta (anon vs service_role)
- Revisa las políticas RLS de tus tablas
- Asegúrate de que las keys no hayan expirado

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Equipo

Si otro miembro del equipo clona este repo:

1. Ejecutar `npm install`
2. Crear su propio `.env` con las credenciales
3. Ejecutar `node scripts/test-supabase.mjs` para verificar
4. Ya puede usar Claude Code con acceso a Supabase

---

**Última actualización**: Octubre 2024
