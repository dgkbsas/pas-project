# Sistema de Autenticación Global - PAS Manager

## 📚 Tabla de Contenidos

1. [Vista General](#vista-general)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Arquitectura](#arquitectura)
4. [Componentes Clave](#componentes-clave)
5. [Protección de Rutas](#protección-de-rutas)
6. [Stores y Estado Global](#stores-y-estado-global)
7. [Cliente Supabase](#cliente-supabase)
8. [Ejemplos de Uso](#ejemplos-de-uso)

## Vista General

### ¿Cómo funciona?

PAS Manager usa **Supabase Auth** + **SvelteKit Hooks** para autenticación global. El sistema garantiza que:

- ✅ Solo usuarios autenticados acceden a la app
- ✅ Los datos del usuario están disponibles en toda la app
- ✅ Las sesiones se verifican en cada petición
- ✅ El cliente Supabase está configurado correctamente con cookies

### Componentes principales:

```
┌─────────────────────────────────────────────────────┐
│                  ARQUITECTURA                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. hooks.server.ts (Server)                        │
│     ↓ Intercepta TODAS las peticiones               │
│     ↓ Crea cliente Supabase con cookies             │
│     ↓ Verifica sesión                                │
│                                                      │
│  2. +layout.server.ts (Server)                      │
│     ↓ Carga datos de sesión y usuario               │
│     ↓ Pasa datos a cliente                           │
│                                                      │
│  3. +layout.svelte (Cliente)                        │
│     ↓ Renderiza AppLayout                            │
│     ↓ Escucha cambios de auth                        │
│                                                      │
│  4. Componentes (Cliente)                           │
│     ↓ Acceden a data.session / data.user             │
│     ↓ Usan cliente Supabase para queries            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Flujo de Autenticación

### 1. Usuario NO autenticado

```
Usuario visita /dashboard
  ↓
hooks.server.ts verifica sesión
  ↓
session = null
  ↓
Ruta protegida? SI
  ↓
Redirect → /auth/login
```

### 2. Usuario inicia sesión

```
Usuario envía credentials en /auth/login
  ↓
+page.server.ts ejecuta action "login"
  ↓
await supabase.auth.signInWithPassword()
  ↓
Success! Supabase crea sesión
  ↓
Cookies configuradas automáticamente
  ↓
Redirect → /dashboard
  ↓
hooks.server.ts detecta sesión válida
  ↓
Permite acceso ✅
```

### 3. Usuario navega en la app

```
Usuario navega /clientes → /polizas → /dashboard
  ↓
+layout.svelte (root) permanece montado
  ↓
Solo cambia el contenido del <slot />
  ↓
NO hay re-autenticación
  ↓
Sesión ya verificada en hooks.server.ts
```

### 4. Usuario cierra sesión

```
Usuario click en "Cerrar Sesión"
  ↓
UserMenu.svelte ejecuta handleLogout()
  ↓
POST /api/auth/logout
  ↓
await supabase.auth.signOut()
  ↓
Cookies eliminadas
  ↓
Redirect → /auth/login
```

## Arquitectura

### Flujo completo de una petición:

```typescript
// 1. Usuario visita cualquier página
GET /dashboard

// 2. hooks.server.ts (SIEMPRE se ejecuta primero)
export const handle: Handle = async ({ event, resolve }) => {
  // Crea cliente Supabase con cookies
  event.locals.supabase = createServerClient(...);

  // Función segura para obtener sesión
  event.locals.safeGetSession = async () => {
    const { data: { user } } = await event.locals.supabase.auth.getUser();
    // ... obtiene session solo si user existe
    return { session, user };
  };

  return resolve(event);
}

// 3. +layout.server.ts (Carga datos para toda la app)
export const load: LayoutServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  // Carga perfil del usuario
  const { data: userProfile } = await locals.supabase
    .from('users')
    .select('*')
    .eq('id', user?.id)
    .single();

  return {
    session,  // ← Disponible en TODA la app
    userProfile  // ← Disponible en TODA la app
  };
}

// 4. hooks.server.ts (Parte 2 - Protección de rutas)
// Después de resolve, verifica rutas protegidas
if (!session && !publicRoutes.includes(url.pathname)) {
  throw redirect(303, '/auth/login');
}

// 5. +layout.svelte (Cliente)
// Escucha cambios de autenticación
onMount(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
      invalidate('supabase:auth');  // Revalida datos
    }
  });
});
```

## Componentes Clave

### 1. `hooks.server.ts` - El Guardian

**Ubicación**: `/src/hooks.server.ts`

**Responsabilidades**:
- Intercepta TODAS las peticiones server-side
- Crea cliente Supabase configurado con cookies
- Proporciona `locals.supabase` y `locals.safeGetSession`
- Protege rutas automáticamente

**Código clave**:
```typescript
// src/hooks.server.ts
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';

const publicRoutes = ['/', '/auth/login', '/auth/callback'];

export const handle: Handle = async ({ event, resolve }) => {
  // 1. Crear cliente Supabase CON cookies
  event.locals.supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,  // ← IMPORTANTE: Usa ANON, no SERVICE_ROLE
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' });
          });
        }
      }
    }
  );

  // 2. Función segura para obtener sesión
  event.locals.safeGetSession = async () => {
    const { data: { user }, error } = await event.locals.supabase.auth.getUser();

    let session = null;
    if (user && !error) {
      const { data } = await event.locals.supabase.auth.getSession();
      session = data.session;
    }

    return { session, user };
  };

  // 3. Resolver la petición
  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });

  // 4. Verificar protección de rutas
  const { session } = await event.locals.safeGetSession();
  const url = new URL(event.request.url);

  // Si no hay sesión y la ruta no es pública → redirect
  if (!session && !publicRoutes.includes(url.pathname)) {
    throw redirect(303, '/auth/login');
  }

  return response;
};
```

### 2. `+layout.server.ts` - El Proveedor de Datos

**Ubicación**: `/src/routes/+layout.server.ts`

**Responsabilidades**:
- Carga sesión y usuario para TODA la app
- Carga perfil del usuario desde la BD
- Proporciona datos a través de `$page.data`

**Código clave**:
```typescript
// src/routes/+layout.server.ts
export const load: LayoutServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  // Si hay usuario, cargar su perfil completo
  let userProfile = null;
  if (user) {
    const { data } = await locals.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    userProfile = data;
  }

  return {
    session,      // ← Sesión de Supabase Auth
    userProfile   // ← Perfil de la tabla 'users'
  };
};
```

### 3. `+layout.svelte` - El Observador

**Ubicación**: `/src/routes/+layout.svelte`

**Responsabilidades**:
- Escucha cambios en autenticación
- Invalida datos cuando hay cambios
- Renderiza AppLayout con datos de sesión

**Código clave**:
```typescript
// src/routes/+layout.svelte
<script lang="ts">
  import { supabase } from "$lib/supabase";
  import { onMount } from "svelte";
  import { invalidate } from "$app/navigation";

  let { data, children } = $props();

  onMount(() => {
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Cuando hay login o logout, revalidar datos
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          invalidate("supabase:auth");
        }
      }
    );

    // Cleanup al desmontar
    return () => {
      subscription.unsubscribe();
    };
  });
