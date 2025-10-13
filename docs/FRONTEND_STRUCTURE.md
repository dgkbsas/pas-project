# 🏗️ Propuesta: Nueva Estructura Frontend

## 🎯 Objetivo
Separar el layout monolítico en componentes modulares y organizados por responsabilidad.

## 📂 Estructura Propuesta

```
src/
├── routes/
│   ├── (app)/
│   │   ├── +layout.svelte          ← SIMPLIFICADO (solo orquestación)
│   │   ├── +layout.server.ts
│   │   ├── dashboard/
│   │   │   └── +page.svelte        ← <slot /> renderiza aquí
│   │   ├── clientes/
│   │   │   ├── +page.svelte
│   │   │   └── components/         ← Componentes específicos de clientes
│   │   │       ├── ClientCard.svelte
│   │   │       ├── ClientFilters.svelte
│   │   │       └── ClientForm.svelte
│   │   └── polizas/
│   │       ├── +page.svelte
│   │       └── components/
│   │           ├── PolicyCard.svelte
│   │           ├── PolicyFilters.svelte
│   │           └── PolicyForm.svelte
│   └── auth/
│       ├── +layout.svelte          ← Layout SIN navegación
│       └── login/
│
└── lib/
    ├── components/
    │   ├── layout/                 ← 🆕 Componentes del shell
    │   │   ├── AppLayout.svelte    ← Contenedor principal
    │   │   ├── Sidebar.svelte      ← Nav desktop
    │   │   ├── MobileSidebar.svelte
    │   │   ├── Header.svelte       ← Header mobile/tablet
    │   │   ├── Navigation.svelte   ← Links de nav
    │   │   └── UserMenu.svelte     ← Dropdown user
    │   │
    │   ├── dashboard/              ← Componentes del dashboard
    │   │   ├── StatsCard.svelte
    │   │   ├── ActivityFeed.svelte
    │   │   └── QuickActions.svelte
    │   │
    │   └── ui/                     ← Componentes base reutilizables
    │       ├── Button.svelte
    │       ├── Input.svelte
    │       ├── Dropdown.svelte
    │       └── ...
    │
    ├── stores/
    │   ├── theme.ts
    │   ├── sidebar.ts              ← 🆕 Estado del sidebar
    │   └── notifications.ts
    │
    └── config/
        └── navigation.ts           ← 🆕 Configuración de rutas
```

## ✅ Ventajas de esta estructura

### 1. **Separación de responsabilidades**
```svelte
<!-- ANTES: +layout.svelte (690 líneas) -->
<div class="app-layout">
  <!-- 300 líneas de sidebar -->
  <!-- 200 líneas de header -->
  <!-- 190 líneas de estilos -->
</div>

<!-- DESPUÉS: +layout.svelte (30 líneas) -->
<script>
  import AppLayout from '$lib/components/layout/AppLayout.svelte';
  let { data } = $props();
</script>

<AppLayout {data}>
  <slot />  ← Aquí se renderiza cada página
</AppLayout>
```

### 2. **Componentes reutilizables**
```svelte
<!-- Sidebar.svelte es reutilizable -->
<Sidebar 
  navigation={items}
  currentPath={$page.url.pathname}
  userProfile={data.userProfile}
/>
```

### 3. **Código por feature (co-location)**
```
polizas/
├── +page.svelte              ← Vista principal
├── +page.server.ts           ← Data loading
└── components/               ← Componentes SOLO de pólizas
    ├── PolicyCard.svelte
    ├── PolicyFilters.svelte
    └── PolicyForm.svelte
```

### 4. **Testing más fácil**
```ts
// Puedes testear Sidebar independientemente
import { render } from '@testing-library/svelte';
import Sidebar from '$lib/components/layout/Sidebar.svelte';

test('muestra navegación correctamente', () => {
  const { getByText } = render(Sidebar, { props: { ... } });
  expect(getByText('Dashboard')).toBeInTheDocument();
});
```

## 🔄 Flujo de renderizado

```
Usuario visita: /dashboard

1. routes/(app)/+layout.server.ts
   ↓ Carga datos del usuario, sesión, etc.

2. routes/(app)/+layout.svelte
   ↓ Recibe data, renderiza AppLayout
   
3. lib/components/layout/AppLayout.svelte
   ↓ Renderiza Sidebar + Header + Content
   
4. <slot /> dentro de AppLayout
   ↓ Renderiza routes/(app)/dashboard/+page.svelte
   
5. routes/(app)/dashboard/+page.svelte
   ↓ Usa componentes de lib/components/dashboard/
```

## 📝 Ejemplo de refactor

### ANTES: +layout.svelte (monolítico)
```svelte
<script lang="ts">
  // 90 líneas de imports y lógica
  import { page } from '$app/stores';
  import { theme } from '$lib/stores/theme';
  import Dropdown from '$lib/components/ui/Dropdown.svelte';
  // ... más imports
  
  let sidebarOpen = $state(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    // ...
  ];
  
  function toggleSidebar() { ... }
  function handleLogout() { ... }
  // ... más funciones
</script>

<div class="app-layout">
  <!-- 600 líneas de HTML + estilos -->
  <aside class="sidebar">...</aside>
  <aside class="sidebar-mobile">...</aside>
  <div class="main-content">
    <header>...</header>
    <main class="content">
      <slot />
    </main>
  </div>
</div>

<style>
  /* 400 líneas de CSS */
</style>
```

