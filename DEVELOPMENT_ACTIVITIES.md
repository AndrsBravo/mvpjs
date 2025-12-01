# MVPJS Development Activities

Complete list of development activities for the mvpjs framework.

## Status Overview

- ⏳ Not Started: 11 activities
- 🔄 In Progress: 0 activities
- ✅ Completed: 0 activities

---

## Activity 1: CLI Flexibility

**Status**: Not Started

**Description**: Configurar CLI para tres modos: frontend-only, backend-only, fullstack. Permitir generación selectiva de estructura de carpetas y documentación de opciones de configuración.

**Requirements**:
- Support three CLI modes: frontend-only, backend-only, fullstack
- Selective folder structure generation
- Configuration options documentation
- Command-line argument parsing

**Dependencies**: None (can start immediately)

**Priority**: High (foundational for other activities)

---

## Activity 2: mvp.config.js + .env Configuration

**Status**: Not Started

**Description**: Crear sistema de configuración centralizado (mvp.config.js), integrar variables de entorno (.env) y soporte para múltiples ambientes (dev, staging, prod).

**Requirements**:
- Create mvp.config.js configuration system
- Integrate environment variables (.env)
- Multi-environment support (dev, staging, prod)
- Configuration validation
- Default values and overrides

**Dependencies**: Activity 1 (CLI should use this config)

**Priority**: Critical (enables other activities)

---

## Activity 3: Component Generation CLI

**Status**: Not Started

**Description**: Generar automáticamente Pages, Views, Templates (.html), Layouts y Routes desde línea de comandos.

**Requirements**:
- CLI commands for generating Pages
- CLI commands for generating Views
- CLI commands for generating Templates (.html)
- CLI commands for generating Layouts
- CLI commands for generating Routes
- Template scaffolding with boilerplate code

**Dependencies**: Activity 1 (CLI Flexibility), Activity 2 (Configuration)

**Priority**: High (improves developer experience)

---

## Activity 4: Vite Configuration Integration Class

**Status**: Not Started

**Description**: Crear clase para gestionar configuración de Vite, integración con plugin personalizado (vite-template.js) y manejo automático de templates.

**Requirements**:
- ViteConfig class for managing Vite configuration
- Integration with vite-template.js plugin
- Automatic template handling
- Development and production configurations
- Custom plugin management

**Dependencies**: Activity 2 (Configuration system)

**Priority**: Medium (needed for template processing)

---

## Activity 5: HTTP Communication Classes

**Status**: Not Started

**Description**: Implementar clase AJAX para peticiones HTTP, clase Event para comunicación basada en eventos y clase WebSocket para comunicación bidireccional.

**Requirements**:
- AJAX class for HTTP requests
- Event class for event-based communication
- WebSocket class for bidirectional communication
- Error handling and retry logic
- Request/Response transformers

**Dependencies**: None (can start independently)

**Priority**: High (core communication functionality)

---

## Activity 6: TypeScript Definition Files

**Status**: Not Started

**Description**: Crear archivos .d.ts para todas las clases principales, soporte completo de tipos para IntelliSense en VS Code y documentación de tipos.

**Requirements**:
- .d.ts files for Page class
- .d.ts files for View class
- .d.ts files for EndPointCollection class
- .d.ts files for requestInitBuilder class
- .d.ts files for RouteService class
- Complete type coverage
- IntelliSense support in VS Code

**Dependencies**: All other activities (add types as code is written)

**Priority**: Medium-High (improves developer experience)

---

## Activity 7: SEO Service Builder Class

**Status**: Not Started

**Description**: Crear clase builder para gestionar meta tags, soporte multi-plataforma (Open Graph, Twitter Card) e inyección automática en templates.

**Requirements**:
- Seo builder class
- Title, description, keywords support
- Open Graph meta tags
- Twitter Card support
- Automatic template injection
- Canonical URL support
- Schema.org markup support

**Dependencies**: Activity 4 (Vite integration for template injection)

**Priority**: Medium (SEO is important but not blocking)

---

## Activity 8: HTTP Caching/Storage System

**Status**: Not Started

**Description**: Implementar sistema de caché multi-nivel: Memory, sessionStorage, localStorage, indexedDB con TTL configurable y estrategias de invalidación.

**Requirements**:
- Memory-based caching
- sessionStorage integration
- localStorage integration
- indexedDB integration
- TTL (Time To Live) support
- Cache invalidation strategies
- Cache hit/miss tracking
- Garbage collection

**Dependencies**: Activity 5 (HTTP Communication Classes)

**Priority**: Medium (performance optimization)

---

## Activity 9: RequestInitBuilder Enhancements

**Status**: Not Started

**Description**: Agregar Authorization headers (Bearer, Basic Auth, API Keys), custom headers, timeout configuration, automatic retry logic e interceptors.

**Requirements**:
- Authorization header support (Bearer, Basic Auth, API Keys)
- Custom headers configuration
- Timeout configuration
- Automatic retry logic with exponential backoff
- Request interceptors
- Response interceptors
- Error interceptors
- Pre/post request hooks

**Dependencies**: Activity 5 (HTTP Communication Classes)

**Priority**: High (essential for robust HTTP handling)

---

## Activity 10: Client Router Automatic Loading

**Status**: Not Started

**Description**: Detectar automáticamente @page decorators, cargar rutas jerárquicas, integración con Vite plugin y lazy loading de Pages.

**Requirements**:
- Automatic @page decorator detection
- Hierarchical route loading
- Vite plugin integration
- Lazy loading of Pages
- Route metadata collection
- Dynamic route generation
- Client-side route resolution

**Dependencies**: Activity 4 (Vite Configuration Integration)

**Priority**: High (core routing functionality)

---

## Activity 11: Server Routes Response/Request Extensions

**Status**: Not Started

**Description**: Extender objeto Request y Response con métodos útiles, manejo de errores estandarizado y helpers para validación y transformación de datos.

**Requirements**:
- Request class extensions
- Response class extensions
- Standardized error handling
- Data validation helpers
- Data transformation helpers
- JSON response helpers
- Error response helpers
- Middleware support

**Dependencies**: None (can start independently)

**Priority**: Medium (improves API development experience)

---

## Implementation Order Recommendation

1. **Activity 2** - mvp.config.js + .env Configuration (foundation)
2. **Activity 1** - CLI Flexibility (uses config)
3. **Activity 3** - Component Generation CLI (uses both above)
4. **Activity 4** - Vite Configuration Integration Class
5. **Activity 10** - Client Router Automatic Loading (uses Vite)
6. **Activity 5** - HTTP Communication Classes
7. **Activity 8** - HTTP Caching/Storage System
8. **Activity 9** - RequestInitBuilder Enhancements
9. **Activity 11** - Server Routes Response/Request Extensions
10. **Activity 7** - SEO Service Builder Class
11. **Activity 6** - TypeScript Definition Files (last, covers all)

---

**Last Updated**: November 26, 2025
