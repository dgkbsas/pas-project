# PAS Manager — Setup PWA básica (sin service workers)

## ✅ Estructura creada

```
static/
├── manifest.json
├── favicon.ico
├── favicon.png
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    └── apple-touch-icon.png
```

Todos los archivos dentro de `static/` se sirven desde la raíz del sitio. Por ejemplo: `static/favicon.png` se publica como `/favicon.png`.

---

## 📝 Modificaciones en src/app.html

Se añadieron enlaces/meta en el `<head>` para:
- ✅ Manifest PWA (`/manifest.json`)
- ✅ Theme color (`#7c3aed` - púrpura)
- ✅ Description (SEO)
- ✅ Favicons (`.ico` y `.png` 192x192)
- ✅ iOS meta tags (`apple-mobile-web-app-*`)
- ✅ Android/Chrome (`mobile-web-app-capable`)
- ✅ Viewport (responsive)

---

## 🎨 Generación de íconos personalizados desde un logo

Si quieres reemplazar los íconos actuales con tu propio logo, tienes varias opciones:

### Opción 1: realfavicongenerator.net (Recomendado) 🌟
La forma más fácil y completa:
1. Ve a https://realfavicongenerator.net
2. Sube tu logo (PNG/SVG de alta resolución)
3. Personaliza colores y estilos
4. Descarga el paquete generado
5. Copia los archivos a `static/` y `static/icons/`

### Opción 2: pwa-asset-generator (CLI)
Herramienta CLI con soporte para íconos maskable:

```bash
# Instalar (si no la tienes)
npm install -g pwa-asset-generator

# Generar íconos desde tu logo
pwa-asset-generator logo.png static/icons \
  --favicon \
  --manifest static/manifest.json \
  --background "#7c3aed"
```

### Opción 3: macOS sips (Sin instalar nada)
Si estás en Mac, puedes usar el comando `sips` que viene preinstalado:

```bash
# Partir de un PNG grande (recomendado 1024x1024)
LOGO="tu-logo.png"

sips -z 512 512 "$LOGO" --out static/icons/icon-512x512.png
sips -z 384 384 "$LOGO" --out static/icons/icon-384x384.png
sips -z 192 192 "$LOGO" --out static/icons/icon-192x192.png
sips -z 152 152 "$LOGO" --out static/icons/icon-152x152.png
sips -z 144 144 "$LOGO" --out static/icons/icon-144x144.png
sips -z 128 128 "$LOGO" --out static/icons/icon-128x128.png
sips -z 96  96  "$LOGO" --out static/icons/icon-96x96.png
sips -z 72  72  "$LOGO" --out static/icons/icon-72x72.png

# Copiar 192x192 como favicon.png
cp static/icons/icon-192x192.png static/favicon.png

# Copiar 180x180 para iOS
sips -z 180 180 "$LOGO" --out static/icons/apple-touch-icon.png
```

Para generar `favicon.ico`, puedes usar:
```bash
npx pwa-asset-generator "$LOGO" static --favicon-ico --icon-only
```

### Opción 4: ImageMagick (Placeholder rápido)
Si tienes ImageMagick instalado y quieres crear un placeholder temporal:

```bash
# Crear un ícono púrpura con texto "PAS"
magick -size 1024x1024 canvas:"#7c3aed" \
  -gravity center \
  -fill white \
  -pointsize 280 \
  -font Arial \
  label:PAS \
  static/icons/source-1024.png

# Redimensionar a todos los tamaños
magick static/icons/source-1024.png -resize 512x512 static/icons/icon-512x512.png
magick static/icons/source-1024.png -resize 384x384 static/icons/icon-384x384.png
magick static/icons/source-1024.png -resize 192x192 static/icons/icon-192x192.png
magick static/icons/source-1024.png -resize 152x152 static/icons/icon-152x152.png
magick static/icons/source-1024.png -resize 144x144 static/icons/icon-144x144.png
magick static/icons/source-1024.png -resize 128x128 static/icons/icon-128x128.png
magick static/icons/source-1024.png -resize 96x96 static/icons/icon-96x96.png
magick static/icons/source-1024.png -resize 72x72 static/icons/icon-72x72.png
magick static/icons/source-1024.png -resize 180x180 static/icons/apple-touch-icon.png

cp static/icons/icon-192x192.png static/favicon.png
```

---

