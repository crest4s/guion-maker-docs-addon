# Guion Maker — Google Workspace Add-on v3.0

Sistema de formateo profesional de guiones cinematográficos para Google Docs, distribuible como Add-on de Google Workspace. A diferencia de la versión Script vinculado (`apps-script/`), este add-on se publica en Google Workspace Marketplace y los usuarios lo instalan desde ahí: aparece en el menú **Extensiones** de cualquier Google Doc, sin necesidad de instalar código manualmente en cada documento.

---

## Arquitectura de archivos

| Archivo | Responsabilidad |
|---------|-----------------|
| `Code.gs` | Triggers del ciclo de vida del add-on (`onOpen`, `onInstall`, `onHomepage`, `onFileScopeGranted`), creación del menú via `createAddonMenu()`, y bridges que redirigen todas las llamadas del menú a `Controller.gs` |
| `Controller.gs` | Capa de control: gestión de errores, autenticación, coordinación de la UI (alertas, sidebars, prompts) y delegación a `Logic.gs` |
| `Logic.gs` | Lógica pura de formateo, parseo Fountain, navegación, estadísticas y gestión de personajes. Sin dependencias de UI. |
| `Tests.gs` | Suite de pruebas unitarias para las funciones de `Logic.gs` |
| `appsscript.json` | Manifiesto del add-on: permisos OAuth, triggers, metadatos del Marketplace |
| `Sidebar.html` | Panel lateral HTML con acceso rápido a todas las funciones |

### Patrón de capas

```
Menú / Sidebar (UI)
       ↓
   Code.gs  (bridges — punto de entrada del menú)
       ↓
Controller.gs  (gestión de errores y UI)
       ↓
   Logic.gs  (lógica pura, testeable)
```

---

## Diferencias clave respecto al Script vinculado (`apps-script/`)

| Característica | Script vinculado (v2.1) | Add-on (v3.0) |
|----------------|------------------------|---------------|
| Instalación | Manual, documento a documento | Una vez, disponible en todos los Google Docs del usuario/dominio |
| Posición en menú | Menú propio "Guion" | **Extensiones > Guion Maker** |
| Distribución | Copiar/pegar código | Google Workspace Marketplace |
| Gestión centralizada | No | Sí (admin puede forzar instalación en dominio) |
| Diagnóstico | Sí (`mostrarDiagnostico`) | No |
| Fountain > Formatear selección | Sí | No |
| Contar diálogos (función interna) | `countDialoguesByCharacter` | `countDialogues` |
| Arquitectura | Monolítica (Code.gs + helpers) | 3 capas (Code → Controller → Logic) |

---

## Menú completo y funcionalidades

El menú aparece en **Extensiones > Guion Maker** en cualquier Google Doc donde esté instalado el add-on.

| Menú | Submenú / Ítem | Función bridge (Code.gs) | Descripción |
|------|----------------|--------------------------|-------------|
| Guion Maker > Formato | Encabezado de escena `[Ctrl+Alt+1]` | `applySceneHeading` | Aplica formato INT./EXT., texto en mayúsculas, sangría 0 |
| Guion Maker > Formato | Accion `[Ctrl+Alt+2]` | `applyAction` | Párrafo de acción, sangría 0 |
| Guion Maker > Formato | Personaje `[Ctrl+Alt+3]` | `applyCharacter` | Nombre en mayúsculas, sangría 144pt, CONT'D automático |
| Guion Maker > Formato | Dialogo `[Ctrl+Alt+4]` | `applyDialogue` | Sangría inicio 108pt / fin 72pt |
| Guion Maker > Formato | Parentetico `[Ctrl+Alt+5]` | `applyParenthetical` | Sangría inicio 126pt / fin 90pt |
| Guion Maker > Formato | Transicion `[Ctrl+Alt+6]` | `applyTransition` | Sangría 376pt, mayúsculas, normaliza ES→EN |
| Guion Maker > Formato | Act Break | `applyActBreak` | Centrado, mayúsculas |
| Guion Maker > Formato | Plano (Shot) | `applyShot` | Sangría 0, mayúsculas |
| Guion Maker | Renumerar escenas | `renumberScenes` | Añade numeración `(1)`, `(2)`… a cada encabezado de escena |
| Guion Maker > Fountain | Formatear documento `[Ctrl+Alt+F]` | `formatFromFountain` | Convierte todo el documento desde Fountain a formato guion |
| Guion Maker > Fountain | Exportar a Fountain | `exportToFountain` | Genera texto Fountain en un diálogo emergente |
| Guion Maker > Plantillas | Insertar portada | `insertTitlePage` | Inserta portada con título y autor editables |
| Guion Maker > Plantillas | Insertar escena estandar | `insertSceneTemplate` | Inserta bloque de escena completo |
| Guion Maker > Herramientas | Configurar documento | `setupDocument` | Márgenes, fuente Courier New 12pt, página US Letter |
| Guion Maker > Herramientas | Validar formato | `validateFormat` | Detecta fuente o tamaño incorrectos |
| Guion Maker > Herramientas | Limpiar formato | `cleanFormat` | Elimina negrita, cursiva, colores; normaliza fuente |
| Guion Maker > Herramientas | Estadisticas del guion | `showScriptStats` | Escenas, personajes, palabras, páginas estimadas |
| Guion Maker > Personajes | Lista de personajes | `showCharacterList` | Personajes únicos detectados por sangría |
| Guion Maker > Personajes | Contar dialogos por personaje | `countDialogues` | Ranking de intervenciones por personaje |
| Guion Maker > Personajes | Buscar personaje | `searchCharacter` | Mueve el cursor a la primera aparición del personaje |
| Guion Maker > Navegacion | Escena anterior `[Ctrl+Alt+7]` | `goToPreviousScene` | Salta al encabezado de escena anterior |
| Guion Maker > Navegacion | Escena siguiente `[Ctrl+Alt+8]` | `goToNextScene` | Salta al siguiente encabezado de escena |
| Guion Maker | Abrir panel lateral | `openSidebar` | Abre el panel lateral con acceso rápido |
| Guion Maker | Atajos de teclado | `showKeyboardShortcuts` | Lista de atajos disponibles |