</script>

{@render children()}
```

### 4. `lib/supabase.ts` - Cliente Lado del Cliente

**Ubicación**: `/src/lib/supabase.ts`

**Responsabilidades**:
- Cliente Supabase para código del navegador
- Usa ANON_KEY (seguro para exponerse)
- NO maneja cookies (eso lo hace el server)

**Código clave**:
```typescript
// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
  // ← NO configurar cookies aquí, el server ya lo hace
);
```

## Protección de Rutas

### Rutas Públicas (sin autenticación)

```typescript
// src/hooks.server.ts
const publicRoutes = [
  '/',                    // Landing page
  '/auth/login',          // Página de login
  '/auth/callback'        // Callback de OAuth
];
```

### Rutas Protegidas (requieren autenticación)

**TODAS las rutas bajo `(app)` están protegidas:**

```
routes/
├── (app)/              ← Grupo de rutas protegidas
│   ├── +layout.server.ts  ← Redirect en el server si no hay sesión
│   ├── dashboard/
│   ├── clientes/
│   ├── polizas/
│   └── configuracion/
└── auth/               ← Rutas públicas
    ├── login/
    └── callback/
```

### Double Protection (Defensa en profundidad)

```typescript
// 1. hooks.server.ts (Global)
if (!session && !publicRoutes.includes(url.pathname)) {
  throw redirect(303, '/auth/login');
}

