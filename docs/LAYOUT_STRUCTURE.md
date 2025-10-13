# Estructura del Layout - PAS Manager

## 📐 Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│ .app-layout (flex horizontal)                       │
│ ┌──────────┬──────────────────────────────────────┐ │
│ │ Sidebar  │ Main Content                         │ │
│ │ (Fixed)  │ ┌────────────────────────────────┐   │ │
│ │ 260px    │ │ Header (Sticky, solo mobile)   │   │ │
│ │          │ └────────────────────────────────┘   │ │
│ │          │ ┌────────────────────────────────┐   │ │
│ │          │ │ Content (scroll independiente) │   │ │
│ │          │ │ Páginas renderizadas aquí      │   │ │
│ │          │ │                                │   │ │
│ │          │ └────────────────────────────────┘   │ │
│ └──────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 🎯 Componentes Principales

### 1. **app-layout**
- **Rol**: Contenedor raíz con flexbox horizontal
- **Display**: `flex`
- **Props**: `min-height: 100vh`
- **Hijos**: Sidebar (fijo) + Main Content (flex: 1)

### 2. **sidebar** (Desktop)
- **Posición**: `fixed` (left: 0, top: 0, bottom: 0)
- **Ancho**: `260px`
- **Visibilidad**: Solo en `lg-up` (≥1024px)
- **Z-index**: `var(--z-fixed)`
- **Estructura interna**:
  ```
  ├── sidebar-header (logo)
  ├── sidebar-nav (navegación principal)
  └── sidebar-footer (user menu con dropdown)
  ```

### 3. **sidebar-mobile** (Mobile/Tablet)
- **Posición**: `fixed` con `transform: translateX(-100%)`
- **Comportamiento**: Slide-in desde la izquierda
- **Overlay**: `.sidebar-overlay` con fondo semi-transparente
- **Trigger**: Botón hamburguesa en header
- **Visibilidad**: Solo en `lg-down` (<1024px)

### 4. **main-content**
- **Flex**: `1` (ocupa el espacio restante)
- **Margin-left**: `260px` en desktop (para no superponerse con sidebar fijo)
- **Margin-left**: `0` en mobile (sidebar es overlay, no fijo)
- **Display**: `flex column`

### 5. **header**
- **Posición**: `sticky` (top: 0)
- **Visibilidad**: 
  - Desktop: `display: none` (sidebar siempre visible)
  - Mobile/Tablet: `display: flex`
- **Contenido**:
  - Botón hamburguesa (para abrir sidebar-mobile)
  - User menu (dropdown con perfil y opciones)

### 6. **content** (main)
- **Flex**: `1` (ocupa altura restante)
- **Padding**: `var(--space-6)` (desktop) | `var(--space-4)` (mobile)
- **Overflow**: `overflow-y: auto` (scroll independiente)
- **Contenido**: `<slot />` - aquí se renderizan las páginas

## 🔧 ¿Por qué necesita FLEX Y MARGIN?

### El comportamiento de `position: fixed`

Cuando usas `position: fixed`, el elemento **NO ocupa espacio en el flujo del documento**:

```
Lo que esperarías (sin fixed):
┌──────────┬─────────────────────────┐
│ Sidebar  │ Main Content            │
│ (ocupa   │ (empieza después del    │
│ espacio) │  sidebar)               │
└──────────┴─────────────────────────┘

Lo que pasa con position: fixed:
┌──────────┐
│ Sidebar  │ ← Posicionado relativo al viewport
│ (fixed)  │   NO ocupa espacio en el flujo
└──────────┘
┌─────────────────────────────────────┐
│ Main Content                        │
│ Empieza en x=0                      │
│ (porque sidebar NO está en el flujo)│
│                                     │
│ ❌ Parte del contenido queda        │
│    OCULTO bajo el sidebar           │
└─────────────────────────────────────┘
```

**Clave**: `position: fixed` posiciona el elemento relativo al **viewport** (ventana), no al contenedor padre. Por eso no ocupa espacio en el layout normal.

