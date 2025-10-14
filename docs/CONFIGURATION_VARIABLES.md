# Variables de Configuración

## 📋 Descripción

Sistema de gestión de variables de configuración personalizadas para cada empresa. Permite almacenar y gestionar configuraciones específicas del negocio como tasas de comisión, monedas por defecto, umbrales de alertas, y cualquier otro dato configurable.

## 🎯 Características

### ✅ Funcionalidad Implementada

1. **API REST Completa**
   - `GET /api/config` - Lista todas las variables
   - `POST /api/config` - Crea nueva variable
   - `PUT /api/config/[id]` - Actualiza variable existente
   - `DELETE /api/config/[id]` - Elimina variable

2. **Interfaz de Usuario**
   - Pestaña "Variables" en página de configuración
   - Formulario para crear/editar variables
   - Tabla con listado de variables existentes
   - Validación y mensajes de error

3. **Características de Seguridad**
   - Solo administradores pueden gestionar variables
   - Variables protegidas del sistema no se pueden eliminar
   - Validación de claves únicas por empresa
   - Row Level Security (RLS) en base de datos

## 📊 Base de Datos

### Tabla: `configuration`

```sql
CREATE TABLE public.configuration (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  config_key VARCHAR(100) NOT NULL,
  config_value JSONB NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  updated_by UUID,
  UNIQUE(company_id, config_key)
);
```

### Variables del Sistema (Protegidas)

Estas variables se crean automáticamente y no se pueden eliminar:

1. **`payment_modes`**
   - Modos de pago disponibles
   - Valor: `["monthly", "quarterly", "semi-annual", "annual"]`

2. **`policy_types`**
   - Tipos de pólizas disponibles
   - Valor: `["auto", "home", "life", "health", "business", "other"]`

3. **`alert_settings`**
   - Configuración de alertas
   - Valor: `{"default_alert_days": 30}`

## 🔧 Uso

### Crear Variable

1. Ir a **Configuración** → **Variables**
2. Completar formulario:
   - **Clave**: Identificador único (snake_case recomendado)
   - **Valor**: Texto, número o JSON
3. Clic en **Crear Variable**

### Ejemplos de Variables

#### Variable Simple (texto)
```
Clave: default_currency
Valor: EUR
```

#### Variable Numérica
```
Clave: commission_rate
Valor: 0.05
```

#### Variable JSON (objeto)
```
Clave: email_settings
Valor: {"from": "noreply@empresa.com", "reply_to": "soporte@empresa.com"}
```

#### Variable JSON (array)
```
Clave: priority_levels
Valor: ["baja", "media", "alta", "crítica"]
```

### Editar Variable

1. Clic en icono de editar (✏️) en la tabla
2. Modificar el **Valor** (la clave no se puede cambiar)
3. Clic en **Actualizar**

### Eliminar Variable

1. Clic en icono de eliminar (🗑️) en la tabla
2. Confirmar eliminación
3. ⚠️ Variables del sistema no se pueden eliminar

## 🔐 Permisos

| Rol | Ver Variables | Crear | Editar | Eliminar |
|-----|--------------|-------|--------|----------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **User** | ✅ | ❌ | ❌ | ❌ |

## 📝 API Endpoints

### GET /api/config
Obtiene todas las variables de configuración de la empresa.

**Response:**
```json
{
  "configs": [
    {
      "id": "uuid",
      "company_id": "uuid",
      "config_key": "commission_rate",
      "config_value": 0.05,
      "created_at": "2025-01-10T10:00:00Z",
      "updated_at": "2025-01-10T10:00:00Z",
      "updated_by": "uuid"
    }
  ]
}
```

### POST /api/config
Crea una nueva variable de configuración.

**Request:**
```json
{
  "config_key": "default_currency",
  "config_value": "EUR"
}
```

**Response:**
```json
{
  "config": { ... },
  "message": "Configuración creada exitosamente"
}
```

### PUT /api/config/[id]
Actualiza una variable existente.

**Request:**
```json
{
  "config_key": "default_currency",  // opcional
  "config_value": "USD"              // opcional
}
```

**Response:**
```json
{
  "config": { ... },
  "message": "Configuración actualizada exitosamente"
}
```

