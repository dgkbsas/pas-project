# Configuración del Proyecto

## 1. Instalar nvm (Node Version Manager) - Solo una vez

Si aún no tienes nvm instalado:

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Cerrar y abrir la terminal, o ejecutar:
source ~/.zshrc  # Si usas zsh
# o
source ~/.bashrc  # Si usas bash
```

## 2. Usar Node 22 para este proyecto

```bash
# Ir al directorio del proyecto
cd /Users/dgk/Desktop/localDevelop/007PasProject

# nvm leerá el archivo .nvmrc y usará Node 22 automáticamente
nvm install  # Primera vez (instala Node 22)
nvm use      # Activa Node 22 para este proyecto

# Verificar que estás usando Node 22
node --version  # Debería mostrar v22.x.x
```

## 3. Instalar pnpm

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar instalación
pnpm --version
```

## 4. Instalar dependencias del proyecto

```bash
# Limpiar instalación anterior de npm
rm -rf node_modules package-lock.json

# Instalar con pnpm
pnpm install
```

## 5. Ejecutar SQL en Supabase

Antes de iniciar el proyecto, ejecuta el schema SQL:

1. Ve a: https://supabase.com/dashboard/project/cnwaaqvgwndsovmbchxp
2. Click en "SQL Editor" en el menú lateral
3. Click en "New query"
4. Copia y pega todo el contenido de `supabase/schema.sql`
5. Click en "Run"

## 6. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

El proyecto estará disponible en: http://localhost:5173

## Notas importantes

- **Este proyecto usará Node 22** (por el archivo `.nvmrc`)
- **Tus otros proyectos seguirán usando sus propias versiones**
- Cada vez que abres una terminal en este proyecto, ejecuta `nvm use` para activar Node 22
- O configura tu shell para que lea `.nvmrc` automáticamente

### Configurar carga automática de .nvmrc (Opcional)

Agrega esto a tu `~/.zshrc` o `~/.bashrc`:

```bash
# Auto-cargar Node version desde .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local nvmrc_path="$(nvm_find_nvmrc)"
  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

Así cuando entres a este proyecto, automáticamente usará Node 22.
