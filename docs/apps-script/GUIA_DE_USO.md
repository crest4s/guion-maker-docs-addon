# Guia de uso — Guion Maker (Script para Google Docs)

Esta guía está pensada para profesores, guionistas y estudiantes que quieren escribir guiones cinematográficos con formato profesional directamente en Google Docs, sin instalar ningún programa adicional.

---

## Requisitos previos

- Una cuenta de Google (Gmail o Google Workspace universitaria).
- Acceso a Google Docs desde el navegador (Chrome recomendado).
- El script debe estar ya instalado en el documento por un técnico o administrador. Si no lo está, pide a tu instructor o responsable de IT que siga las instrucciones del `README.md`.

---

## Instalación — pasos para el instalador

> Si ya tienes el menú "Guion" visible en tu documento, salta directamente a **Primer uso**.

**Paso 1 — Abre el editor de scripts**

En el documento de Google, ve a **Extensiones > Apps Script**.

[insertar imagen: captura del menú "Extensiones" desplegado con la opción "Apps Script" resaltada]

**Paso 2 — Pega el código**

Verás un editor de código. Borra el contenido que aparece por defecto y pega el contenido de cada archivo `.gs` del repositorio en el archivo correspondiente. Usa el botón **+** para añadir nuevos archivos de script y HTML.

[insertar imagen: captura del editor de Apps Script mostrando los archivos Code.gs, Formatting.gs, FountainParser.gs, Navigation.gs, Utilities.gs y Sidebar.html listados en el panel izquierdo]

**Paso 3 — Guarda y recarga**

Pulsa **Ctrl+S** (o ⌘+S en Mac) para guardar. Cierra la pestaña del editor y vuelve al documento. **Recarga la página** (F5 o ⌘+R).

[insertar imagen: captura del documento de Google recargado con el menú "Guion" visible en la barra de menús, junto a Archivo, Editar, Ver, etc.]

**Paso 4 — Autoriza el script**

La primera vez que ejecutes cualquier función del menú "Guion", Google pedirá que autorices el acceso. Sigue los pasos y pulsa **Permitir**. El script solo accede al documento actual.

[insertar imagen: captura del diálogo de autorización de Google con el botón "Permitir" resaltado]

---

## Primer uso: configurar el documento

Antes de empezar a escribir, configura el documento para que tenga los márgenes y la fuente correctos del formato de guion.

1. Ve a **Guion > Herramientas > Configurar documento**.
2. El documento se actualizará automáticamente con:
   - Fuente: **Courier New, 12pt**
   - Márgenes estándar de guion
   - Tamaño de página: **US Letter**

[insertar imagen: captura del submenú "Herramientas" con "Configurar documento" resaltado]

Solo necesitas hacer esto una vez por documento.

---

## Uso diario: dar formato a cada bloque

El corazón de Guion Maker es el menú **Guion > Formato**. Coloca el cursor en el párrafo que quieres formatear y elige el tipo de bloque:

[insertar imagen: captura del submenú "Formato" completamente desplegado mostrando todos los tipos de bloque]

### Tipos de bloque

| Tipo | Cuándo usarlo | Atajo |
|------|---------------|-------|
| **Encabezado de escena** | Al inicio de cada escena: INT. SALA - DÍA | Ctrl+Alt+1 |
| **Acción** | Descripción de lo que ocurre y el entorno | Ctrl+Alt+2 |
| **Personaje** | Nombre del personaje antes de hablar | Ctrl+Alt+3 |
| **Diálogo** | Las palabras del personaje | Ctrl+Alt+4 |
| **Paréntético** | Indicaciones de interpretación entre paréntesis | Ctrl+Alt+5 |
| **Transición** | CORTE A:, FUNDIDO A:, etc. | Ctrl+Alt+6 |
| **Act Break** | Separadores de acto en series de televisión | — |
| **Plano (Shot)** | Indicaciones de cámara | — |

**Ejemplo de uso:**

1. Escribe `INT. OFICINA - DÍA` en una línea nueva.
2. Con el cursor en esa línea, ve a **Guion > Formato > Encabezado de escena** (o pulsa Ctrl+Alt+1).
3. El texto se convierte automáticamente a mayúsculas y toma el formato correcto.

[insertar imagen: captura mostrando un párrafo antes y después de aplicar el formato de Encabezado de escena]

---

## Formato automático CONT'D