---

## Atajos de teclado

Requieren configuración manual en **Herramientas > Macros > Administrar macros**.

| Atajo | Acción | Función |
|-------|--------|---------|
| Ctrl+Alt+1 | Encabezado de escena | `applySceneHeading` |
| Ctrl+Alt+2 | Acción | `applyAction` |
| Ctrl+Alt+3 | Personaje | `applyCharacter` |
| Ctrl+Alt+4 | Diálogo | `applyDialogue` |
| Ctrl+Alt+5 | Paréntético | `applyParenthetical` |
| Ctrl+Alt+6 | Transición | `applyTransition` |
| Ctrl+Alt+F | Formatear desde Fountain | `formatFromFountain` |
| Ctrl+Alt+7 | Escena anterior | `goToPreviousScene` |
| Ctrl+Alt+8 | Escena siguiente | `goToNextScene` |

---

## Permisos requeridos

| Permiso OAuth | Motivo |
|---------------|--------|
| `https://www.googleapis.com/auth/documents.currentonly` | Acceso de lectura/escritura únicamente al documento activo. No accede a Drive, Gmail ni datos externos. |

---

## Proceso de publicación en Google Workspace Marketplace

### Requisitos previos
- Cuenta Google con acceso a [Google Cloud Console](https://console.cloud.google.com).
- El código del add-on debe estar en un proyecto de Apps Script asociado a un proyecto de Google Cloud.

### Pasos

**1. Crear proyecto en Google Cloud Console**
- Crea un nuevo proyecto o selecciona uno existente.
- Activa la API de Google Workspace Marketplace SDK.

**2. Asociar el script al proyecto de Cloud**
- En el editor de Apps Script, ve a **Proyecto > Configuración del proyecto de Google Cloud**.
- Introduce el número del proyecto de Google Cloud.

**3. Configurar la pantalla de consentimiento OAuth**
- En Google Cloud Console, ve a **APIs y servicios > Pantalla de consentimiento de OAuth**.
- Configura nombre de la aplicación, logotipo y datos de contacto.
- Añade el scope `https://www.googleapis.com/auth/documents.currentonly`.

**4. Configurar el Marketplace SDK**
- En Google Cloud Console, ve a **APIs y servicios > Marketplace SDK**.
- Completa la ficha del add-on: nombre, descripción, capturas de pantalla, política de privacidad.
- En "Configuración de la aplicación", selecciona **Editor de complementos de Google Docs**.

**5. Publicar**
- Puedes publicar como:
  - **Pública**: visible para cualquier usuario de Google.
  - **Dominio privado**: solo visible para usuarios del dominio de Google Workspace (e.g., `universidad.es`). Ideal para instalaciones universitarias.

### Instalación forzada para toda una universidad (dominio privado)

Si el add-on está publicado como privado en el dominio:
1. El administrador de Google Workspace entra en la **Consola de administración** (`admin.google.com`).
2. Va a **Aplicaciones > Google Workspace Marketplace > Lista de aplicaciones**.
3. Busca "Guion Maker" (publicado en el dominio privado).
4. Selecciona **Instalar para todos los usuarios** (o para una unidad organizativa concreta).
5. El add-on aparece automáticamente en **Extensiones** para todos los usuarios seleccionados, sin que tengan que hacer nada.

Esta es la modalidad recomendada para universidades: instalación transparente, sin fricción para estudiantes y profesores.

---

## Desarrollo y pruebas

### Ejecutar los tests

Abre el archivo `Tests.gs` en el editor de Apps Script y ejecuta la función `runAllTests()` desde el menú de ejecución. Los resultados se muestran en el registro de ejecución (View > Logs).

### Despliegue de desarrollo

Para probar el add-on antes de publicarlo:
1. En el editor de Apps Script, ve a **Implementar > Probar implementaciones**.
2. Elige "Add-on" e instálalo en tu propio Google Docs para pruebas.

---

## Limitaciones conocidas

- Los atajos de teclado requieren configuración manual por cada usuario.
- La función "Formatear selección" (disponible en el Script vinculado) no está incluida en este add-on.
- El parser Fountain no soporta la especificación completa v1.1 (sin soporte para notas, boneyards ni títulos anidados).
- El add-on requiere que el usuario conceda el permiso de acceso al documento la primera vez (`onFileScopeGranted`). Hasta que no lo concede, el menú puede no aparecer completamente.
