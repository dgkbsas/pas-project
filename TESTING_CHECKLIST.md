# 🧪 Checklist de Pruebas - PAS Manager

## ✅ Completadas

- [x] Logout endpoint creado
- [x] Dropdown de aseguradoras en PolicyModal
- [x] Estilos unificados de dropdowns
- [x] RLS policies documentadas
- [x] Vista de actividades creada
- [x] Servidor corriendo en http://localhost:5173

---

## 🔍 Pruebas Funcionales

### 1. Autenticación ✓

#### Test 1.1: Login
- [ ] Abre http://localhost:5173
- [ ] Verifica que redirige a /auth/login si no estás autenticado
- [ ] Ingresa tus credenciales
- [ ] Verifica que redirige a /dashboard después del login
- [ ] ✅ **Login funciona**

#### Test 1.2: Logout
- [ ] Click en tu avatar/nombre (arriba a la derecha)
- [ ] Click en "Cerrar Sesión"
- [ ] Verifica que aparece toast "Sesión cerrada exitosamente"
- [ ] Verifica que redirige a /auth/login
- [ ] ✅ **Logout funciona**

#### Test 1.3: Protección de rutas
- [ ] Intenta acceder a /dashboard sin estar autenticado
- [ ] Verifica que redirige a /auth/login
- [ ] ✅ **Rutas protegidas funcionan**

---

### 2. RLS Policies (Seguridad) 🔒

#### Test 2.1: Aplicar RLS
- [ ] Abre https://app.supabase.com
- [ ] SQL Editor → New query
- [ ] Pega el contenido de `migrations/enable-rls-policies.sql`
- [ ] Click "Run"
- [ ] Verifica que aparecen 2 tablas de resultados:
  - Tabla 1: RLS enabled = true para todas las tablas
  - Tabla 2: Lista de ~30 políticas creadas
- [ ] ✅ **RLS policies aplicadas**

#### Test 2.2: Verificar que la app funciona CON RLS
- [ ] Haz login en la app
- [ ] Ve a /clientes
- [ ] Verifica que puedes ver la lista de clientes
- [ ] Ve a /polizas
- [ ] Verifica que puedes ver la lista de pólizas
- [ ] ✅ **App funciona con RLS habilitado**

#### Test 2.3: Verificar que solo ves datos de tu empresa
- [ ] En Supabase Dashboard → Table Editor
- [ ] Abre tabla "users"
- [ ] Busca tu email y anota tu `company_id`
- [ ] Abre tabla "clients"
- [ ] Verifica que todos los clientes tienen el mismo `company_id`
- [ ] ✅ **Datos filtrados por empresa**

---

### 3. Dropdown de Aseguradoras 📋

#### Test 3.1: Editar póliza - Ver dropdown
- [ ] Ve a /polizas
- [ ] Click en el ícono de "ojo" en cualquier póliza
- [ ] Click en el botón de "editar" (lápiz)
- [ ] Busca el campo "Aseguradora"
- [ ] Verifica que es un **dropdown** (no un input de texto)
- [ ] Verifica que muestra opciones de aseguradoras
- [ ] ✅ **Dropdown de aseguradoras visible**

#### Test 3.2: Seleccionar aseguradora
- [ ] Abre el dropdown de aseguradoras
- [ ] Selecciona una aseguradora diferente
- [ ] Click "Guardar Cambios"
- [ ] Verifica que se guarda correctamente
- [ ] ✅ **Dropdown funciona correctamente**

---

### 4. Estilos Unificados de Dropdowns 🎨

#### Test 4.1: Clientes - Sort dropdown
- [ ] Ve a /clientes
- [ ] Busca el dropdown "Ordenar por:"
- [ ] Verifica el estilo:
  - ✅ Border gris claro
  - ✅ Padding consistente
  - ✅ Al hacer hover, border azul
  - ✅ Al hacer focus, sombra azul suave

#### Test 4.2: Pólizas - Sort dropdown
- [ ] Ve a /polizas
- [ ] Busca el dropdown "Ordenar por:"
- [ ] Verifica que tiene el **mismo estilo** que en /clientes