### DELETE /api/config/[id]
Elimina una variable de configuración.

**Response:**
```json
{
  "message": "Configuración eliminada exitosamente"
}
```

**Error (variable protegida):**
```json
{
  "message": "No se puede eliminar esta configuración del sistema"
}
```

## 🎨 UI/UX

### Formulario
- Campo de clave con validación única
- Campo de valor con soporte para JSON multilínea
- Ayuda contextual para formato de valores
- Validación en tiempo real

### Tabla
- Claves mostradas en formato `monospace`
- Valores truncados si son muy largos
- Fecha de última actualización
- Botones de acción (editar/eliminar)

### Estados
- Loading skeleton durante carga
- Empty state cuando no hay variables
- Mensajes de éxito/error con toasts
- Confirmación antes de eliminar

## 💡 Casos de Uso

### 1. Tasas y Comisiones
```json
{
  "config_key": "commission_rates",
  "config_value": {
    "auto": 0.05,
    "home": 0.03,
    "life": 0.08
  }
}
```

### 2. Configuración de Email
```json
{
  "config_key": "email_templates",
  "config_value": {
    "welcome": "template_001",
    "renewal_reminder": "template_002",
    "policy_expiry": "template_003"
  }
}
```

### 3. Umbrales de Alertas
```json
{
  "config_key": "alert_thresholds",
  "config_value": {
    "days_before_expiry": 30,
    "days_critical": 7,
    "max_pending_policies": 100
  }
}
```

### 4. Configuración Regional
```json
{
  "config_key": "regional_settings",
  "config_value": {
    "currency": "EUR",
    "locale": "es-ES",
    "timezone": "Europe/Madrid",
    "date_format": "DD/MM/YYYY"
  }
}
```

## 🔄 Integración con Código

### Ejemplo: Leer configuración en el frontend

```typescript
// Cargar todas las variables
const response = await fetch('/api/config');
const { configs } = await response.json();

// Buscar variable específica
const commissionRate = configs.find(c => c.config_key === 'commission_rate');
const rate = commissionRate?.config_value || 0.05; // valor por defecto
```

### Ejemplo: Usar configuración en el backend

```typescript
// En un endpoint
const { data: config } = await supabase
  .from('configuration')
  .select('config_value')
  .eq('company_id', companyId)
  .eq('config_key', 'commission_rate')
  .single();

const rate = config?.config_value || 0.05;
```

## ✅ Testing

### Manual Testing Checklist

- [ ] Crear variable con texto simple
- [ ] Crear variable con número
- [ ] Crear variable con JSON válido
- [ ] Crear variable con JSON inválido (debe mostrar error)
- [ ] Crear variable con clave duplicada (debe fallar)
- [ ] Editar variable existente
- [ ] Intentar editar clave de variable (debe estar deshabilitado)
- [ ] Eliminar variable custom
- [ ] Intentar eliminar variable protegida (debe fallar)
- [ ] Ver variables como usuario no-admin (solo lectura)
- [ ] Intentar crear/editar como usuario no-admin (debe fallar)

## 📚 Próximas Mejoras

- [ ] Editor JSON con syntax highlighting
- [ ] Validación de esquema para variables del sistema
- [ ] Historial de cambios en variables
- [ ] Importar/exportar configuraciones
- [ ] Variables con tipos definidos (string, number, boolean, json)
- [ ] Búsqueda y filtrado de variables
- [ ] Agrupación de variables por categoría
- [ ] Documentación inline para cada variable

## 🐛 Troubleshooting

### Error: "Esta clave ya existe"
- La clave debe ser única por empresa
- Usa una clave diferente o edita la existente

### Error: "No se puede eliminar esta configuración del sistema"
- Las variables protegidas no se pueden eliminar
- Solo puedes editar su valor

### JSON inválido al guardar
- Verifica que el JSON esté bien formado
- Usa comillas dobles `"` para strings
- No olvides comas entre elementos

### No veo el botón de crear/editar
- Solo administradores pueden gestionar variables
- Verifica tu rol en la pestaña "Usuarios"

---

**Última actualización:** 2025-01-13  
**Versión:** 1.0
