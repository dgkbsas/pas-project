# Configuración de Empresa

## 📋 Descripción

Sistema de configuración normalizado por empresa. Cada empresa tiene **una única fila** en la tabla `company_config` que contiene toda su configuración: opciones simples (moneda, zona horaria) y arrays de configuración estructurados para modos de pago, tipos de póliza y tipos de seguimiento.

## 🎯 Características

### ✅ Funcionalidad Implementada

1. **API REST Completa**
   - `GET /api/config` - Obtiene toda la configuración de la empresa
   - `PATCH /api/config` - Actualiza campos específicos de configuración
   - `GET /api/config/[field]` - Obtiene un campo específico
   - `PUT /api/config/[field]` - Reemplaza un campo completo
   - `POST /api/config/[field]` - Agrega/actualiza items en arrays de configuración
   - `DELETE /api/config/[field]?itemKey=xxx` - Soft-delete de items (marca como inactivo)

2. **Interfaz de Usuario**
   - Gestión visual de modos de pago, tipos de póliza y tipos de seguimiento
   - Agregar nuevos items con auto-generación de `key`
   - Editar labels (el `key` es inmutable)
   - Soft delete con toggle activo/inactivo
   - Visualización de items inactivos (opcional)

3. **Características de Seguridad**
   - Solo administradores pueden modificar la configuración
   - Row Level Security (RLS) en base de datos
   - Validación de permisos en API

## 📊 Base de Datos

### Tabla: `company_config`

Estructura normalizada - **una fila por empresa**:

```sql
CREATE TABLE public.company_config (
  company_id UUID PRIMARY KEY REFERENCES companies(id),

  -- Valores simples
  currency VARCHAR(10) DEFAULT 'ARS',
  date_format VARCHAR(50) DEFAULT 'DD/MM/YYYY',
  timezone VARCHAR(100) DEFAULT 'America/Argentina/Buenos_Aires',
  default_alert_days INTEGER DEFAULT 30,

  -- Arrays de configuración (JSONB)
  -- Estructura: [{"key": "monthly", "value": "Mensual", "active": true}, ...]
  payment_modes JSONB DEFAULT '[...]',
  policy_types JSONB DEFAULT '[...]',
  followup_types JSONB DEFAULT '[...]',

  -- Objetos de configuración (JSONB)
  alert_settings JSONB DEFAULT '{"days_before_expiry": 30, ...}',
  email_settings JSONB DEFAULT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);
```

### Estructura de Items de Configuración

Cada item en los arrays (`payment_modes`, `policy_types`, `followup_types`) tiene esta estructura:

```typescript
{
  key: string;      // Identificador técnico (slug) - INMUTABLE
  value: string;    // Label mostrado al usuario - EDITABLE
  active: boolean;  // Estado (true/false) para soft-delete
}
```

**Ejemplo:**
```json
{
  "key": "monthly",
  "value": "Mensual",
  "active": true
}
```

### Valores por Defecto

#### Payment Modes
```json
[
  {"key": "monthly", "value": "Mensual", "active": true},
  {"key": "quarterly", "value": "Trimestral", "active": true},
  {"key": "semi_annual", "value": "Semestral", "active": true},
  {"key": "annual", "value": "Anual", "active": true}
]
```

#### Policy Types
```json
[
  {"key": "auto", "value": "Auto", "active": true},
  {"key": "home", "value": "Hogar", "active": true},
  {"key": "life", "value": "Vida", "active": true},
  {"key": "health", "value": "Salud", "active": true},
  {"key": "business", "value": "Comercio", "active": true},
  {"key": "other", "value": "Otro", "active": true}
]
```

#### Followup Types
```json
[
  {"key": "call", "value": "Llamada", "active": true},
  {"key": "email", "value": "Email", "active": true},
  {"key": "meeting", "value": "Reunión", "active": true},
  {"key": "renewal", "value": "Renovación", "active": true},
  {"key": "claim", "value": "Siniestro", "active": true}
]
```

## 🔧 Uso en UI

### Agregar Nuevo Item

1. Ir a **Configuración** → **Variables**
2. Seleccionar la sección (Modos de Pago, Tipos de Póliza, etc.)
3. Clic en **"Agregar..."**
4. Ingresar el **nombre** (ej: "Pago Único")
5. El sistema auto-genera el `key` (ej: "pago_unico")
6. Clic en **Agregar**

### Editar Item Existente

1. Clic en el icono de **editar (✏️)**
2. Modificar el **nombre** (el `key` no se puede cambiar)
3. Clic en **guardar (✓)**

**Nota:** El `key` es inmutable para mantener referencias en pólizas existentes.

### Desactivar Item

1. Clic en el icono de **eliminar (🗑️)**
2. Confirmar la desactivación
3. El item se marca como `active: false`
4. No aparece en formularios nuevos
5. Las pólizas existentes mantienen su referencia

### Reactivar Item

1. Marcar checkbox **"Mostrar items inactivos"**
2. Clic en el icono de **activar (✓)** en el item inactivo
3. El item vuelve a aparecer en formularios

