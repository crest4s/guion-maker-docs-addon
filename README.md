# 📝 Sistema de Formateo de Guiones Cinematográficos para Google Docs

Sistema profesional de formateo tipo **Final Draft** implementado como Google Apps Script. Permite escribir guiones cinematográficos con los estándares de la industria directamente en Google Docs.

## 🎬 Características Principales

### Formateo Profesional
- **8 tipos de bloques** con especificaciones exactas de Final Draft
- **Indentación automática** según estándares de la industria
- **Formato inteligente** que detecta automáticamente el tipo de bloque
- **Modo Fountain** para convertir documentos completos en formato Fountain

### Tipos de Bloques Disponibles

| Bloque | Indentación Izq. | Indentación Der. | Mayúsculas | Atajo |
|--------|------------------|------------------|------------|-------|
| **Encabezado de Escena** | 0" | 0" | SÍ | Ctrl+Alt+1 |
| **Acción** | 0" | 0" | NO | Ctrl+Alt+2 |
| **Personaje** | 2.0" (144pt) | 0" | SÍ | Ctrl+Alt+3 |
| **Diálogo** | 1.5" (108pt) | 1.0" (72pt) | NO | Ctrl+Alt+4 |
| **Parenté<tico** | 1.75" (126pt) | 1.25" (90pt) | NO | Ctrl+Alt+5 |
| **Transición** | 6.5" (468pt) | 0" | SÍ | Ctrl+Alt+6 |
| **Act Break** | 0" (centrado) | 0" | SÍ | - |
| **Plano (Shot)** | 0" | 0" | SÍ | - |

### Configuración del Documento
- **Fuente:** Courier New 12pt
- **Tamaño de página:** Carta (8.5" × 11")
- **Márgenes:** 
  - Superior: 1.0"
  - Inferior: 1.0"
  - Izquierdo: 1.5"
  - Derecho: 1.0"

## 📋 Funcionalidades

### 🎨 Formateo
- **Formateo manual:** Aplica formatos específicos con un clic o atajo
- **Formateo inteligente:** Detecta automáticamente el tipo de bloque (Ctrl+Alt+F)
- **Formateo Fountain:** Interpreta documento completo en sintaxis Fountain

### 🔢 Numeración y Organización
- **Renumerar escenas:** Numera automáticamente todas las escenas
- **Validar formato:** Verifica inconsistencias en el formato
- **Limpiar formato:** Elimina formatos incorrectos

### 🧭 Navegación
- **Escena anterior/siguiente:** Navega entre escenas (Ctrl+Shift+↑/↓)
- **Índice de escenas:** Lista todas las escenas del documento
- **Ir a escena específica:** Salta a un número de escena

### 👥 Análisis de Personajes
- **Lista de personajes:** Extrae todos los personajes del guión
- **Contar diálogos:** Estadísticas de diálogos por personaje
- **Buscar personaje:** Encuentra apariciones de un personaje

### 📊 Estadísticas
- Número de escenas
- Número de personajes únicos
- Líneas de diálogo
- Bloques de acción
- Transiciones
- **Páginas estimadas** (55 líneas/página)
- **Tiempo estimado** (1 min/página)
- Total de palabras y caracteres

### 📄 Plantillas
- **Portada:** Inserta página de título profesional
- **Escena completa:** Inserta estructura completa de escena con:
  - Encabezado de escena
  - Descripción de acción
  - Dos personajes con diálogos
  - Paréntético
  - Acciones entre diálogos

### 🎛️ Panel Lateral
Panel interactivo con:
- Estadísticas en tiempo real (actualización cada 5 segundos)
- Acceso rápido a todos los formatos
- Herramientas de navegación
- Lista de personajes
- Diseño monocromático profesional

## 🚀 Instalación

### 1. Crear Nuevo Google Apps Script

1. Abre un documento de Google Docs
2. Ve a **Extensiones > Apps Script**
3. Elimina el código predeterminado

### 2. Crear Archivos del Proyecto

Crea los siguientes archivos en el editor de Apps Script:

#### **Code.gs**
```
Copiar el contenido completo de Code.gs
```

#### **Formateo.gs**
```
Copiar el contenido completo de Formateo.gs
```

#### **Utils.gs**
```
Copiar el contenido completo de Utils.gs
```

