# Guion Maker — Apps Script (Linked Script) v2.1

Sistema de formateo profesional de guiones cinematográficos para Google Docs. Se instala directamente en un documento Google concreto como script vinculado.

---

## Arquitectura de archivos

| Archivo | Responsabilidad |
|---------|-----------------|
| `Code.gs` | Triggers (`onOpen`/`onInstall`), creación del menú "Guion", sidebar, plantillas, personajes, navegación, atajos de teclado y funciones internas de formateo (`applyDirectFormat`) |
| `Formatting.gs` | Aplicación interactiva de formatos al párrafo bajo el cursor; mapa de transiciones (`TRANSITION_MAP`) |
| `FountainParser.gs` | Parseo del formato Fountain y conversión a formato guion |
| `Navigation.gs` | Lógica auxiliar de navegación entre escenas |
| `Utilities.gs` | Estadísticas del guion (`mostrarEstadisticasGuion`), exportación Fountain, diagnóstico |
| `Sidebar.html` | Panel lateral HTML con acceso rápido a todas las funciones |

---

## Instalación paso a paso

1. Abre el Google Doc donde quieres usar Guion Maker.
2. Ve a **Extensiones > Apps Script**.
3. En el editor de Apps Script, borra el contenido por defecto de `Code.gs` y pega el contenido de `Code.gs` de este repositorio.
4. Crea un nuevo archivo para cada uno de los archivos `.gs` restantes (botón **+** > Script):
   - `Formatting.gs`
   - `FountainParser.gs`
   - `Navigation.gs`
   - `Utilities.gs`
5. Crea un nuevo archivo HTML (botón **+** > HTML) llamado `Sidebar` y pega el contenido de `Sidebar.html`.
6. Guarda el proyecto (Ctrl+S o ⌘+S).
7. Vuelve al documento Google y **recarga la página**.
8. Aparecerá el menú **"Guion"** en la barra de menús.
9. La primera vez, ve a **Guion > Herramientas > Configurar documento** para aplicar márgenes, fuente y tamaño de página US Letter.

> **Permisos:** Al ejecutar por primera vez, Google pedirá autorización. El script solo requiere `documents.currentonly` (acceso únicamente al documento activo).

---

## Menú completo y funcionalidades

| Menú | Submenú / Ítem | Función interna | Descripción |
|------|----------------|-----------------|-------------|
| Guion > Formato | Encabezado de escena `[Ctrl+Alt+1]` | `applySceneHeading` | Aplica formato INT./EXT., texto en mayúsculas, sangría 0, espacio antes 12pt |
| Guion > Formato | Accion `[Ctrl+Alt+2]` | `applyAction` | Párrafo de acción, sangría 0, espacio después 6pt |
| Guion > Formato | Personaje `[Ctrl+Alt+3]` | `applyCharacter` | Nombre en mayúsculas, sangría 144pt, añade CONT'D automáticamente si el personaje repite |
| Guion > Formato | Dialogo `[Ctrl+Alt+4]` | `applyDialogue` | Sangría inicio 108pt / fin 72pt |
| Guion > Formato | Parentetico `[Ctrl+Alt+5]` | `applyParenthetical` | Sangría inicio 126pt / fin 90pt |
| Guion > Formato | Transicion `[Ctrl+Alt+6]` | `applyTransition` | Sangría 376pt, mayúsculas, normaliza transiciones de español a inglés automáticamente |
| Guion > Formato | Act Break | `applyActBreak` | Centrado, mayúsculas, espacio antes/después 12pt |
| Guion > Formato | Plano (Shot) | `applyShot` | Sangría 0, mayúsculas, espacio antes 6pt |
| Guion | Renumerar escenas | `renumberScenes` | Añade numeración `(1)`, `(2)`… al final de cada encabezado de escena |
| Guion > Fountain | Formatear documento `[Ctrl+Alt+F]` | `formatFromFountain` | Convierte todo el documento desde formato Fountain a formato guion |
| Guion > Fountain | Formatear seleccion | `formatSelectionFountain` | Convierte únicamente el texto seleccionado |
| Guion > Fountain | Exportar a Fountain | `exportToFountain` | Genera el texto en formato Fountain en un diálogo emergente |
| Guion > Plantillas | Insertar portada | `insertTitlePage` | Inserta una página de portada con "TITULO DEL GUION" y "NOMBRE DEL AUTOR" editables |
| Guion > Plantillas | Insertar escena estandar | `insertSceneTemplate` | Inserta un bloque de escena completo (encabezado + acción + personaje + diálogo + paréntético) |
| Guion > Herramientas | Configurar documento | `setupDocument` | Establece márgenes, fuente Courier New 12pt y tamaño US Letter (612×792pt) |
| Guion > Herramientas | Validar formato | `validateFormat` | Detecta párrafos con fuente o tamaño incorrecto y muestra informe |
| Guion > Herramientas | Limpiar formato | `cleanFormat` | Elimina negrita, cursiva, subrayado, colores de fondo y normaliza fuente/tamaño |
| Guion > Herramientas | Estadisticas del guion | `showScriptStats` | Muestra número de escenas, personajes únicos, palabras y páginas estimadas |
| Guion > Herramientas | Diagnostico | `mostrarDiagnostico` | Información técnica del documento (ID, número de párrafos, configuración actual) |
| Guion > Personajes | Lista de personajes | `showCharacterList` | Lista todos los personajes únicos detectados por sangría, ordenados alfabéticamente |
| Guion > Personajes | Contar dialogos por personaje | `countDialoguesByCharacter` | Ranking de intervenciones de diálogo por personaje |
| Guion > Personajes | Buscar personaje | `searchCharacter` | Solicita un nombre y mueve el cursor a su primera aparición en el guion |
| Guion > Navegacion | Escena anterior `[Ctrl+Alt+7]` | `goToPreviousScene` | Mueve el cursor al encabezado de escena inmediatamente anterior |
| Guion > Navegacion | Escena siguiente `[Ctrl+Alt+8]` | `goToNextScene` | Mueve el cursor al siguiente encabezado de escena |
| Guion | Abrir panel lateral | `openSidebar` | Abre el panel lateral "Guion Pro" con acceso rápido a todas las funciones |
| Guion | Atajos de teclado | `showKeyboardShortcuts` | Muestra la lista de atajos disponibles en un diálogo |

