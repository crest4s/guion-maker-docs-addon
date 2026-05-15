# REQUIREMENTS.md — Guion Maker Add-on v3.0

Requisitos técnicos, de permisos y de proceso para publicar y usar Guion Maker como Google Workspace Add-on.

---

## Requisitos para el desarrollador (publicación)

### Cuenta Google

| Requisito | Detalle |
|-----------|---------|
| Cuenta Google | Cualquier cuenta Gmail o Google Workspace |
| Google Cloud Console | Acceso a [console.cloud.google.com](https://console.cloud.google.com) con la misma cuenta |
| Apps Script | Acceso a [script.google.com](https://script.google.com) con la misma cuenta |

> Una cuenta personal de Google es suficiente para publicar en el Marketplace público.

### Proyecto Google Cloud

| Requisito | Detalle |
|-----------|---------|
| Proyecto GCP | Proyecto nuevo o existente con facturación habilitada (o créditos de nivel gratuito) |
| API habilitada | Google Docs API |
| API habilitada | Google Workspace Marketplace SDK |
| Pantalla de consentimiento OAuth | Configurada con User type "External" |

### Assets obligatorios para el Marketplace

| Asset | Especificación |
|-------|---------------|
| Logo del add-on | PNG o JPG, 128×128 px, fondo sólido (no transparente) |
| Capturas de pantalla | Mínimo 1, formato PNG/JPG, 1280×800 px |
| Política de privacidad | URL pública, accesible sin autenticación |
| Descripción corta | Texto, máximo 80 caracteres |
| Descripción larga | Texto o Markdown, máximo 4000 caracteres |

---

## Requisitos técnicos del add-on

### Runtime y plataforma

| Componente | Versión / Valor |
|------------|----------------|
| Google Apps Script Runtime | V8 (motor JavaScript moderno) |
| Google Docs | Cualquier versión (web) |
| Zona horaria base | Europe/Madrid |
| Logging | Stackdriver (Cloud Logging) |

### Permisos OAuth requeridos

| Scope | Justificación |
|-------|--------------|
| `https://www.googleapis.com/auth/documents.currentonly` | Leer y modificar únicamente el documento activo: aplicar formatos, insertar párrafos, mover el cursor |
| `https://www.googleapis.com/auth/script.container.ui` | Mostrar el menú "Guion Maker", el panel lateral y los cuadros de diálogo dentro de Google Docs |

> **Nota de seguridad**: Estos dos scopes no son considerados "sensibles" por Google. El add-on **no accede a Google Drive, Gmail, otros documentos, datos del usuario ni servicios externos**. No hay llamadas a APIs externas ni almacenamiento de datos fuera del documento activo.

### Triggers del ciclo de vida

| Trigger | Función | Cuándo se ejecuta |
|---------|---------|-------------------|
| `onOpen` | Crea el menú "Guion Maker" en la barra de Extensions | Al abrir el documento (si el add-on está instalado y el usuario tiene acceso) |
| `onInstall` | Llama a `onOpen` | Al instalar el add-on por primera vez |
| `onFileScopeGranted` | Llama a `onOpen` | Cuando el usuario concede acceso al documento tras el prompt de autorización |

### Archivos del add-on

| Archivo | Tipo | Responsabilidad |
|---------|------|----------------|
| `Code.gs` | Apps Script | Triggers del ciclo de vida, menú, bridges a Controller |
| `Controller.gs` | Apps Script | Coordinación de UI (alertas, prompts, sidebar), manejo de errores |
| `Logic.gs` | Apps Script | Lógica pura de formateo, manipulación de párrafos, extracción de datos |
| `License.gs` | Apps Script | Reservado (sin implementación activa) |
| `Sidebar.html` | HTML | Panel lateral con acceso rápido a todas las funciones |
| `appsscript.json` | JSON | Manifest del add-on: scopes, triggers, metadatos |

---

## Requisitos para el usuario final

| Requisito | Detalle |
|-----------|---------|
| Cuenta Google | Gmail o Google Workspace (personal o institucional) |
| Navegador | Chrome, Firefox, Safari, Edge — versiones actuales |
| Sistema operativo | Cualquiera compatible con el navegador (Windows, macOS, Linux, ChromeOS) |
| App móvil | **No compatible** — la app móvil de Google Docs no soporta add-ons con menú personalizado |
| Dispositivo | Escritorio o portátil (el add-on no funciona en la app móvil de Docs) |

---

## Requisitos para despliegue institucional (universidades)

Para que una institución instale el add-on para todos sus usuarios:

| Requisito | Detalle |
|-----------|---------|
| Plan Google Workspace | Google Workspace for Education (Free, Plus, Teaching & Learning o Education Standard) |
| Rol del instalador | Administrador de Google Workspace con acceso a `admin.google.com` |
| Add-on publicado | El add-on debe estar publicado en el Marketplace (público o unlisted) |
| Acción requerida | El admin accede a Admin Console → Apps → Google Workspace Marketplace apps → Añadir app |

> La institución no necesita ser cliente directo del desarrollador para instalar el add-on desde el Marketplace. La instalación la gestiona el propio administrador IT de la institución.

---

## Limitaciones conocidas

| Limitación | Detalle |
|------------|---------|
| Atajos de teclado | Requieren configuración manual por cada usuario en Herramientas > Macros > Administrar macros |
| App móvil | La app de Google Docs para iOS/Android no soporta add-ons |
| Formato de página | Guion Maker configura página A4. Para US Letter, ajustar `PAGE_CONFIG` en `Logic.gs` |
| Numeración de escenas | El sistema de renumeración usa prefijo `"N. "`. No soporta numeración dual (primaria/secundaria) |
| Fountain | No incluido en esta versión del add-on |
| Estadísticas | No incluidas en esta versión del add-on |
| Navegación entre escenas | No incluida en esta versión del add-on |

---

## Compatibilidad con formatos de guion

| Estándar | Soporte |
|---------|---------|
| Encabezados INT./EXT. | Completo |
| Personaje en mayúsculas | Completo |
| CONT'D automático | Completo |
| Transiciones (inglés) | Completo + traducción automática ES→EN |
| Act Break / Shot | Completo |
| Fountain import/export | No incluido en v3.0 |
| Numeración dual de escenas | No incluido |
| Títulos de guion (portada) | Plantilla básica editable |

---

## Seguridad y privacidad

- El add-on **no almacena datos** fuera del documento activo.
- El add-on **no realiza llamadas a APIs externas** (no hay UrlFetch, no hay requests a terceros).
- El add-on **no lee otros documentos**, no accede a Google Drive, Gmail ni Calendar.
- Los únicos scopes son `documents.currentonly` y `script.container.ui`.
- No se recopilan métricas de uso ni datos del usuario.
- El código es inspeccionable íntegramente en el editor de Apps Script.
