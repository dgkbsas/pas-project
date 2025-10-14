# 007PasProject

Sistema de gestión de pólizas de seguros desarrollado con SvelteKit, TypeScript y Supabase.

## 🚀 Características

- Autenticación segura con Supabase Auth
- Dashboard con estadísticas en tiempo real
- Gestión completa de clientes y pólizas
- Interfaz responsive y accesible
- Sistema de notificaciones integrado

## 🛠️ Requisitos

- Node.js 18+
- pnpm 8+
- Cuenta en [Supabase](https://supabase.com)

## 🚀 Comenzando

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/007PasProject.git
   cd 007PasProject
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configuración**
   Crea un archivo `.env` en la raíz con:
   ```env
   # Supabase
   PUBLIC_SUPABASE_URL=tu_url_de_supabase
   PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   
   # Opcional: Configuración adicional
   NODE_ENV=development
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```
   La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)

## 🛠 Comandos útiles

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Preview de producción local
pnpm preview

# Linting
pnpm lint

# Formateo de código
pnpm format

# Ejecutar tests (cuando estén configurados)
pnpm test
```

## 📁 Estructura del proyecto

```
007PasProject/
├── .svelte-kit/          # Build output (no versionar)
├── mcp-server/           # Servidor MCP personalizado
├── scripts/              # Scripts de utilidad
├── src/
│   ├── lib/
│   │   ├── assets/       # Recursos estáticos
│   │   ├── components/   # Componentes reutilizables
│   │   ├── config/       # Configuraciones
│   │   └── stores/       # Stores de Svelte
│   ├── routes/           # Rutas de la aplicación
│   ├── app.css           # Estilos globales
│   └── app.html          # Plantilla HTML base
├── static/               # Archivos estáticos
├── .env                  # Variables de entorno (no versionar)
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── svelte.config.js
└── tsconfig.json
```

## 📚 Documentación

- [SUPABASE.md](./SUPABASE.md) - Guía de integración con Supabase
- [RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md) - Documentación técnica detallada
- [PERFORMANCE_INDEXES.md](./docs/PERFORMANCE_INDEXES.md) - Optimizaciones de rendimiento

## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea una rama: `git checkout -b feature/mi-nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -am 'Añadir nueva funcionalidad'`
4. Haz push a la rama: `git push origin feature/mi-nueva-funcionalidad`
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