### ¿Por qué NO solo Grid?

```scss
// OPCIÓN DESCARTADA:
.app-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
}
.sidebar {
  position: static; // No sería fixed
}
```

❌ **Problema**: En responsive, al ocultar sidebar con `display: none`, el grid colapsa y el layout "salta".

### ¿Por qué NO solo `width: calc(100% - 260px)`?

```scss
// OPCIÓN DESCARTADA:
.main-content {
  width: calc(100% - 260px);
  margin-left: 0;
}
```

❌ **Problema**: Más complejo de hacer responsive. El width fijo no se adapta bien con flexbox.

### La solución elegida: Flex + Margin ✅

```scss
.app-layout {
  display: flex; // ← Para layout general responsive
}

.sidebar {
  position: fixed; // ← Para mantenerlo fijo al scroll
  width: 260px;
}

.main-content {
  flex: 1;           // ← Ocupa espacio restante
  margin-left: 260px; // ← Compensa el espacio del fixed sidebar
}
```

**Resultado**:
```
Desktop (sidebar fixed):
┌──────────┐┌───────────────────────┐
│ Sidebar  ││ Main Content          │
│ (fixed)  ││ flex: 1               │
│          ││ margin-left: 260px    │
│          ││ ← Empuja hacia derecha│
└──────────┘└───────────────────────┘
            ↑
    Compensación perfecta

Mobile (sidebar overlay):
┌────────────────────────────────────┐
│ Main Content                       │
│ flex: 1                            │
│ margin-left: 0 ← Sin compensación  │
│                                    │
│  ┌──────────┐ ← Sidebar overlay   │
│  │ Sidebar  │                      │
│  └──────────┘                      │
└────────────────────────────────────┘
```

### Resumen: Cada propiedad cumple un rol

| Propiedad | Propósito |
|-----------|----------|
| `display: flex` (en `.app-layout`) | Layout responsive general |
| `flex: 1` (en `.main-content`) | Ocupa espacio restante dinámicamente |
| `position: fixed` (en `.sidebar`) | Mantiene sidebar fijo al scroll |
| `margin-left: 260px` (en `.main-content`) | **Compensa** el espacio que sidebar NO ocupa en el flujo |

**Sin margin**: Main content empezaría en x=0 (debajo del sidebar)  
**Con margin**: Main content empieza en x=260px (al lado del sidebar)

En mobile el margin se quita porque el sidebar es overlay (no necesita compensación).

## 📱 Breakpoints

| Tamaño      | Comportamiento                           |
|-------------|------------------------------------------|
| `lg-up`     | Sidebar fijo visible, header oculto      |
| `lg-down`   | Sidebar overlay, header visible          |
| `md-down`   | Padding reducido en content              |

## 🎨 Ventajas de esta estructura

✅ **Scroll independiente**: Content tiene su propio scroll, sidebar fijo  
✅ **Header sticky**: En mobile, header siempre visible al scroll  
✅ **Responsive**: Transición automática entre desktop/mobile  
✅ **Flexbox moderno**: Sin position hacks complicados  
✅ **Mantenible**: Estructura clara y predecible  

## 📝 Alternativas consideradas

### Opción A: Sidebar con display: none (descartada)
```scss
.sidebar {
  display: block; // Ocupa espacio en el flujo
}
```
❌ Problema: Cambia el layout al ocultar sidebar

### Opción B: Grid Layout (descartada)
```scss
.app-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
}
```
❌ Problema: Más complejo para hacer responsive

### Opción C: Fixed + Margin (ELEGIDA) ✅
```scss
.sidebar { position: fixed; }
.main-content { margin-left: 260px; }
```
✅ Ventaja: Simple, predecible, fácil responsive

## 🚀 Mejoras futuras

- [ ] Sidebar colapsable (icono mode)
- [ ] Transiciones suaves en resize
- [ ] Persistir estado collapsed en localStorage
- [ ] Ancho de sidebar configurable