## 📝 API Endpoints

### GET /api/config

Obtiene **toda** la configuración de la empresa.

**Response:**
```json
{
  "config": {
    "company_id": "uuid",
    "currency": "ARS",
    "date_format": "DD/MM/YYYY",
    "timezone": "America/Argentina/Buenos_Aires",
    "default_alert_days": 30,
    "payment_modes": [
      {"key": "monthly", "value": "Mensual", "active": true},
      {"key": "quarterly", "value": "Trimestral", "active": true}
    ],
    "policy_types": [...],
    "followup_types": [...],
    "alert_settings": {...},
    "email_settings": null,
    "created_at": "2025-01-17T00:00:00Z",
    "updated_at": "2025-01-17T00:00:00Z"
  }
}
```

### PATCH /api/config

Actualiza campos específicos de la configuración.

**Request:**
```json
{
  "currency": "USD",
  "default_alert_days": 45
}
```

**Response:**
```json
{
  "config": {...},
  "message": "Configuración actualizada exitosamente"
}
```

### POST /api/config/[field]

Agrega o actualiza un item en un array de configuración.

**Ejemplo:** `POST /api/config/payment_modes`

**Request:**
```json
{
  "value": "Pago Único",
  "active": true
}
```

**Response:**
```json
{
  "config": {...},
  "item": {"key": "pago_unico", "value": "Pago Único", "active": true},
  "message": "Item agregado exitosamente"
}
```

### DELETE /api/config/[field]?itemKey=xxx

Soft-delete (toggle) del estado activo de un item.

**Ejemplo:** `DELETE /api/config/payment_modes?itemKey=monthly`

**Response:**
```json
{
  "config": {...},
  "message": "Item desactivado exitosamente"
}
```

## 🔄 Integración con Código

### Frontend: Obtener configuración

```typescript
import { getActiveItems } from '$lib/utils/configHelpers';

// Cargar toda la configuración
const response = await fetch('/api/config');
const { config } = await response.json();

// Obtener solo items activos
const activePaymentModes = getActiveItems(config.payment_modes);
// [{"key": "monthly", "value": "Mensual", "active": true}, ...]

// Convertir a options para Select
const paymentOptions = activePaymentModes.map(item => ({
  value: item.key,
  label: item.value
}));
```

### Backend: Usar configuración

```typescript
// Obtener configuración de la empresa
const { data: config } = await supabase
  .from('company_config')
  .select('*')
  .eq('company_id', companyId)
  .single();

// Acceder a campos simples
const currency = config.currency || 'ARS';

// Filtrar items activos
const activePolicyTypes = config.policy_types?.filter(t => t.active) || [];
```

## 🔐 Permisos

| Rol | Ver Config | Editar | Agregar Items | Desactivar Items |
|-----|------------|--------|---------------|------------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Agent** | ✅ | ❌ | ❌ | ❌ |
| **Guest** | ✅ | ❌ | ❌ | ❌ |

## 💡 Ventajas del Nuevo Sistema

### ✅ vs Sistema Anterior (EAV)

| Aspecto | Anterior (EAV) | Actual (Normalizado) |
|---------|----------------|----------------------|
| **Consultas** | Múltiples filas por empresa | 1 sola fila por empresa |
| **Performance** | Joins necesarios | Acceso directo |
| **Type Safety** | Tipos dinámicos | Tipos conocidos |
| **Código** | Más complejo | Más simple |
| **Flexibilidad** | Alta (cualquier campo) | Media (campos definidos) |

### Estructura de Keys

- **Automático**: El `key` se genera automáticamente desde el `value`
- **Inmutable**: No se puede cambiar para mantener integridad referencial
- **Slug-ificado**: Sin espacios, acentos ni caracteres especiales
- **Lowercase**: Todo en minúsculas para consistencia

**Ejemplo:**
- Input: `"Seguros Personales"`
- Key generado: `"seguros_personales"`

## 📚 Próximas Mejoras

- [ ] UI para editar configuraciones simples (moneda, zona horaria, etc.)
- [ ] Validación de unicidad de `value` al agregar items
- [ ] Historial de cambios en configuración
- [ ] Importar/exportar configuración
- [ ] Reordenar items (drag & drop)
- [ ] Iconos personalizados por tipo
- [ ] Colores personalizados por item

## 🐛 Troubleshooting

### El item no aparece en los formularios

- Verifica que el item esté marcado como `active: true`
- Refresca la página para cargar la configuración actualizada

### No puedo cambiar el "key" de un item

- El `key` es inmutable por diseño para mantener referencias
- Solo puedes cambiar el `value` (label mostrado)

### Los items desactivados siguen apareciendo

- Los items desactivados se mantienen para pólizas existentes
- En formularios nuevos solo aparecen items activos
- Usa "Mostrar items inactivos" en la UI para verlos

---

**Última actualización:** 2025-01-17
**Versión:** 2.0 (Sistema Normalizado)
