# Changelog

## [1.1.3] - 2025-11-05
### PATCH
- Auto-generated release entry
- Git commit: 92a0d3f
- Build date: 2025-11-05


## [1.1.2] - 2025-11-05
### PATCH
- Mejoras en el sistema EcoFeedback:
  - Año de comparación ahora visible en la gráfica pero no marcado por defecto
  - Color del año de comparación cambiado a gris muy claro
  - Cards de información cambian según el año visualizado (Actual vs Comparación)
  - Card de variación anual (YoY) movido debajo del card de ecofeedback
  - Card de variación anual (YoY) solo aparece cuando está seleccionado el año de comparación
- Mejoras en scroll infinito:
  - Deshabilitado auto-scroll automático para evitar interferencias
  - Solo scroll manual del usuario permitido
  - Botón "back to top" corregido para funcionar correctamente
  - Scroll circular mejorado para permitir scroll libre hacia arriba y abajo
- Correcciones de tipos TypeScript:
  - Agregado tipo `EstadoServicio` para estados de servicio
  - Corregido tipo `Alert` para incluir propiedad opcional `details`
- Mejoras en visualización de tarifas:
  - Texto de tarifas simplificado: "Valle: tarifa más baja", "Tarifa media", "Pico: tarifa más alta"
- Git commit: 995ce07
- Build date: 2025-11-05

## [1.0.8] - 2025-11-05
### PATCH
- Auto-generated release entry
- Git commit: 7c89bba
- Build date: 2025-11-05


## [1.0.8] - 2025-11-04
### PATCH
- Auto-generated release entry
- Git commit: 290c341
- Build date: 2025-11-04


## [1.0.6] - 2025-11-04
### PATCH
- Mejoras en la página de tarifas:
  - Definición del CU movida arriba como texto fijo
  - Badge "Para la información ampliada" con scroll infinito
  - Botones rápidos para IPP, Contribución y Restricciones
  - Imágenes actualizadas a carpeta costo-unitario con soporte para múltiples imágenes
  - Galería interactiva de imágenes con intercambio al hacer clic
  - Nombres completos de componentes en tabla y gráficas
  - Tooltips informativos en cada componente
  - Eliminada sección "Información Tarifaria"
  - Orden de pestañas cambiado (Evolución de Tarifa primero)
  - Puntos de gráficas mejorados
- Correcciones en notificaciones:
  - Incremento corregido a 0,9% en alertas
  - Fecha corregida a diciembre de 2025 en IPP

## [1.0.5] - 2025-11-03

### Added
- Theme switcher restored to landing page (desktop and mobile)
- Dynamic globe image switching based on theme:
  - Light mode: uses `globe-light.jpeg`
  - Celsia mode: uses `earth-celsia.png`
- Conditional globe effects based on theme:
  - Light mode: no network effects or aureola effects
  - Celsia mode: network effects and aureola effects visible

### Changed
- Light mode now defaults on all pages (including landing page)
- Globe component now theme-aware with dynamic image and effects
- Restored contrast effect for globe when behind text (light mode)
- Improved globe styling with consistent shadow/blur effects across all modes
- Globe rotation restored for all modes

### Fixed
- Removed contrast filter on light mode (was causing visual issues)
- Fixed theme initialization to properly respect defaultTheme parameter

### Technical
- Git commit: fadf33c
- Build date: 2025-11-03


## [1.0.4] - 2025-11-03

### Added
- Automatic git commit and push functionality in versioning script
- Preload optimization for earth image in globe component
- High priority fetch for critical earth image resource

### Changed
- Celsia theme now defaults on landing page (`/`) unless explicitly overridden
- Enhanced theme provider to respect defaultTheme parameter correctly
- Improved earth image loading performance with preload techniques
- Optimized globe component with CSS performance hints (`willChange`, `backfaceVisibility`)
- Version script now automatically commits, tags, and pushes on release

### Performance
- Reduced earth image loading time in production with strategic preloading
- Added fetchPriority="high" for critical earth image asset
- Optimized globe animation rendering with hardware acceleration hints

### Technical
- Git commit: d81c4f8
- Build date: 2025-11-03


## [1.0.3] - 2025-11-03

### Added
- Comprehensive version management system with automated versioning scripts
- Version display in user profile page (Acciones Rápidas section)
- Pre-build script to automatically sync version information from package.json
- Version tracking with git commit hash and branch information
- Lock/unlock functionality for sidebar (works in both collapsed and expanded states)
- Three-state lock button: "Bloquear barra", "Desbloquear barra", "Comprimir y bloquear"
- Guest user option in "Inicia Tu Viaje" modal with demo user data
- Proper LICENSE file (MIT License with Celsia branding disclaimers)
- Comprehensive disclaimer in README about demonstrative/educational nature

### Changed
- Sidebar icons replaced with custom images from `/Iconos/sidebar/` directory
- Increased sidebar icon sizes (h-7 w-7 when open, h-9 w-9 when closed)
- Lock button repositioned below theme switcher in sidebar
- Improved sidebar lock functionality to work in compressed state
- Version system always syncs APP_VERSION with package.json version
- Removed pulse animation from sidebar icons, enhanced zoom effect (1.5x scale)
- Sidebar icons now have orange-themed hover effects

### Documentation
- Added LICENSE file with MIT License and Celsia trademark disclaimers
- Updated README with comprehensive disclaimer section
- Added version management documentation in `scripts/README.md`
- Created exhaustive versioning script system with automated changelog

### Technical
- Git commit: 50414e5
- Build date: 2025-11-03


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2024-12-19

### Added
- Version management system with automated versioning scripts
- Version display in user profile page
- Pre-build script to update version information automatically
- Comprehensive version tracking with git commit and branch info

### Changed
- Updated versioning system to use semantic versioning
- Improved build process with automatic version updates

## [0.2.1] - 2024-03-17

### Added
- Enhanced map component with new alert types and improved type safety
- Added comprehensive legend for different alert categories
- Improved popup content with detailed information for each alert type
- Added visual indicators for different types of service interruptions

### Fixed
- Fixed z-index issues with map overlays and legends
- Resolved type conflicts in the map component
- Improved map marker rendering and performance
- Fixed issues with map popup content display

### Changed
- Updated dependencies to their latest versions
- Improved map component's TypeScript definitions
- Enhanced error handling for map interactions
- Optimized map rendering for better performance

### Security
- Updated vulnerable dependencies to their latest secure versions