// 2. +layout.server.ts para (app)
export const load: LayoutServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    throw redirect(303, '/auth/login');
  }

  return { session, userProfile };
};
```

## Stores y Estado Global

### ❌ NO hay un store de auth separado

**¿Por qué?**
Porque Supabase + SvelteKit ya proporciona autenticación global a través de:

1. **`locals.supabase`** en el server (hooks.server.ts)
2. **`$page.data.session`** en el cliente (desde +layout.server.ts)
3. **`supabase.auth.onAuthStateChange()`** para reactividad

### ✅ Cómo acceder a datos de autenticación

**En cualquier componente:**

```svelte
<script lang="ts">
  import { page } from '$app/stores';

  // Reactivo - se actualiza automáticamente
  const session = $derived($page.data.session);
  const user = $derived($page.data.session?.user);
  const userProfile = $derived($page.data.userProfile);
</script>

{#if session}
  <p>Hola, {userProfile?.full_name || user?.email}!</p>
{:else}
  <p>No autenticado</p>
{/if}
```

**En server load functions:**

```typescript
// +page.server.ts
export const load: PageServerLoad = async ({ locals, parent }) => {
  // Opción 1: Usar locals
  const { session, user } = await locals.safeGetSession();

  // Opción 2: Usar parent (datos del layout)
  const { session, userProfile } = await parent();

  if (!session) {
    throw redirect(303, '/auth/login');
  }

  return { session, userProfile };
};
```

## Cliente Supabase

### ¿Cuándo usar cada cliente?

```typescript
// ❌ NUNCA en código cliente
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
// Esto bypassea RLS y es INSEGURO

// ✅ En código cliente (components, pages)
import { supabase } from '$lib/supabase';
const { data } = await supabase.from('clients').select('*');

// ✅ En server-side (load functions, API routes)
export const load = async ({ locals }) => {
  const { data } = await locals.supabase.from('clients').select('*');
};
```

### Diferencias clave:

| Cliente | Ubicación | RLS | Cookies | Uso |
|---------|-----------|-----|---------|-----|
| `locals.supabase` | Server | ✅ Respeta | ✅ Maneja | Load functions, API routes |
| `supabase` (client) | Browser | ✅ Respeta | ❌ No maneja | Components, client-side |
| `createClient(SERVICE_ROLE)` | Server only | ❌ Bypassa | ❌ No usa | Scripts, migrations |

## Ejemplos de Uso

### Ejemplo 1: Componente con Auth

```svelte
<!-- src/lib/components/WelcomeBanner.svelte -->
<script lang="ts">
  import { page } from '$app/stores';

  const user = $derived($page.data.session?.user);
  const userProfile = $derived($page.data.userProfile);
</script>

<div class="welcome">
  <h1>Bienvenido, {userProfile?.full_name || user?.email}!</h1>
  <p>Rol: {userProfile?.role}</p>
</div>
```

### Ejemplo 2: Proteger una página específica

```typescript
// src/routes/(app)/admin/+page.server.ts
export const load: PageServerLoad = async ({ parent }) => {
  const { userProfile } = await parent();

  // Solo admins pueden acceder
  if (userProfile?.role !== 'admin') {
    throw error(403, 'Acceso denegado');
  }

  return {};
};
```

### Ejemplo 3: Query con auth

```typescript
// src/routes/(app)/clientes/+page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  // locals.supabase ya tiene la sesión configurada
  const { data: clients } = await locals.supabase
    .from('clients')
    .select('*')
    .eq('company_id', locals.session.user.company_id);  // ← Filtro por empresa

  return { clients };
};
```

### Ejemplo 4: Logout

```typescript
// src/lib/components/layout/UserMenu.svelte
async function handleLogout() {
  try {
    // 1. Llamar a API endpoint
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      // 2. Redirect a login
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error('Error en logout:', error);
    // Fallback: redirect anyway
    window.location.href = '/auth/login';
  }
}
```

## Seguridad

### ✅ Buenas Prácticas

1. **SIEMPRE usar ANON_KEY en código cliente**
   ```typescript
   // ✅ CORRECTO
   const supabase = createBrowserClient(
     PUBLIC_SUPABASE_URL,
     PUBLIC_SUPABASE_ANON_KEY
   );
   ```

2. **NUNCA exponer SERVICE_ROLE_KEY**
   ```typescript
   // ❌ PELIGRO
   const supabase = createClient(
     PUBLIC_SUPABASE_URL,
     SUPABASE_SERVICE_ROLE_KEY  // ← Esto bypassea RLS!
   );
   ```

3. **Confiar en RLS, no en lógica del código**
   ```typescript
   // ❌ NO confíes solo en esto
   if (user.role === 'admin') {
     // mostrar datos sensibles
   }

   // ✅ RLS en Supabase ya protege
   // Solo mostrará datos que el usuario DEBE ver
   ```

4. **Verificar sesión en server-side**
   ```typescript
   // ✅ CORRECTO - Verificar en el server
   export const load = async ({ locals }) => {
     const { session } = await locals.safeGetSession();
     if (!session) throw redirect(303, '/auth/login');
   };

   // ❌ INCORRECTO - Solo verificar en cliente
   // El usuario puede bypassear esto
   ```

### Flujo de Seguridad

```
Usuario intenta acceder /dashboard
  ↓