Cuando un personaje interrumpe con una acción y vuelve a hablar, Guion Maker detecta automáticamente que el personaje se repite y añade **(CONT'D)** a su nombre.

[insertar imagen: captura mostrando "MARÍA (CONT'D)" generado automáticamente]

---

## Panel lateral

Abre el panel lateral desde **Guion > Abrir panel lateral** para tener acceso rápido a todas las funciones sin usar el menú:

[insertar imagen: captura del panel lateral "Guion Pro" abierto a la derecha del documento, mostrando las secciones Formato, Herramientas, Navegación, Fountain, Plantillas y Personajes]

El panel incluye:

- **Formato** — 8 botones para los tipos de bloque (Encabezado de escena, Acción, Personaje, Diálogo, Paréntético, Transición, Act Break, Plano)
- **Herramientas** — Renumerar escenas, Estadísticas del guion
- **Navegación** — Escena anterior (↑), Escena siguiente (↓)
- **Fountain** — Formatear desde Fountain, Exportar a Fountain
- **Plantillas** — Insertar portada, Insertar escena estándar
- **Personajes** — Lista de personajes, Contar diálogos por personaje, Buscar personaje

---

## Plantillas

### Portada

Ve a **Guion > Plantillas > Insertar portada**. Se insertará una página de portada con los campos "TITULO DEL GUION" y "NOMBRE DEL AUTOR" que puedes editar.

[insertar imagen: captura de la portada insertada con los campos de título y autor centrados]

### Escena estándar

Ve a **Guion > Plantillas > Insertar escena estándar**. Se insertará un bloque de escena completo con encabezado, acción, personaje, diálogo, paréntético y un segundo personaje listos para editar.

[insertar imagen: captura del bloque de escena estándar insertado con todos sus tipos de párrafo ya formateados]

---

## Fountain: importar y exportar

**Fountain** es un formato de texto plano ampliamente utilizado para escribir guiones. Guion Maker puede convertir un documento escrito en Fountain al formato visual de guion y también exportar en sentido inverso.

**Para importar Fountain:**
1. Pega o escribe tu guion en formato Fountain en el documento.
2. Ve a **Guion > Fountain > Formatear documento** (o Ctrl+Alt+F).
3. El texto se convertirá automáticamente al formato visual con sangrías y mayúsculas.

[insertar imagen: captura mostrando texto en Fountain a la izquierda y el resultado formateado a la derecha]

**Para exportar a Fountain:**
Ve a **Guion > Fountain > Exportar a Fountain**. Aparecerá un cuadro de texto con el guion en formato Fountain que podrás copiar.

---

## Herramientas de análisis

### Estadísticas del guion

**Guion > Herramientas > Estadísticas del guion** muestra:
- Número total de escenas
- Personajes únicos
- Número de palabras
- Páginas estimadas

[insertar imagen: captura del cuadro de diálogo de estadísticas con los datos del guion]

### Validar formato

**Guion > Herramientas > Validar formato** detecta párrafos con fuente o tamaño de letra incorrecto y muestra la lista de problemas encontrados.

### Limpiar formato

**Guion > Herramientas > Limpiar formato** elimina negrita, cursiva, subrayado y colores de fondo, normalizando toda la fuente a Courier New 12pt.

---

## Gestión de personajes

### Lista de personajes

**Guion > Personajes > Lista de personajes** muestra todos los personajes únicos del guion, detectados automáticamente por su formato.

[insertar imagen: captura del cuadro de diálogo con la lista de personajes en orden alfabético]

### Contar diálogos por personaje

**Guion > Personajes > Contar diálogos por personaje** muestra un ranking de cuántas veces habla cada personaje.

### Buscar personaje

**Guion > Personajes > Buscar personaje** → escribe el nombre y el cursor saltará a su primera aparición en el guion.

---

## Navegación entre escenas

Usa los atajos de teclado o el panel lateral para moverte rápidamente:

| Acción | Atajo | Panel lateral |
|--------|-------|---------------|
| Ir a la escena anterior | Ctrl+Alt+7 | Botón ↑ Escena anterior |
| Ir a la escena siguiente | Ctrl+Alt+8 | Botón ↓ Escena siguiente |

> Los atajos de teclado requieren configuración previa en **Herramientas > Macros > Administrar macros**.

---

## Atajos de teclado

| Atajo | Acción |
|-------|--------|
| Ctrl+Alt+1 | Encabezado de escena |
| Ctrl+Alt+2 | Acción |
| Ctrl+Alt+3 | Personaje |
| Ctrl+Alt+4 | Diálogo |
| Ctrl+Alt+5 | Paréntético |
| Ctrl+Alt+6 | Transición |
| Ctrl+Alt+F | Formatear desde Fountain |
| Ctrl+Alt+7 | Escena anterior |
| Ctrl+Alt+8 | Escena siguiente |

Puedes consultar esta lista en cualquier momento desde **Guion > Atajos de teclado**.

[insertar imagen: captura del cuadro de diálogo de atajos de teclado]

---

## Preguntas frecuentes (FAQ)

**¿Por qué no aparece el menú "Guion"?**
Recarga la página (F5). Si sigue sin aparecer, el script puede no estar instalado o puede haber fallado la autorización. Pide ayuda al instalador.

**¿Se pierden los cambios al cerrar el documento?**
No. Google Docs guarda automáticamente. El formato del guion queda guardado en el documento.

**¿Puedo usar este script en varios documentos a la vez?**
El script vinculado solo funciona en el documento donde está instalado. Para instalarlo en otro documento, hay que repetir el proceso de instalación. Si tu universidad tiene la versión Add-on, no tendrás este problema.

**El atajo de teclado no funciona. ¿Qué hago?**
Los atajos requieren configuración manual. Ve a **Herramientas > Macros > Administrar macros** en Google Docs y asigna cada función a su atajo correspondiente. También puedes ver la lista desde **Guion > Atajos de teclado**.

**¿El script accede a mis otros documentos o a mi correo?**
No. Solo tiene permiso para acceder al documento activo (`documents.currentonly`). No envía datos a servidores externos.

**¿Qué diferencia hay entre "Encabezado de escena" y "Plano (Shot)"?**
El encabezado de escena establece el inicio de una nueva escena (INT./EXT., lugar, momento). El plano es una indicación de cámara dentro de una escena ya abierta (e.g., PRIMER PLANO — EL RELOJ).