---

## Atajos de teclado

Los atajos requieren configuración manual en **Herramientas > Macros > Administrar macros**, asignando cada atajo a la función correspondiente.

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

## Configuración de formato (referencia técnica)

| Tipo de bloque | Sangría inicio (pt) | Sangría fin (pt) | Espacio antes (pt) | Espacio después (pt) | Mayúsculas |
|----------------|--------------------|-----------------|--------------------|----------------------|------------|
| SCENE_HEADING | 0 | 0 | 12 | 6 | Sí |
| ACTION | 0 | 0 | 0 | 6 | No |
| CHARACTER | 144 | 0 | 6 | 0 | Sí + CONT'D |
| DIALOGUE | 108 | 72 | 0 | 6 | No |
| PARENTHETICAL | 126 | 90 | 0 | 0 | No |
| TRANSITION | 376 | 0 | 6 | 6 | Sí + normalización ES→EN |
| ACT_BREAK | 0 | 0 | 12 | 12 | Sí, centrado |
| SHOT | 0 | 0 | 6 | 0 | Sí |

Fuente: **Courier New, 12pt**. Página: **US Letter** (612×792pt). Márgenes: superior 72pt, inferior 72pt, izquierdo 108pt, derecho 72pt.

---

## Permisos requeridos

| Permiso OAuth | Motivo |
|---------------|--------|
| `https://www.googleapis.com/auth/documents.currentonly` | Acceso de lectura/escritura únicamente al documento activo. No accede a ningún otro archivo de Drive ni a datos externos. |

---

## Limitaciones conocidas

- Los atajos de teclado requieren configuración manual por cada usuario (limitación de Google Apps Script).
- El script vinculado solo funciona en el documento donde está instalado. Para otros documentos, hay que repetir la instalación o usar la versión Add-on (`add-on/`).
- La función CONT'D detecta repetición de personaje por nombre exacto; nombres con variaciones ortográficas no se detectan.
- Google Docs puede resetear la fuente tras `setText()`; el código lo compensa volviendo a aplicar la fuente, pero en documentos muy grandes puede observarse un parpadeo breve.
- El parser Fountain no soporta la especificación completa de Fountain v1.1 (sin soporte para notas, boneyards ni títulos de sección anidados).
