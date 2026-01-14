# 🎬 Guion Maker v3 - Google Docs Add-on

## 📋 Descripción

Sistema de formateo profesional de guiones cinematográficos para Google Docs, diseñado como **Standalone Script** para publicación como Add-on oficial en Google Workspace Marketplace.

## 🏗️ Arquitectura

### Separación de Responsabilidades

```
v3/
├── appsscript.json     # Manifiesto del Add-on (configuración)
├── Code.gs             # Triggers y Menú (onOpen, onInstall)
├── Controller.gs       # Orquestador (Bridge menú → lógica)
└── Logic.gs            # Lógica de negocio (formateo, análisis)
```

### Flujo de Datos

```
Usuario → Menú → Code.gs → Controller.gs → Logic.gs → DocumentApp
```

## 🔒 Seguridad y Permisos

### Scopes Restrictivos

**CRÍTICO**: El Add-on usa **ÚNICAMENTE**:
```json
"oauthScopes": [
  "https://www.googleapis.com/auth/documents.currentonly"
]
```

### Restricciones Implementadas

- ❌ **NO** usa `DriveApp`
- ❌ **NO** itera carpetas
- ✅ **SÍ** opera solo en `DocumentApp.getActiveDocument()`
- ✅ Verificación rápida y GRATIS

## 📄 Descripción de Archivos

### appsscript.json

Manifiesto del Add-on configurado para:
- Runtime V8
- Scope restrictivo `documents.currentonly`
- Triggers `onOpen`, `onInstall`, `onFileScopeGranted`
- Metadata del Add-on (nombre, logo, colores)

### Code.gs

**Responsabilidad**: Triggers del ciclo de vida y creación de menú

**Funciones principales**:
- `onOpen(e)` - Gestiona `authMode` correctamente
- `onInstall(e)` - Llama a `onOpen()` para mostrar menú inmediatamente
- `onFileScopeGranted(e)` - Reinicializa después de conceder permisos
- `createAddonMenu()` - Crea el menú estructurado
- `menu*()` - Handlers que llaman al Controller

**Características**:
- Manejo de `e.authMode === ScriptApp.AuthMode.NONE` (previsualización)
- Menú intuitivo con emojis: 🎬📝🔧👥📋ℹ️
- Sin lógica de negocio (solo bridge)

### Controller.gs

**Responsabilidad**: Orquestación y gestión de UI

**Funciones principales**:
- `controllerApplyFormat(formatType)` - Coordina aplicación de formatos
- `controllerSetupDocument()` - Orquesta configuración de documento
- `controllerRenumberScenes()` - Coordina renumeración
- `controllerFormatFountain()` - Orquesta formateo Fountain
- `controllerShowCharacterList()` - Muestra lista de personajes
- `controllerCountDialogues()` - Muestra conteo de diálogos
- `controllerInsertTitlePage()` - Coordina inserción de portada
- `controllerInsertSceneTemplate()` - Coordina inserción de escena

**Utilidades de UI**:
- `showError(message)` - Alertas de error
- `showSuccess(message)` - Alertas de éxito
- `showInfo(message)` - Alertas informativas

### Logic.gs

**Responsabilidad**: Lógica pura de negocio

**Configuración**:
- `FORMAT_CONFIG` - Configuración de formatos (indentaciones, espaciados)
- `FONT` - Configuración de fuente (Courier New, 12pt)
- `PAGE_CONFIG` - Configuración de página (márgenes, tamaño)
- `TRANSITION_MAP` - Mapa de traducciones español → inglés

**Funciones principales**:

