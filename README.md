# 007PasProject

Proyecto integrado con Supabase y configurado para usar Claude Code con Model Context Protocol (MCP).

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

Crea un archivo `.env` en la raíz con tus credenciales:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 3. Verificar conexión

```bash
node scripts/test-supabase.mjs
```

### 4. Usar con Claude Code

Abre este proyecto con Claude Code y automáticamente tendrás acceso al servidor MCP de Supabase.

Prueba con:
- "Lista todas las tablas de mi base de datos"
- "Muéstrame el esquema de la tabla X"
- "Consulta los datos de la tabla Y"

## 📚 Documentación

- **[SUPABASE.md](./SUPABASE.md)** - Guía completa de integración con Supabase y Claude Code

## 🏗️ Estructura del Proyecto

```
007PasProject/
├── .env                       # Credenciales (NO subir a git)
├── .gitignore                 # Protección de archivos sensibles
├── .claude/
│   └── settings.local.json    # Config MCP (NO subir a git)
├── mcp-server/
│   └── supabase-server.mjs    # Servidor MCP personalizado para Supabase
├── src/
│   └── lib/
│       └── supabaseClient.js  # Cliente Supabase para tu aplicación
├── scripts/
│   └── test-supabase.mjs      # Script de verificación de conexión
├── package.json
├── README.md                  # Este archivo
└── SUPABASE.md                # Documentación detallada de Supabase
```

## 🛠️ Tecnologías

- **Supabase** - Base de datos PostgreSQL y servicios backend
- **Model Context Protocol (MCP)** - Protocolo para que Claude Code acceda a Supabase
- **Claude Code** - Asistente de IA con acceso directo a tu base de datos

## 🔒 Seguridad

⚠️ **Importante**: 
- Nunca subas `.env` o `.claude/settings.local.json` a git
- El `SUPABASE_SERVICE_ROLE_KEY` solo debe usarse en entornos locales seguros
- Para código cliente, usa siempre `SUPABASE_ANON_KEY`
- Configura Row Level Security (RLS) en todas tus tablas de producción

## 📖 Más Información

Lee [SUPABASE.md](./SUPABASE.md) para documentación completa sobre:
- Herramientas MCP disponibles
- Ejemplos de uso con Claude Code
- Guía de seguridad
- Troubleshooting
- Recursos adicionales

---

**Última actualización**: Octubre 2024