## 🔄 Reemplazar íconos actuales

**Importante**: Los íconos actuales provienen de tu proyecto anterior (`appseg20`). Si quieres usar nuevos íconos:

1. Sustituye los PNG dentro de `static/icons/` **conservando los mismos nombres**
2. No olvides mantener `/icons/apple-touch-icon.png` (180x180) para iOS
3. Mantén `/favicon.ico` y `/favicon.png`
4. Si cambias rutas o nombres, actualiza `static/manifest.json` en consecuencia

---

## ✅ Verificación de la PWA

### 1. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 2. Abrir Chrome DevTools
1. Ve a **DevTools** → **Application** → **Manifest**
2. Verifica que no hay errores
3. Todos los íconos deben aparecer en la sección "Icons"

### 3. Probar instalación
- Chrome/Edge: Busca el botón de **instalar** (⊕) en la barra de direcciones
- Al instalarse, la app debe:
  - Abrir en ventana standalone (sin barra del navegador)
  - Mostrar la barra de título con color púrpura (`#7c3aed`)
  - Usar el ícono correspondiente

### 4. Probar en iOS
1. Abre Safari en iPhone/iPad
2. Toca el botón **Compartir**
3. Selecciona **"Añadir a pantalla de inicio"**
4. Se usará el ícono `apple-touch-icon.png` (180x180)
5. Al abrir, debe usar el modo web-app (sin barra de Safari)

### 5. Verificar archivos estáticos
Comprueba que estos endpoints funcionan:
- http://localhost:5173/manifest.json
- http://localhost:5173/favicon.ico
- http://localhost:5173/favicon.png
- http://localhost:5173/icons/icon-192x192.png
- http://localhost:5173/icons/icon-512x512.png
- http://localhost:5173/icons/apple-touch-icon.png

---

## 📱 Comportamiento esperado

### ✅ Funciona (PWA básica)
- ✅ Instalación en escritorio (Chrome, Edge)
- ✅ Instalación en móvil (Chrome Android, Safari iOS)
- ✅ Ventana standalone (sin barra del navegador)
- ✅ Ícono personalizado en el home screen
- ✅ Color de tema (`#7c3aed`)
- ✅ Splash screen automático (Android)

### ❌ No funciona (por diseño)
- ❌ **Modo offline** (no hay service worker)
- ❌ **Caché de recursos** (sin service worker)
- ❌ **Push notifications** (requiere service worker)
- ❌ **Actualización en segundo plano** (sin service worker)

---

## 🚫 Notas sobre Service Workers

**Intencionalmente NO se implementa un service worker** en esta configuración.

### ¿Por qué?
- La app requiere conectividad para acceder a Supabase
- No hay contenido estático que justifique cachear
- Simplicidad: menos complejidad en desarrollo y mantenimiento
- Evita problemas de caché desactualizado

### ¿Cuándo agregar un Service Worker?
Considera añadir uno si necesitas:
- Funcionalidad offline completa
- Caché de recursos estáticos (CSS, JS, imágenes)
- Push notifications
- Background sync
- Mejor rendimiento en conexiones lentas

### Recursos para añadir Service Worker:
- **Workbox** (recomendado): https://developers.google.com/web/tools/workbox
- **Vite PWA Plugin**: https://vite-pwa-org.netlify.app/
- **SvelteKit Service Workers**: https://kit.svelte.dev/docs/service-workers

---

## 🎯 Resultado Final

Tu aplicación **PAS Manager** ahora es:
- 📱 **Instalable** como app nativa (sin stores)
- 🎨 **Branded** con íconos y colores personalizados
- 🚀 **Standalone** (sin barra del navegador cuando se instala)
- 📊 **Progressive** (sigue funcionando en navegador normal)

**Pero NO es:**
- ❌ Offline-first
- ❌ Con caché de recursos
- ❌ Con service worker

Esto es **exactamente lo que solicitaste**: una PWA básica instalable sin funcionalidad offline ni service workers.

---

## 📚 Documentación adicional

- **MDN PWA Guide**: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- **Web.dev PWA**: https://web.dev/progressive-web-apps/
- **PWA Checklist**: https://web.dev/pwa-checklist/
- **Manifest Spec**: https://www.w3.org/TR/appmanifest/

---

**Última actualización**: Octubre 13, 2025
**Versión**: 1.0
**Estado**: ✅ Completo y funcional