#### Formateo
- `applyFormatToParagraph(paragraph, formatType)` - Aplica formato con reset completo
- `convertTransitionToEnglish(text)` - Convierte transiciones
- `getPreviousCharacterName(paragraph)` - Detecta personaje anterior (para CONT'D)

#### Configuración
- `setupDocumentStandards()` - Configura márgenes, fuentes, página

#### Numeración
- `renumberAllScenes()` - Renumera todas las escenas secuencialmente

#### Fountain Parser
- `formatDocumentFromFountain()` - Formatea documento con sintaxis Fountain
- `detectFountainBlockType(text, previousType)` - Detecta tipos Fountain

#### Análisis
- `extractCharacters()` - Extrae personajes únicos
- `countDialoguesByCharacter()` - Cuenta diálogos por personaje
- `calculateScriptStats()` - Calcula estadísticas del guión

#### Plantillas
- `insertTitlePageTemplate()` - Inserta portada
- `insertSceneTemplateAtCursor()` - Inserta escena estándar

#### Utilidades
- `getParagraphAtCursor()` - Obtiene párrafo en cursor
- `detectBlockType(paragraph)` - Detecta tipo de bloque
- `isSceneHeading(paragraph)` - Verifica si es encabezado de escena
## 📋 Estructura del Menú (Idéntica a v2)

```
Guion (Add-on)
├── Formato
│   ├── Encabezado de escena [Ctrl+Alt+1]
│   ├── Accion [Ctrl+Alt+2]
│   ├── Personaje [Ctrl+Alt+3]
│   ├── Dialogo [Ctrl+Alt+4]
│   ├── Parentetico [Ctrl+Alt+5]
│   ├── Transicion [Ctrl+Alt+6]
│   ├── Act Break
│   └── Plano (Shot)
├── ─────────────
├── Renumerar escenas
├── ─────────────
├── Plantillas
│   ├── Insertar portada
│   └── Insertar escena estandar
├── ─────────────
├── Herramientas
│   ├── Configurar documento
│   ├── Validar formato
│   └── Limpiar formato
├── Personajes
│   ├── Lista de personajes
│   ├── Contar dialogos por personaje
│   └── Buscar personaje
├── ─────────────
├── Abrir panel lateral
└── Atajos de teclado
```
## 🎨 Formatos Soportados

| Tipo | Indent Izq. | Indent Der. | Mayúsculas | Ejemplo |
|------|-------------|-------------|------------|---------|
| **Encabezado de Escena** | 0pt | 0pt | ✅ | INT. CASA - DÍA |
| **Acción** | 0pt | 0pt | ❌ | Descripción de acción |
| **Personaje** | 144pt | 0pt | ✅ | JUAN (CONT'D) |
| **Diálogo** | 108pt | 72pt | ❌ | Texto del diálogo |
| **Parentético** | 126pt | 90pt | ❌ | (acción) |
| **Transición** | 376pt | 0pt | ✅ | CUT TO: |
| **Act Break** | 0pt | 0pt | ✅ Centrado | FIN DEL ACTO UNO |
| **Plano** | 0pt | 0pt | ✅ | CLOSE ON |

## 🔄 Sintaxis Fountain

Compatible con especificación Fountain (fountain.io):

- **Escenas**: Empiezan con `INT.`, `EXT.`, `INT./EXT.`
- **Personajes**: Todo en MAYÚSCULAS (2-35 caracteres)
- **Diálogos**: Texto después de personaje
- **Parentéticos**: Texto entre paréntesis `(acción)`
- **Transiciones**: Terminan en `:` o palabras clave (CUT TO:, FADE IN:)
- **Acción**: Texto por defecto

## 🚀 Despliegue

### Pasos para publicar como Add-on:

1. **Crear proyecto en Apps Script**
   - Ir a https://script.google.com
   - Nuevo proyecto → Copiar archivos de v3

2. **Configurar manifiesto**
   - Asegurar `appsscript.json` con scope restrictivo
   - Verificar metadata del Add-on

3. **Probar en modo desarrollo**
   - Probar `onOpen()` con diferentes `authMode`
   - Verificar que funciona sin `DriveApp`
   - Probar en documento compartido

4. **Desplegar como Add-on**
   - Configurar Google Cloud Project
   - Completar OAuth Consent Screen
   - Solicitar verificación (rápida por scope restrictivo)
   - Publicar en Google Workspace Marketplace

## ✨ Características Destacadas

### Auto-detección CONT'D
Detecta automáticamente si el personaje es el mismo que el anterior y añade `(CONT'D)`.

### Traducción Automática
Convierte transiciones en español a inglés:
- `CORTE A:` → `CUT TO:`
- `FUNDIDO A NEGRO:` → `FADE OUT:`
- `DISOLVENCIA A:` → `DISSOLVE TO:`

### Fountain Parser
Formatea todo el documento interpretando sintaxis Fountain automáticamente.

### Renumeración Inteligente
Renumera escenas secuencialmente: `(1)`, `(2)`, `(3)`...

## 🔧 Configuración de Documento

Al ejecutar "Configurar Documento":
- Fuente: Courier New 12pt
- Márgenes: Superior/Inferior 1", Izquierdo 1.5", Derecho 1"
- Tamaño: Carta (8.5" x 11")
- Espaciado de línea: 1.0

## 📊 Estadísticas

Calcula automáticamente:
- Número de escenas
- Personajes únicos
- Bloques de diálogo
- Palabras en diálogos
- Palabras en acciones
- Transiciones

## 🛡️ Ventajas de v3 vs v2

| Aspecto | v2 (Bound Script) | v3 (Add-on) |
|---------|-------------------|-------------|
| **Instalación** | Manual por documento | Una vez en Marketplace |
| **Permisos** | Todos los docs | Solo documento actual |
| **Verificación** | N/A | Rápida (scope restrictivo) |
| **Distribución** | Copiar/pegar código | Instalar desde Marketplace |
| **Arquitectura** | Monolítico | Separada (Code/Controller/Logic) |
| **Mantenimiento** | Difícil | Fácil (modular) |

## 📝 Notas de Desarrollo

- **NUNCA** usar `DriveApp` (viola scope restrictivo)
- **SIEMPRE** usar `DocumentApp.getActiveDocument()`
- **VERIFICAR** `authMode` en `onOpen()`
- **NO** mostrar alerts en modo NONE
- **SEPARAR** UI de lógica
- **USAR** funciones puras en Logic.gs

## 🐛 Debugging

Para ver logs:
1. Ir a Apps Script Editor
2. Ver → Registros de ejecución
3. Buscar errores con `console.error()`

## 📄 Licencia

Código propietario para Guion Maker Add-on.

## 👤 Autor

Guion Maker Team
Versión: 3.0
Fecha: Enero 2026
