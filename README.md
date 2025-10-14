# 📋 PAS Manager - Gestión de Pólizas y Clientes

Sistema integral para la gestión de pólizas de seguros y clientes, desarrollado con SvelteKit y Supabase.

## 🚀 Características Principales

- **Gestión de Clientes**: Registro y seguimiento de clientes
- **Administración de Pólizas**: Control completo de pólizas de seguros
- **Dashboard Interactivo**: Estadísticas en tiempo real
- **Autenticación Segura**: Con roles de usuario
- **Interfaz Moderna**: Diseño responsivo y accesible

## 🚀 Comenzando

### Requisitos Previos

- Node.js 18+
- pnpm 8+
- Cuenta de [Supabase](https://supabase.com)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/pas-manager.git
   cd pas-manager
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz con:
   ```env
   # Supabase
   PUBLIC_SUPABASE_URL=tu_url_de_supabase
   PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   
   # Configuración de la aplicación
   NODE_ENV=development
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```

   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Preview producción local
pnpm preview

# Linting
pnpm lint

# Formateo de código
pnpm format
```

## 📁 Estructura del Proyecto

```
007PasProject/
├── .github/                 # Configuración de GitHub Actions
├── .svelte-kit/             # Build output (generado)
├── node_modules/            # Dependencias
├── scripts/                 # Scripts de utilidad
├── src/
│   ├── lib/                 # Código compartido
│   │   ├── components/      # Componentes UI
│   │   ├── config/          # Configuraciones
│   │   ├── schemas/         # Esquemas de validación
│   │   └── stores/          # Stores de Svelte
│   ├── routes/              # Rutas de la aplicación
│   └── app.html             # Plantilla HTML base
├── static/                  # Archivos estáticos
├── .env                     # Variables de entorno (local)
├── .gitignore               # Archivos ignorados por git
├── package.json             # Dependencias y scripts
├── pnpm-lock.yaml           # Lock file de pnpm
├── svelte.config.js         # Configuración de SvelteKit
└── tsconfig.json            # Configuración de TypeScript
```

## 📚 Documentación Adicional

- **[SUPABASE.md](./SUPABASE.md)**: Guía de integración con Supabase
- **[RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md)**: Documentación técnica detallada
- **[PERFORMANCE_INDEXES.md](./docs/PERFORMANCE_INDEXES.md)**: Optimizaciones de rendimiento

## 🤝 Cómo Contribuir

1. Haz un fork del proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -am 'Añadir nueva funcionalidad'`
4. Haz push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

*Última actualización: Octubre 2025*
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
