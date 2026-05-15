# Guia de uso — Guion Maker Add-on para Google Docs

Esta guía está pensada para profesores, guionistas y estudiantes. No se necesitan conocimientos técnicos: Guion Maker aparece directamente en tu Google Docs una vez instalado por el administrador de tu universidad o por ti mismo desde Google Workspace Marketplace.

---

## Requisitos previos

- Una cuenta de Google (Gmail o Google Workspace universitaria).
- Acceso a Google Docs desde el navegador.
- El add-on debe estar instalado. Si tu universidad lo ha activado para todos los usuarios, ya lo tendrás disponible automáticamente.

---

## Instalación desde Google Workspace Marketplace

> Si tu universidad ya instaló el add-on para todo el dominio, salta a **Primer uso**.

**Paso 1 — Abre el Marketplace desde Google Docs**

En cualquier Google Doc, ve a **Extensiones > Complementos > Obtener complementos**.

**Paso 2 — Busca Guion Maker**

En el buscador del Marketplace, escribe "Guion Maker". Selecciona el resultado.

**Paso 3 — Instala**

Haz clic en **Instalar** y luego en **Continuar**. Autoriza el acceso cuando se te pida: el add-on solo necesita acceder al documento en el que estás trabajando.

**Paso 4 — Accede al add-on**

Una vez instalado, ve a **Extensiones > Guion Maker** en cualquier Google Doc.

---

## Primer uso: configurar el documento

Antes de empezar a escribir, configura el documento para que tenga los márgenes y la fuente correctos del formato de guion.

1. Ve a **Extensiones > Guion Maker > Herramientas > Configurar documento**.
2. El documento se actualizará automáticamente con:
   - Fuente: **Courier New, 12pt**
   - Márgenes estándar de guion
   - Tamaño de página: **A4**

Solo necesitas hacer esto una vez por documento.

---

## Uso diario: dar formato a cada bloque

Ve a **Extensiones > Guion Maker > Formato**. Coloca el cursor en el párrafo que quieres formatear y elige el tipo de bloque:

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

1. Escribe `INT. CAFETERÍA - DÍA` en una línea nueva.
2. Con el cursor en esa línea, ve a **Extensiones > Guion Maker > Formato > Encabezado de escena** (o pulsa Ctrl+Alt+1).
3. El texto se convierte a mayúsculas y toma el formato correcto automáticamente.

---

## Formato automático CONT'D

Cuando un personaje interrumpe con una acción y vuelve a hablar, Guion Maker detecta automáticamente la repetición y añade **(CONT'D)** al nombre del personaje.

---

## Panel lateral

Abre el panel lateral desde **Extensiones > Guion Maker > Abrir panel lateral** para tener acceso rápido a todas las funciones sin abrir el menú cada vez.

El panel incluye:

- **Formato** — 8 botones para los tipos de bloque
- **Herramientas** — Renumerar escenas
- **Plantillas** — Insertar portada, Insertar escena estándar
- **Personajes** — Lista de personajes, Buscar personaje

---

## Renumerar escenas

Ve a **Extensiones > Guion Maker > Renumerar escenas**. Guion Maker recorrerá todos los encabezados de escena del documento y añadirá numeración secuencial (`1. INT. SALA - DÍA`, `2. EXT. CALLE - NOCHE`, etc.).

---

## Plantillas

### Portada

Ve a **Extensiones > Guion Maker > Plantillas > Insertar portada**. Se insertará una página de portada con "TÍTULO DEL GUIÓN" y "NOMBRE DEL AUTOR" que puedes editar directamente.

### Escena estándar

Ve a **Extensiones > Guion Maker > Plantillas > Insertar escena estándar**. Se insertará un bloque completo con encabezado, acción, personaje, diálogo y paréntético listos para editar.

---

## Herramientas

### Validar formato

**Extensiones > Guion Maker > Herramientas > Validar formato** detecta párrafos con fuente o tamaño incorrecto.

### Limpiar formato

**Extensiones > Guion Maker > Herramientas > Limpiar formato** elimina negrita, cursiva, subrayado y colores, normalizando toda la fuente a Courier New 12pt.

---

## Gestión de personajes

| Función | Cómo acceder | Qué hace |
|---------|-------------|---------|
| Lista de personajes | Extensiones > Guion Maker > Personajes > Lista de personajes | Muestra todos los personajes únicos del guion en orden alfabético |
| Buscar personaje | Extensiones > Guion Maker > Personajes > Buscar personaje | El cursor salta a la primera aparición del personaje buscado |

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

> Los atajos requieren configuración en **Herramientas > Macros > Administrar macros**. Puedes ver la lista completa en **Extensiones > Guion Maker > Atajos de teclado**.

---

## Preguntas frecuentes (FAQ)

**¿Por qué no veo "Guion Maker" en el menú Extensiones?**
El add-on puede no estar instalado. Ve a **Extensiones > Complementos > Obtener complementos** y búscalo. Si tu universidad lo gestiona, contacta con el servicio de IT.

**¿Tengo que instalar algo en mi ordenador?**
No. Guion Maker funciona completamente en el navegador, a través de Google Docs. No hay ningún programa que descargar ni instalar.

**¿Puedo usar Guion Maker en cualquier Google Doc?**
Sí. A diferencia de un script vinculado, el add-on está disponible en todos tus Google Docs una vez instalado.

**¿El add-on accede a mis otros documentos o a mi correo?**
No. Solo tiene permiso para acceder al documento que tienes abierto en ese momento (`documents.currentonly`). No accede a ningún otro archivo ni dato.

**El atajo de teclado no funciona. ¿Qué hago?**
Los atajos requieren configuración manual. Ve a **Herramientas > Macros > Administrar macros** en Google Docs y asigna cada función a su atajo. Consulta la lista desde **Extensiones > Guion Maker > Atajos de teclado**.

**¿Puedo usar Guion Maker en el móvil o tablet?**
Guion Maker es un add-on de escritorio para Google Docs en navegador. La app móvil de Google Docs no soporta add-ons con menú personalizado.