#### Test 4.3: PolicyModal - Dropdowns
- [ ] Edita cualquier póliza
- [ ] Verifica que los dropdowns:
  - "Tipo de Póliza"
  - "Aseguradora"
  - "Forma de Pago"
- [ ] Tienen el **mismo estilo** que los otros dropdowns
- [ ] ✅ **Todos los dropdowns tienen estilos consistentes**

---

### 5. Vista de Actividades 📊

#### Test 5.1: Acceso desde Dashboard
- [ ] Ve a /dashboard
- [ ] Busca la sección "Actividad Reciente"
- [ ] Al final, click en "Ver todas las actividades"
- [ ] Verifica que redirige a /actividades
- [ ] ✅ **Link funciona**

#### Test 5.2: Vista de actividades
- [ ] Verifica que la página /actividades carga correctamente
- [ ] Verifica que muestra actividades de:
  - 👥 Clientes (icono azul)
  - 📋 Pólizas (icono verde)
  - 📝 Seguimientos (icono celeste)
- [ ] Verifica que cada actividad muestra:
  - Título
  - Descripción
  - Badge con el tipo
  - Nombre del cliente
  - Fecha y hora
- [ ] ✅ **Vista de actividades se muestra correctamente**

#### Test 5.3: Infinite Scroll
- [ ] Scroll hacia abajo en /actividades
- [ ] Verifica que al llegar al final, carga más actividades automáticamente
- [ ] Verifica que muestra un indicador de carga
- [ ] Verifica que el contador "X / Total" se actualiza
- [ ] ✅ **Infinite scroll funciona**

#### Test 5.4: Filtros
- [ ] Click en el botón de filtros (🔍)
- [ ] Se abre el panel de filtros
- [ ] Prueba filtrar por:
  - **Tipo**: Selecciona solo "Clientes"
  - Verifica que solo muestra clientes
  - Deselecciona "Clientes", selecciona "Pólizas"
  - Verifica que solo muestra pólizas
- [ ] Prueba filtrar por **fecha**:
  - Selecciona "Desde" (fecha de hace 1 mes)
  - Selecciona "Hasta" (hoy)
  - Verifica que filtra correctamente
- [ ] Click "Limpiar filtros"
- [ ] Verifica que vuelve a mostrar todas las actividades
- [ ] ✅ **Filtros funcionan correctamente**

#### Test 5.5: Ordenamiento
- [ ] Click en el botón "Fecha" con las flechas
- [ ] Verifica que cambia de descendente (↓) a ascendente (↑)
- [ ] Verifica que las actividades se reordenan
- [ ] ✅ **Ordenamiento funciona**

---

## 📱 Pruebas Mobile (Opcional)

#### Test 6.1: Responsive en móvil
- [ ] Abre DevTools (F12)
- [ ] Click en el ícono de móvil (o Cmd+Shift+M)
- [ ] Selecciona "iPhone 12 Pro" o similar
- [ ] Navega por:
  - /dashboard
  - /clientes
  - /polizas
  - /actividades
- [ ] Verifica que todo se ve bien en mobile
- [ ] ✅ **Diseño responsive funciona**

---

## 🐛 Problemas Encontrados

Si encuentras algún problema, anótalo aquí:

### Problema 1:
- **Descripción**:
- **Pasos para reproducir**:
- **Esperado vs Actual**:

### Problema 2:
- **Descripción**:
- **Pasos para reproducir**:
- **Esperado vs Actual**:

---

## 📊 Resumen

- **Total de pruebas**: 20
- **Completadas**: ___
- **Fallidas**: ___
- **Omitidas**: ___

---

## 🎉 Cuando todo funcione

✅ Todas las pruebas pasaron
✅ RLS policies aplicadas y funcionando
✅ Autenticación completa (login/logout)
✅ Dropdowns unificados y consistentes
✅ Vista de actividades con infinite scroll y filtros

**¡El sistema está listo para usar!** 🚀

---

**Fecha de prueba**: _______________
**Testeado por**: _______________
