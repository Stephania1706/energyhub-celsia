# EnergyHub Version Management System

Sistema exhaustivo de gestión de versiones para EnergyHub que automatiza el tracking de versiones y mantiene un changelog actualizado.

## 🚀 Características

- **Versionado semántico automático** (Major.Minor.Patch)
- **Actualización automática** de archivos de versión
- **Changelog automático** con formato estándar
- **Tracking de Git** (commit hash y branch)
- **Información de build** (fecha y hora)
- **Scripts pre-build** para actualización automática

## 📁 Archivos del Sistema

- `scripts/version.js` - Script principal de versionado
- `scripts/pre-build.js` - Script que se ejecuta antes de cada build
- `src/lib/version.ts` - Archivo TypeScript con información de versión (auto-generado)
- `CHANGELOG.md` - Registro de cambios (actualizado automáticamente)
- `package.json` - Contiene la versión actual

## 🛠️ Uso

### Comandos Disponibles

```bash
# Incrementar versión patch (1.0.0 -> 1.0.1)
npm run version:patch

# Incrementar versión minor (1.0.0 -> 1.1.0)
npm run version:minor

# Incrementar versión major (1.0.0 -> 2.0.0)
npm run version:major

# Deploy a producción (incrementa patch automáticamente)
npm run version:deploy

# Ver información de versión actual
npm run version:info
```

### Flujo de Trabajo Recomendado

#### Para Deploy a Producción:

```bash
# 1. Ejecutar el script de deploy (incrementa versión automáticamente)
npm run version:deploy

# 2. Revisar y actualizar el CHANGELOG.md con los cambios reales
# Editar CHANGELOG.md manualmente para añadir detalles

# 3. Commit de los cambios
git add -A
git commit -m "chore: bump version to X.X.X"

# 4. Crear tag de versión
git tag -a vX.X.X -m "Release version X.X.X"

# 5. Push a producción
git push origin main --tags
```

#### Para Desarrollo Normal:

```bash
# El script pre-build se ejecuta automáticamente en cada build
npm run build

# Esto actualiza automáticamente:
# - src/lib/version.ts con fecha/hora/commit actuales
# - Mantiene la versión del package.json
```

## 📝 Formato del Changelog

El changelog sigue el formato [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [X.X.X] - YYYY-MM-DD

### Added
- Nueva funcionalidad

### Changed
- Cambios en funcionalidad existente

### Fixed
- Correcciones de bugs

### Security
- Actualizaciones de seguridad
```

## 🔧 Configuración

### Actualización Manual del Changelog

Después de ejecutar `npm run version:deploy`, el script crea una entrada básica en el CHANGELOG. Debes:

1. Abrir `CHANGELOG.md`
2. Actualizar la entrada más reciente con los cambios reales
3. Asegurarte de que los cambios estén categorizados correctamente

### Información de Versión en la App

La versión se muestra automáticamente en:
- **Perfil de Usuario** (`/profile`) - En la sección "Acciones Rápidas"

Para usar la versión en otros componentes:

```typescript
import { versionInfo } from "@/lib/version";

// Acceder a la información
console.log(versionInfo.version);        // "1.0.2"
console.log(versionInfo.buildDate);      // "2024-12-19"
console.log(versionInfo.buildTime);      // "14:30:00"
console.log(versionInfo.gitCommit);      // "abc1234"
console.log(versionInfo.gitBranch);      // "main"
console.log(versionInfo.fullVersion);    // "1.0.2 (2024-12-19 14:30:00)"
```

## 🔄 Integración con CI/CD

Para usar en pipelines de CI/CD, el script detecta automáticamente el entorno:

```bash
# En CI/CD, el script funciona sin interacción
CI=true npm run version:deploy
```

## 📊 Estructura de Versiones

El sistema usa [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nueva funcionalidad compatible hacia atrás
- **PATCH**: Correcciones de bugs compatibles

## ⚠️ Notas Importantes

1. **No editar manualmente** `src/lib/version.ts` - Es auto-generado
2. **Siempre revisar** el CHANGELOG.md después de versionar
3. **Los tags de Git** son importantes para el tracking de releases
4. **El script pre-build** se ejecuta automáticamente en cada build

## 🐛 Troubleshooting

### Error: "git command not found"
- Asegúrate de tener Git instalado y en el PATH
- En CI/CD, instala Git en el runner

### Error: "Cannot find module"
- Ejecuta `npm install` para instalar dependencias
- Verifica que los scripts estén en `scripts/`

### Versión no se actualiza
- Verifica que los scripts tengan permisos de ejecución: `chmod +x scripts/*.js`
- Revisa que el package.json tenga los scripts correctos