### DESPUÉS: +layout.svelte (orquestador)
```svelte
<script lang="ts">
  import AppLayout from '$lib/components/layout/AppLayout.svelte';
  
  let { data } = $props();
</script>

<AppLayout {data}>
  <slot />
</AppLayout>
```

### NUEVO: lib/components/layout/AppLayout.svelte
```svelte
<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  import MobileSidebar from './MobileSidebar.svelte';
  import Header from './Header.svelte';
  import { sidebarStore } from '$lib/stores/sidebar';
  
  let { data, children } = $props();
  
  const { isOpen, toggle, close } = sidebarStore;
</script>

<div class="app-layout">
  <Sidebar {data} />
  <MobileSidebar {data} isOpen={$isOpen} onClose={close} />
  
  <div class="main-content">
    <Header {data} onToggleSidebar={toggle} />
    
    <main class="content">
      {@render children()}
    </main>
  </div>
</div>

<style lang="scss">
  @import '$lib/styles/mixins';
  
  .app-layout {
    display: flex;
    min-height: 100vh;
  }
  
  .main-content {
    flex: 1;
    margin-left: 260px;
    
    @include responsive(lg-down) {
      margin-left: 0;
    }
  }
  
  .content {
    flex: 1;
    padding: var(--space-6);
    overflow-y: auto;
  }
</style>
```

### NUEVO: lib/components/layout/Sidebar.svelte
```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import Navigation from './Navigation.svelte';
  import UserMenu from './UserMenu.svelte';
  import { FileText } from 'lucide-svelte';
  
  let { data } = $props();
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="logo">
      <FileText size={32} />
      <span>PAS Manager</span>
    </div>
  </div>
  
  <Navigation currentPath={$page.url.pathname} />
  
  <div class="sidebar-footer">
    <UserMenu userProfile={data.userProfile} user={data.session?.user} />
  </div>
</aside>

<style lang="scss">
  @import '$lib/styles/mixins';
  
  .sidebar {
    width: 260px;
    background: var(--bg-primary);
    border-right: 1px solid var(--border-primary);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: var(--z-fixed);
    
    @include responsive(lg-down) {
      display: none;
    }
  }
  
  .sidebar-header {
    padding: var(--space-6) var(--space-4);
    border-bottom: 1px solid var(--border-primary);
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--primary-600);
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
  }
  
  .sidebar-footer {
    padding: var(--space-4);
    border-top: 1px solid var(--border-primary);
  }
</style>
```

### NUEVO: lib/config/navigation.ts
```ts
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings 
} from 'lucide-svelte';

export const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Clientes', 
    href: '/clientes', 
    icon: Users 
  },
  { 
    name: 'Pólizas', 
    href: '/polizas', 
    icon: FileText 
  },
  { 
    name: 'Configuración', 
    href: '/configuracion', 
    icon: Settings 
  }
];
```

## 🚀 Plan de migración

### Fase 1: Extraer componentes del layout
- [ ] Crear `lib/components/layout/`
- [ ] Extraer `Sidebar.svelte`
- [ ] Extraer `MobileSidebar.svelte`
- [ ] Extraer `Header.svelte`
- [ ] Extraer `Navigation.svelte`
- [ ] Extraer `UserMenu.svelte`

### Fase 2: Crear AppLayout wrapper
- [ ] Crear `AppLayout.svelte`
- [ ] Mover estilos globales del layout
- [ ] Simplificar `+layout.svelte`

### Fase 3: Reorganizar componentes por feature
- [ ] Mover `PolicyCard.svelte` a `routes/(app)/polizas/components/`
- [ ] Crear componentes de dashboard en `lib/components/dashboard/`
- [ ] Crear componentes de clientes si es necesario

### Fase 4: Extraer configuración
- [ ] Crear `lib/config/navigation.ts`
- [ ] Crear `lib/stores/sidebar.ts`

## 🎨 Resultado esperado

### Estructura de carpetas final:
```
src/
├── lib/
│   ├── components/
│   │   ├── layout/        ← Shell de la app (7 componentes)
│   │   ├── dashboard/     ← Features del dashboard
│   │   └── ui/            ← Base components
│   ├── config/
│   │   └── navigation.ts  ← Config centralizada
│   └── stores/
│       └── sidebar.ts     ← Estado del sidebar
│
└── routes/
    └── (app)/
        ├── +layout.svelte    ← 20 líneas (vs 690)
        ├── dashboard/
        ├── clientes/
        │   └── components/   ← Co-located con la feature
        └── polizas/
            └── components/   ← Co-located con la feature
```

### Métricas de mejora:
- **+layout.svelte**: 690 líneas → 20 líneas (-97%)
- **Componentes**: 1 monolítico → 7+ modulares
- **Testabilidad**: ❌ → ✅
- **Reusabilidad**: ❌ → ✅
- **Mantenibilidad**: ⭐⭐ → ⭐⭐⭐⭐⭐

## 💡 Conclusión

El `<slot />` de SvelteKit ya está funcionando correctamente. El problema es la **organización del código**, no la arquitectura del layout.

¿Quieres que proceda con la refactorización?