1. hooks.server.ts verifica sesión
   ↓ (Sin sesión)
   Redirect → /auth/login

   ↓ (Con sesión)
2. +layout.server.ts carga datos
   ↓
3. RLS policies filtran datos
   ↓ (Solo datos de su empresa)
4. Datos llegan al componente
```

## Debugging

### Ver sesión actual

```typescript
// En cualquier component
<script lang="ts">
  import { page } from '$app/stores';

  $effect(() => {
    console.log('Session:', $page.data.session);
    console.log('User:', $page.data.session?.user);
    console.log('User Profile:', $page.data.userProfile);
  });
</script>
```

### Ver si un usuario está autenticado

```bash
# En el navegador (DevTools Console)
# Después de importar: import { supabase } from '$lib/supabase'

const { data: { user } } = await supabase.auth.getUser();
console.log(user);  // null = no autenticado
```

### Ver cookies de sesión

1. Abrir DevTools
2. Application → Cookies
3. Buscar cookies que empiecen con `sb-`

## Troubleshooting

### "No session found"

**Causa**: Cookies no configuradas o expiradas

**Solución**:
1. Verificar que `hooks.server.ts` configura cookies correctamente
2. Hacer logout y login de nuevo
3. Verificar que las cookies están en el dominio correcto

### "RLS policy violation"

**Causa**: Intentando acceder a datos de otra empresa

**Solución**:
1. Verificar que `company_id` está configurado correctamente
2. Verificar políticas RLS en Supabase
3. Ver `migrations/enable-rls-policies.sql`

### Redirect loop infinito

**Causa**: `+layout.server.ts` y `hooks.server.ts` ambos redirigen

**Solución**:
- Usar solo una verificación de sesión (preferir hooks.server.ts)

## Resumen

### El sistema de autenticación funciona así:

1. **hooks.server.ts**: Guardian global que verifica TODAS las peticiones
2. **+layout.server.ts**: Carga datos de sesión para toda la app
3. **+layout.svelte**: Escucha cambios de auth y revalida
4. **$page.data.session**: Acceso global a sesión en cualquier componente
5. **RLS policies**: Protección a nivel de base de datos

### No necesitas:
- ❌ Un store de auth separado
- ❌ Context API para autenticación
- ❌ Verificación manual en cada página

### Todo está automático:
- ✅ Sesión disponible globalmente
- ✅ Rutas protegidas automáticamente
- ✅ Datos filtrados por RLS
- ✅ Cookies manejadas server-side

---

**Última actualización**: Octubre 2024