#### **Sidebar.html**
```
Copiar el contenido completo de Sidebar.html
```

### 3. Guardar y Autorizar

1. Haz clic en el icono de **Guardar** (💾)
2. Dale un nombre al proyecto (ej: "Formateo de Guion")
3. Cierra el editor y vuelve al documento
4. Recarga la página (F5)
5. Verás el menú **"Guion"** en la barra superior
6. Al usarlo por primera vez, autoriza los permisos necesarios

## 📖 Uso Básico

### Aplicar Formato a Texto Existente

1. Escribe tu texto (ej: "juan")
2. Coloca el cursor en el párrafo
3. Selecciona **Guion > Formato > Personaje** (o Ctrl+Alt+3)
4. El texto se convertirá a mayúsculas y aplicará indentación: "JUAN"

### Usar Formateo Inteligente

1. Escribe el texto según sintaxis Fountain:
   - `INT. CASA - DIA` → Encabezado de escena
   - `JUAN` (en mayúsculas) → Personaje
   - `¿Qué tal?` → Diálogo
   - `(sonriendo)` → Paréntético
   - `CORTE A:` → Transición

2. Coloca el cursor en el párrafo
3. Presiona **Ctrl+Alt+F** o usa el menú
4. El sistema detectará y aplicará el formato correcto

### Insertar Plantilla de Escena

1. Coloca el cursor donde quieres la escena
2. **Guion > Plantillas > Insertar escena estándar**
3. Se insertará una escena completa con estructura profesional
4. Edita el contenido según tu historia

### Navegar Entre Escenas

- **Escena anterior:** Ctrl+Shift+↑ o menú
- **Escena siguiente:** Ctrl+Shift+↓ o menú
- **Índice:** Guion > Navegación > Índice de escenas

### Ver Estadísticas

- **Panel lateral:** Guion > Abrir panel lateral
- **Alerta:** Guion > Herramientas > Estadísticas

## ⌨️ Atajos de Teclado

### Formatos Rápidos
- `Ctrl+Alt+1` - Encabezado de escena
- `Ctrl+Alt+2` - Acción
- `Ctrl+Alt+3` - Personaje
- `Ctrl+Alt+4` - Diálogo
- `Ctrl+Alt+5` - Paréntético
- `Ctrl+Alt+6` - Transición
- `Ctrl+Alt+F` - Formateo inteligente

### Navegación
- `Ctrl+Shift+↑` - Escena anterior
- `Ctrl+Shift+↓` - Escena siguiente

> **Nota:** Los atajos deben configurarse manualmente en Google Docs:
> **Herramientas > Macros > Administrar macros**

## 🎯 Sintaxis Fountain

El sistema soporta la sintaxis Fountain estándar:

```fountain
INT. CASA - NOCHE

Juan entra por la puerta principal. Lleva una maleta.

JUAN
Hola, ya llegué.

María se levanta del sofá.

MARIA
(emocionada)
¡Por fin!

Juan deja la maleta y abraza a María.

CORTE A:
```

**Reglas de detección:**
- **Escena:** Empieza con INT., EXT., INT./EXT., I/E
- **Personaje:** MAYÚSCULAS (2-35 caracteres)
- **Diálogo:** Sigue a un personaje
- **Paréntético:** Entre paréntesis `(así)`
- **Transición:** Termina en dos puntos `:`
- **Acción:** Todo lo demás

## 📁 Estructura del Proyecto

```
guion-docs-apps-scripts/
│
├── Code.gs              (667 líneas)  - Configuración, menú, plantillas, Fountain
├── Formateo.gs          (318 líneas)  - Aplicación de formatos individuales
├── Utils.gs             (366 líneas)  - Estadísticas, navegación, análisis
└── Sidebar.html         (362 líneas)  - Panel lateral interactivo
                                       
Total: 1,720 líneas de código
```

### Módulos Principales

#### **Code.gs**
- `FORMAT_CONFIG` - Configuración de todos los formatos
- `onOpen()` - Crea el menú al abrir el documento
- `setupDocument()` - Configura márgenes y fuente
- `insertTitlePage()` - Inserta plantilla de portada
- `insertSceneTemplate()` - Inserta plantilla de escena
- `applyFountainFormat()` - Procesador Fountain completo
- `recalculateAllIndentations()` - Re-aplica indentaciones tras cambio de márgenes

