# 📚 GUION PRO 2.0 - DOCUMENTACIÓN COMPLETA

## Sistema Profesional de Escritura de Guiones para Google Docs

### Con Soporte Completo de Fountain 

---

## 🎯 DESCRIPCIÓN GENERAL

**Guion Pro** es un sistema completo de escritura de guiones cinematográficos que funciona enteramente dentro de Google Docs usando Apps Script. No requiere servidores externos, autenticación de terceros, ni costos adicionales.

### ✨ Características Principales

1. **Parser Fountain Completo** - Convierte sintaxis Fountain a guion formateado profesional
2. **Formateo Inteligente por Bloque** - Detecta automáticamente el tipo de elemento
3. **Panel Lateral Interactivo** - Acceso rápido a todas las funciones
4. **Navegación de Escenas** - Índice clicable de todas las escenas
5. **Autocompletado** - Reutiliza personajes y localizaciones
6. **Exportación a Fountain** - Convierte guiones formateados de vuelta a Fountain
7. **Estadísticas** - Análisis completo del guion
8. **Plantillas Rápidas** - Inserta elementos comunes con un clic

---

## 🚀 INSTALACIÓN Y CONFIGURACIÓN

### Paso 1: Crear una Plantilla Clonable

1. **Crear un Nuevo Google Docs**
   - Ve a [Google Docs](https://docs.google.com)
   - Crea un nuevo documento
   - Nómbralo: `Plantilla Guion Pro - [TU NOMBRE]`

2. **Abrir el Editor de Apps Script**
   - En el menú: `Extensiones` → `Apps Script`
   - Se abrirá el editor de código

3. **Eliminar el código predeterminado**
   - Borra todo el contenido del archivo `Code.gs`

4. **Copiar los Archivos del Sistema**
   
   Crea los siguientes archivos en Apps Script:

   **📄 Code.gs** (Archivo principal)
   - Copia el contenido completo de `Code.gs`
   - Este archivo maneja la inicialización y el menú

   **📄 FountainParser.gs** (Parser Fountain)
   - Crea un nuevo archivo: Archivo → Nuevo → Archivo de comandos
   - Nómbralo: `FountainParser`
   - Copia el contenido completo de `FountainParser.gs`

   **📄 Formateo.gs** (Sistema de formateo)
   - Crea otro archivo de comandos
   - Nómbralo: `Formateo`
   - Copia el contenido completo

   **📄 SmartFormat.gs** (Formateo inteligente)
   - Crea otro archivo de comandos
   - Nómbralo: `SmartFormat`
   - Copia el contenido completo

   **📄 Navegacion.gs** (Navegación y numeración)
   - Crea otro archivo de comandos
   - Nómbralo: `Navegacion`
   - Copia el contenido completo

   **📄 Autocompletado.gs** (Autocompletado)
   - Crea otro archivo de comandos
   - Nómbralo: `Autocompletado`
   - Copia el contenido completo

   **📄 Utilidades.gs** (Utilidades generales)
   - Crea otro archivo de comandos
   - Nómbralo: `Utilidades`
   - Copia el contenido completo

   **📄 sidebar.html** (Interfaz del panel)
   - Crea un archivo HTML: Archivo → Nuevo → Archivo HTML
   - Nómbralo: `sidebar`
   - Copia el contenido completo

   **📄 sidebar-css.html** (Estilos)
   - Crea otro archivo HTML
   - Nómbralo: `sidebar-css`
   - Copia el contenido completo

   **📄 sidebar-js.html** (JavaScript)
   - Crea otro archivo HTML
   - Nómbralo: `sidebar-js`
   - Copia el contenido completo

5. **Guardar el Proyecto**
   - Click en el icono de disco o `Ctrl/Cmd + S`
   - Nombra el proyecto: `Guion Pro`

6. **Cerrar y Volver al Documento**
   - Cierra el editor de Apps Script
   - Vuelve al documento de Google Docs
   - Recarga la página (`F5` o `Cmd/Ctrl + R`)

7. **Primera Ejecución**
   - Verás un nuevo menú: `🎬 Guion`
   - La primera vez que uses una función, Google pedirá permisos:
     - Click en "Revisar permisos"
     - Selecciona tu cuenta de Google
     - Click en "Avanzado"
     - Click en "Ir a Guion Pro (no seguro)"
     - Click en "Permitir"

8. **Configurar el Documento**
   - Ve a: `🎬 Guion` → `⚙️ Configurar Documento`
   - Esto aplicará:
     - Márgenes profesionales (1.5" izq, 1" resto)
     - Fuente Courier New 12pt
     - Interlineado simple

### Paso 2: Convertir en Plantilla Clonable

1. **Obtener el Enlace de Copia**
   - Copia la URL del documento
   - Ejemplo: `https://docs.google.com/document/d/ABC123.../edit`
   - Reemplaza `/edit` con `/copy`
   - URL final: `https://docs.google.com/document/d/ABC123.../copy`

2. **Compartir la Plantilla**
   - Cambia los permisos: "Cualquiera con el enlace puede ver"
   - Comparte el enlace `/copy` con tus colaboradores
   - Cada vez que alguien abra ese enlace, creará una copia automáticamente

---

## 📖 SINTAXIS FOUNTAIN

### ¿Qué es Fountain?

Fountain es un formato de markup minimalista para escribir guiones en texto plano. Es legible como texto normal, pero contiene reglas que permiten convertirlo a formato profesional.

### Reglas Básicas de Fountain

#### 1. **SCENE HEADING (Encabezado de Escena)**

Líneas que empiezan con:
- `INT.` - Interior
- `EXT.` - Exterior  
- `INT/EXT.` o `INT./EXT.` - Interior/Exterior
- `I/E` - Abreviatura

También se puede forzar con un punto inicial:
```
.CUALQUIER COSA
```

**Ejemplos:**
```
INT. CAFETERÍA - DÍA

EXT. CALLE PRINCIPAL - NOCHE

INT/EXT. COCHE EN MOVIMIENTO - ATARDECER

.FLASHBACK
```

#### 2. **CHARACTER (Personaje)**

Línea completamente en MAYÚSCULAS, corta (menos de 50 caracteres).

**Ejemplos:**
```
JUAN

MARÍA (V.O.)

DETECTIVE GÓMEZ

EL PROFESOR (O.S.)
```

Extensiones comunes:
- `(V.O.)` - Voice Over (voz en off)
- `(O.S.)` - Off Screen (fuera de pantalla)
- `(CONT'D)` - Continued (continúa)

También se puede forzar con `@`:
```
@McCLANE
```

#### 3. **DIALOGUE (Diálogo)**

Cualquier texto que sigue inmediatamente a un CHARACTER o PARENTHETICAL.

**Ejemplo:**
```
JUAN
Hola, ¿cómo estás?
```

#### 4. **PARENTHETICAL (Parentético)**

Texto entre paréntesis, generalmente debajo del nombre del personaje.

**Ejemplo:**
```
MARÍA
(sonriendo)
Muy bien, gracias.
```

#### 5. **ACTION (Acción)**

Cualquier texto que no coincida con otras reglas. Es la narración/descripción.

**Ejemplo:**
```
Juan camina hacia la ventana y mira el horizonte.
La lluvia comienza a caer suavemente.
```

#### 6. **TRANSITION (Transición)**

Líneas en MAYÚSCULAS que terminan con `TO:`.

**Ejemplos:**
```
CORTE A:

DISOLVENCIA A:

FUNDIDO A NEGRO:

CUT TO:
```

También se puede forzar con `>`:
```
> SMASH CUT TO:
```

#### 7. **ACT HEADING (Separador de Acto)**

Forzado con `=` o palabras clave.

**Ejemplos:**
```
= ACTO UNO

= FIN DEL ACTO DOS

ACTO III

FIN DEL ACTO
```

#### 8. **NOTE (Nota del Autor)**

Texto entre doble corchete `[[ ]]` o con prefijo.

**Ejemplos:**
```
[[ Esta escena puede ser cortada en edición ]]

NOTA: Revisar continuidad con escena anterior
```

---

## 🎬 CÓMO USAR EL SISTEMA

### Método 1: Escribir en Fountain y Formatear Todo

Este es el flujo de trabajo más rápido para guionistas que ya conocen Fountain:

1. **Escribe todo tu guion en texto plano** siguiendo las reglas de Fountain:
   
   ```
   INT. OFICINA - DÍA
   
   Juan entra apresurado con papeles en la mano.
   
   JUAN
   (sin aliento)
   ¡Llegué a tiempo!
   
   MARÍA
   El jefe te está esperando.
   
   Juan se detiene en seco.
   
   JUAN
   ¿Qué jefe?
   
   CORTE A:
   ```

2. **Formatear todo el documento:**
   - Opción A: Menú → `🎬 Guion` → `✨ Formatear Todo (Fountain → Guion)`
   - Opción B: Panel Lateral → `⚡ Formateo Fountain` → `✨ Formatear Todo el Documento`

3. **Resultado:** Todo el texto se convertirá automáticamente al formato profesional con márgenes, sangrías y estilos correctos.

### Método 2: Formateo Bloque por Bloque (Estilo Final Draft)

Para usuarios que prefieren formatear mientras escriben:

1. **Escribe un párrafo de texto**

2. **Aplica formato:**
   - Opción A: Selecciona el texto → Panel Lateral → Click en el tipo de bloque
   - Opción B: Menú → `🎬 Guion` → `Convertir a...` → [tipo]

3. **O usa Formateo Inteligente:**
   - El sistema detectará automáticamente el tipo según el contenido
   - Menú → `🎬 Guion` → `🎬 Formateo Inteligente (Bloque)`
   - O Panel Lateral → `🛠️ Herramientas` → `🎬 Formateo Inteligente (Bloque)`

### Método 3: Formateo de Selección (Híbrido)

Para convertir solo parte del documento:

1. **Selecciona los párrafos** que quieres formatear

2. **Aplica formateo Fountain a la selección:**
   - Menú → `🎬 Guion` → `📌 Formatear Selección (Fountain)`
   - O Panel Lateral → `⚡ Formateo Fountain` → `📌 Formatear Solo Selección`

---

## 🛠️ FUNCIONES DEL PANEL LATERAL

### ⚡ Formateo Fountain

- **✨ Formatear Todo el Documento**
  - Convierte todo el documento de Fountain a guion formateado
  - Renumera escenas automáticamente
  - Usa esto después de escribir todo en texto plano

- **📌 Formatear Solo Selección**
  - Convierte solo el texto seleccionado
  - Útil para actualizar secciones específicas

### 📦 Tipos de Bloque

Botones para aplicar formato específico al párrafo actual:

- **Escena** - Encabezado de escena (INT./EXT.)
- **Acción** - Descripción narrativa
- **Personaje** - Nombre del personaje
- **Diálogo** - Texto del diálogo
- **Parentético** - Indicación entre paréntesis
- **Transición** - CORTE A:, DISOLVENCIA A:, etc.
- **Nota** - Nota del autor
- **Acto** - Separador de acto

### 🛠️ Herramientas

- **🎬 Formateo Inteligente (Bloque)**
  - Analiza el contenido del párrafo actual
  - Aplica automáticamente el formato correcto
  - Útil cuando no estás seguro del tipo

- **🔢 Renumerar Escenas**
  - Numera todas las escenas: (1), (2), (3)...
  - Actualiza la numeración existente

- **🧹 Limpiar Formato**
  - Elimina formato inconsistente
  - Útil después de pegar texto de otras fuentes

### 🧭 Navegación de Escenas

- **Actualizar Índice**
  - Escanea el documento y muestra todas las escenas
  - Click en una escena para saltar a ella
  - Se actualiza automáticamente después de formatear

### 👥 Personajes

- **Actualizar Lista**
  - Extrae todos los personajes únicos del guion
  - Click en un nombre para insertarlo en el cursor
  - Útil para mantener consistencia en nombres

### 📍 Localizaciones

- **Actualizar Lista**
  - Extrae todas las localizaciones de las escenas
  - Reutiliza localizaciones existentes
  - Evita errores tipográficos

### 🎭 Plantillas Rápidas

Botones para insertar elementos comunes:

- **INT. - DÍA** / **INT. - NOCHE**
- **EXT. - DÍA** / **EXT. - NOCHE**
- **CORTE A:**
- **DISOLVENCIA A:**

---

## 📋 MENÚ "🎬 GUION"

### Insertar Bloque
Inserta un nuevo párrafo con formato específico:
- Encabezado de Escena
- Acción
- Personaje
- Diálogo
- Parentético
- Transición
- Nota del Autor
- Separador de Acto

### Convertir a...
Convierte el párrafo actual a un tipo específico:
- Escena, Acción, Personaje, Diálogo, Parentético, Transición

### Formateo

- **✨ Formatear Todo (Fountain → Guion)**
  - Convierte todo el documento de sintaxis Fountain

- **📌 Formatear Selección (Fountain)**
  - Convierte solo el texto seleccionado

- **🎬 Formateo Inteligente (Bloque)**
  - Detecta automáticamente el tipo del párrafo actual

### Utilidades

- **🔢 Renumerar Escenas** - Numera todas las escenas
- **🧹 Limpiar Formato** - Elimina formato inconsistente

### Exportar

- **Exportar a Fountain (Texto)**
  - Convierte el guion formateado de vuelta a texto Fountain
  - Útil para compartir con otros escritores

- **Crear Documento Fountain**
  - Crea un nuevo Google Docs con el contenido en Fountain

- **Preparar para PDF**
  - Verifica formato y renumera antes de exportar a PDF

### Análisis

- **📊 Ver Estadísticas**
  - Muestra:
    - Número de escenas
    - Personajes únicos
    - Localizaciones únicas
    - Palabras en diálogo
    - Palabras en acción
    - Estimación de duración

- **🧭 Índice de Escenas**
  - Muestra lista de todas las escenas en un diálogo

### Panel y Configuración

- **📱 Abrir Panel Lateral**
  - Muestra el sidebar interactivo

- **⚙️ Configurar Documento**
  - Aplica configuración profesional:
    - Márgenes: 1.5" izq, 1" resto
    - Fuente: Courier New 12pt
    - Interlineado: Simple

- **❓ Ayuda**
  - Muestra guía rápida de uso

---

## 🎨 FORMATO PROFESIONAL

El sistema aplica automáticamente estos formatos estándar de la industria:

### ESCENA (Scene Heading)
- **Fuente:** Courier New 12pt
- **Alineación:** Izquierda
- **Mayúsculas:** SÍ
- **Margen izq:** 0"
- **Espacio antes:** 12pt
- **Ejemplo:** `INT. CAFETERÍA - DÍA (1)`

### ACCIÓN (Action)
- **Fuente:** Courier New 12pt
- **Alineación:** Izquierda
- **Mayúsculas:** NO
- **Margen izq:** 0"
- **Espacio antes:** 0pt

### PERSONAJE (Character)
- **Fuente:** Courier New 12pt
- **Alineación:** Izquierda
- **Mayúsculas:** SÍ
- **Margen izq:** 2.5" (180pt)
- **Espacio antes:** 12pt
- **Ejemplo:** `JUAN (V.O.)`

### DIÁLOGO (Dialogue)
- **Fuente:** Courier New 12pt
- **Alineación:** Izquierda
- **Mayúsculas:** NO
- **Margen izq:** 1.5" (108pt)
- **Margen der:** 1.5" (108pt)
- **Espacio antes:** 0pt

### PARENTÉTICO (Parenthetical)
- **Fuente:** Courier New 12pt
- **Alineación:** Izquierda
- **Mayúsculas:** NO
- **Margen izq:** 1.75" (126pt)
- **Margen der:** 2" (144pt)
- **Espacio antes:** 0pt
- **Ejemplo:** `(con sarcasmo)`

### TRANSICIÓN (Transition)
- **Fuente:** Courier New 12pt
- **Alineación:** Derecha
- **Mayúsculas:** SÍ
- **Espacio antes:** 12pt
- **Espacio después:** 12pt
- **Ejemplo:** `CORTE A:`

---

## 📤 EXPORTACIÓN

### Exportar a PDF

1. Ve a: `Archivo` → `Descargar` → `Documento PDF (.pdf)`
2. O usa: `🎬 Guion` → `📤 Exportar` → `Preparar para PDF`
   - Esto renumera y limpia el formato antes de exportar

### Exportar a Fountain

Para compartir con escritores que usan otras herramientas:

1. `🎬 Guion` → `📤 Exportar` → `Exportar a Fountain (Texto)`
2. Copia el texto del registro de ejecución
3. O usa: `Crear Documento Fountain` para un nuevo documento

### Exportar a Final Draft

1. Exporta a PDF desde Google Docs
2. Importa el PDF en Final Draft
3. O exporta a Fountain y luego importa en Final Draft

---

## ⚠️ LIMITACIONES HONESTAS

### Limitaciones de Google Docs vs Software Dedicado

#### ✅ Lo que SÍ hace Guion Pro:

- ✅ Formateo profesional estándar de la industria
- ✅ Parser Fountain completo y funcional
- ✅ Navegación rápida entre escenas
- ✅ Renumeración automática
- ✅ Autocompletado de personajes/localizaciones
- ✅ Exportación a PDF y Fountain
- ✅ Estadísticas básicas
- ✅ Funciona offline (una vez cargado)
- ✅ Colaboración en tiempo real (Google Docs nativo)
- ✅ Control de versiones (Google Docs nativo)
- ✅ Gratis, sin suscripciones

#### ❌ Lo que NO hace (vs Final Draft/Fade In/WriterDuet):

- ❌ **No tiene autocompletado en tiempo real** mientras escribes
  - Debes actualizar manualmente las listas de personajes/localizaciones

- ❌ **No calcula páginas con precisión absoluta**
  - Google Docs mide páginas diferente a software de guion
  - 1 página de Google Docs ≠ 1 minuto exacto de película

- ❌ **No tiene producción breakdown automático**
  - No extrae props, vestuario, VFX automáticamente

- ❌ **No tiene modo "dual dialogue"** (dos personajes hablando simultáneamente)
  - Tendrías que hacerlo con una tabla manualmente

- ❌ **No tiene templates de TV** específicos (A-Story, B-Story, etc.)

- ❌ **No importa/exporta FDX** (formato de Final Draft) directamente
  - Pero sí soporta Fountain, que es interoperable

- ❌ **No tiene índice de shooting script** (escenas fuera de orden)

- ❌ **Performance en documentos muy largos**
  - Documentos de 200+ páginas pueden ser lentos al formatear

### Cuándo Usar Guion Pro vs Software Dedicado

**Usa Guion Pro si:**
- Estás empezando a escribir guiones
- Necesitas colaboración en tiempo real con otros escritores
- Quieres acceso desde cualquier dispositivo sin instalar nada
- No quieres pagar suscripciones mensuales
- Ya usas Google Workspace en tu trabajo
- Escribes en Fountain y quieres una previsualización formateada

**Considera software dedicado si:**
- Estás en producción profesional
- Necesitas shooting scripts complejos
- Requieres breakdown de producción automatizado
- Trabajas con estudios que exigen Final Draft
- Escribes guiones de TV con estructuras complejas
- Necesitas precisión absoluta de páginas para budgeting

---

## 🧠 ARQUITECTURA DEL SISTEMA

### Componentes Principales

```
📁 Guion Pro/
├── 📄 Code.gs                  - Inicialización, menús, coordinación
├── 📄 FountainParser.gs        - Parser Fountain y exportación
├── 📄 Formateo.gs              - Sistema de aplicación de estilos
├── 📄 SmartFormat.gs           - Detección inteligente de tipos
├── 📄 Navegacion.gs            - Numeración y navegación
├── 📄 Autocompletado.gs        - Extracción de personajes/localizaciones
├── 📄 Utilidades.gs            - Funciones auxiliares generales
├── 📄 sidebar.html             - Estructura del panel lateral
├── 📄 sidebar-css.html         - Estilos del panel
└── 📄 sidebar-js.html          - Lógica JavaScript del panel
```

### Flujo de Datos

```
Usuario escribe texto Fountain
    ↓
[formatearDocumentoFountain()]
    ↓
Para cada párrafo:
    detectarTipoFountain() → Identifica tipo de elemento
    ↓
    aplicarEstiloAParrafo() → Aplica formato desde ESTILOS_GUION
    ↓
renumerarTodasLasEscenas() → Numera encabezados
    ↓
Documento formateado profesionalmente
```

### ESTILOS_GUION (Configuración Central)

Todos los formatos están definidos en el objeto `ESTILOS_GUION` en [Code.gs](Code.gs#L18-L113):

```javascript
const ESTILOS_GUION = {
  ESCENA: { ... },
  ACCION: { ... },
  PERSONAJE: { ... },
  // etc.
}
```

Para modificar un formato, edita este objeto.

---

## 🔧 PERSONALIZACIÓN

### Cambiar Fuente

Por defecto usa **Courier New**. Para cambiar a **Courier Prime**:

1. Abre `Code.gs`
2. Busca todas las instancias de `'Courier New'`
3. Reemplaza por `'Courier Prime'`
4. Guarda

### Cambiar Márgenes

En `Code.gs`, función `configurarDocumentoGuion()`:

```javascript
body.setMarginTop(72);      // 1" (72 puntos = 1 pulgada)
body.setMarginBottom(72);   // 1"
body.setMarginLeft(108);    // 1.5"
body.setMarginRight(72);    // 1"
```

Modifica los valores (en puntos).

### Añadir Nuevos Tipos de Bloque

1. Añade el estilo a `ESTILOS_GUION` en `Code.gs`
2. Añade la detección en `detectarTipoFountain()` en `FountainParser.gs`
3. Añade un botón en `sidebar.html`
4. Añade la función JavaScript en `sidebar-js.html`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### El menú "🎬 Guion" no aparece

1. Recarga la página (F5)
2. Espera 10-15 segundos
3. Si no aparece, ve a `Extensiones` → `Apps Script`
4. Click en "Ejecutar" → Selecciona `onOpen`
5. Autoriza los permisos si se solicita

### "Error: detectarTipoBloque is not defined"

Asegúrate de haber copiado **TODOS** los archivos .gs. La función `detectarTipoBloque()` está en `SmartFormat.gs`.

### El formateo Fountain no detecta escenas

Verifica que las escenas empiecen con:
- `INT.` (con punto)
- `EXT.` (con punto)
- `INT/EXT.` o `I/E`

Fountain es sensible al formato. Debe haber un punto o barra después de INT/EXT.

### El sidebar no se carga

1. Ve a `Extensiones` → `Apps Script`
2. Verifica que existan los archivos:
   - `sidebar.html`
   - `sidebar-css.html`
   - `sidebar-js.html`
3. Verifica que la función `include()` esté en `Code.gs`

### Formateo lento en documentos largos

Google Docs puede ser lento con documentos de 150+ páginas:

- **Solución:** Divide en actos/archivos separados
- Formatea por selección en lugar de todo el documento
- Considera exportar a software dedicado para guiones largos

### Los números de escena desaparecen al editar

Esto es normal. Vuelve a ejecutar `Renumerar Escenas` cuando termines de editar.

---

## 📞 SOPORTE Y CONTRIBUCIONES

### Reportar Bugs

Si encuentras un error:
1. Anota qué función estabas usando
2. Copia el mensaje de error (si hay)
3. Describe los pasos para reproducirlo

### Solicitar Funcionalidades

Ideas bienvenidas para mejorar el sistema:
- Nuevos tipos de bloque
- Mejoras al parser Fountain
- Exportadores adicionales
- etc.

---

## 📜 LICENCIA Y CRÉDITOS

### Licencia

Este sistema está basado en estándares abiertos:
- **Fountain Syntax** - Licencia MIT (https://fountain.io)
- **Google Apps Script** - Google LLC

### Inspiración

- **Fountainize** - Herramienta de conversión Fountain
- **Final Draft** - Estándar de la industria
- **Fade In** - Software profesional de guion
- **WriterDuet** - Colaboración en tiempo real

### Desarrollado por

**Guion Pro Team**  
Versión 2.0 - Diciembre 2025

---

## 🎓 RECURSOS ADICIONALES

### Aprender Fountain

- [Fountain.io](https://fountain.io) - Especificación oficial
- [Fountain Syntax](https://fountain.io/syntax) - Guía completa

### Aprender Escritura de Guión

- [Save the Cat](https://savethecat.com/) - Estructura narrativa
- [BBC Writers Room](https://www.bbc.co.uk/writersroom) - Recursos gratis
- [Final Draft Blog](https://www.finaldraft.com/blog/) - Artículos técnicos

### Google Apps Script

- [Documentación oficial](https://developers.google.com/apps-script)
- [Google Docs API](https://developers.google.com/apps-script/reference/document)

---

## 🚀 QUICK START (INICIO RÁPIDO)

### Para Usuarios Nuevos

1. Abre la plantilla: [ENLACE /copy]
2. Crea tu copia
3. Click en: `🎬 Guion` → `⚙️ Configurar Documento`
4. Escribe tu guion en texto plano (sintaxis Fountain)
5. Click en: `🎬 Guion` → `✨ Formatear Todo (Fountain → Guion)`
6. ¡Listo!

### Para Usuarios Avanzados

1. Escribe en Fountain puro (editor de texto, Vim, etc.)
2. Pega en Google Docs
3. Formatea con Guion Pro
4. Colabora en tiempo real
5. Exporta a PDF o de vuelta a Fountain

---

**¡Feliz escritura! 🎬✨**