#### **Formateo.gs**
- `applyFormat(formatType)` - Motor de formateo con técnica agresiva
- `applySmartFormat()` - Detección automática con 7 reglas
- `renumberScenes()` - Numeración automática de escenas
- Funciones individuales: `applyCharacter()`, `applyDialogue()`, etc.

#### **Utils.gs**
- `calculateStatistics()` - Calcula 10 métricas diferentes
- `getCharacterList()` - Extrae personajes únicos
- `navigateToScene()` - Sistema de navegación entre escenas
- `countDialoguesByCharacter()` - Análisis de diálogos
- `isSceneHeading()` - Detector de encabezados de escena

#### **Sidebar.html**
- Diseño monocromático (Courier New, blanco/negro)
- Botones para todos los formatos
- Estadísticas en tiempo real
- Lista de personajes dinámica
- Información de atajos de teclado

## 🔧 Técnicas Implementadas

### Formateo Agresivo
Para garantizar que el texto se mueve visualmente:
1. Reset absoluto de todas las propiedades a 0
2. Limpieza completa de formato de texto
3. Aplicación de indentación con conversión `Number()`
4. Re-aplicación múltiple (4 veces) para forzar recalculación de Google Docs

### Detección Inteligente
Sistema de prioridad de 7 reglas:
1. Encabezado de escena (regex INT./EXT.)
2. Transición (regex CORTE A:, etc.)
3. Paréntético (regex `^\(.+\)$`)
4. Personaje (mayúsculas 2-35 caracteres)
5. Plano (CLOSE ON, POV, etc.)
6. Texto centrado (entre > <)
7. Acción (por defecto)

### Recálculo de Márgenes
Cuando cambias los márgenes del documento:
- Detecta todos los párrafos con formato especial
- Re-aplica indentaciones desde la base del nuevo margen
- Previene desalineación de bloques formateados

## 🎨 Ejemplo de Guión Formateado

```
                    TITULO DEL GUION
                    
                    Escrito por
                   Nombre del Autor

------- SALTO DE PÁGINA -------


INT. CASA - DIA

Juan entra por la puerta. María lo espera sentada.

                    JUAN
          Hola, ya llegué.

María se levanta y camina hacia él.

                    MARIA
                 (emocionada)
          ¡Qué bueno verte!

Juan deja la maleta en el suelo.

                    JUAN
          Fue un viaje largo.

Se abrazan.

                                              CORTE A:
```

## 🐛 Solución de Problemas

### El menú "Guion" no aparece
1. Recarga el documento (F5)
2. Verifica que los archivos estén guardados en Apps Script
3. Autoriza los permisos si es la primera vez

### El formato no se aplica correctamente
1. Asegúrate de que el cursor esté en un párrafo
2. Usa "Limpiar formato" primero si hay formatos previos
3. Prueba con "Configurar documento" para resetear márgenes

### Las palabras no se mueven visualmente
1. Aplica el formato primero en un párrafo vacío
2. Luego escribe el texto
3. El sistema usa tabulaciones estándar de Final Draft

### Las estadísticas no se actualizan
1. Presiona el botón "Cargar personajes" en el panel
2. Cierra y vuelve a abrir el panel lateral
3. Verifica que haya contenido formateado en el documento

## 📝 Notas Importantes

- **No uses negritas:** El sistema formatea todo en Courier New 12pt sin negritas
- **Espaciado automático:** Los bloques tienen espaciado pre-configurado
- **Mayúsculas automáticas:** Personajes, escenas y transiciones se convierten automáticamente
- **Compatibilidad:** Funciona en cualquier navegador con acceso a Google Docs
- **Sin instalación:** Todo se ejecuta en la nube de Google

## 🤝 Créditos

Sistema desarrollado siguiendo especificaciones de **Final Draft** y sintaxis **Fountain**.

- Especificaciones de formato: Estándares de la industria cinematográfica
- Sintaxis Fountain: fountain.io
- Plataforma: Google Apps Script API

## 📄 Licencia

Este proyecto es de código abierto. Puedes usarlo, modificarlo y distribuirlo libremente para escribir tus guiones.

---

**Versión:** 2.0  
**Última actualización:** Diciembre 2025  
**Líneas de código:** 1,720  
**Funciones:** 43+  
**Tipos de formato:** 8  

¡Feliz escritura! 🎬✨
