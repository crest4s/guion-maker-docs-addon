# 📋 Guía de Configuración y Despliegue

## 🎯 Objetivo

Convertir este código en una plantilla de Google Docs funcional que los usuarios puedan clonar con `/copy`.

---

## 📝 PASO 1: Crear el Documento de Google Docs

1. Ve a [Google Docs](https://docs.google.com)
2. Crea un **nuevo documento en blanco**
3. Nómbralo: **"Plantilla de Guion Profesional - Guion Pro"** (o similar)
4. El documento estará inicialmente vacío; el usuario lo llenará

---

## ⚙️ PASO 2: Configurar Apps Script

### 2.1 Abrir el Editor de Scripts

1. En el documento de Google Docs, ve a: **Extensiones > Apps Script**
2. Se abrirá el editor de Google Apps Script
3. Elimina el contenido de `Code.gs` que aparece por defecto

### 2.2 Crear los Archivos de Script

Crea los siguientes archivos en el editor (usa el botón **+** junto a "Archivos"):

#### Archivos .gs (Google Apps Script):
1. **Code.gs** - Copia el contenido de `Code.gs`
2. **Formateo.gs** - Copia el contenido de `Formateo.gs`
3. **SmartFormat.gs** - Copia el contenido de `SmartFormat.gs`
4. **Navegacion.gs** - Copia el contenido de `Navegacion.gs`
5. **Autocompletado.gs** - Copia el contenido de `Autocompletado.gs`
6. **Utilidades.gs** - Copia el contenido de `Utilidades.gs`

#### Archivos .html (para el Sidebar):
1. **sidebar.html** - Copia el contenido de `sidebar.html`
2. **sidebar-css.html** - Copia el contenido de `sidebar-css.html`
3. **sidebar-js.html** - Copia el contenido de `sidebar-js.html`

**IMPORTANTE:** 
- Para crear archivos HTML: Click en **+** → **HTML** → Nombrar el archivo
- Para crear archivos .gs: Click en **+** → **Secuencia de comandos** → Nombrar

### 2.3 Guardar y Nombrar el Proyecto

1. Click en el **título del proyecto** (arriba a la izquierda, donde dice "Proyecto sin título")
2. Nómbralo: **"Guion Pro - Sistema de Escritura"**
3. Click en **💾 Guardar** (o Ctrl/Cmd + S)

---

## 🔧 PASO 3: Configurar Permisos (Primera Ejecución)

### 3.1 Ejecutar Manualmente la Función onOpen

1. En el editor de Apps Script, selecciona **Code.gs**
2. En el menú desplegable de funciones (arriba), selecciona: **onOpen**
3. Click en **▶️ Ejecutar**
4. Aparecerá un diálogo de autorización:
   - Click en **"Revisar permisos"**
   - Selecciona tu cuenta de Google
   - Click en **"Avanzado"**
   - Click en **"Ir a Guion Pro - Sistema de Escritura (no seguro)"**
   - Click en **"Permitir"**

### 3.2 Verificar que Funciona

1. Vuelve a la pestaña del **Google Doc**
2. Recarga la página (F5 o Ctrl/Cmd + R)
3. Espera 5-10 segundos
4. Deberías ver aparecer el menú **"🎬 Guion"** en la barra de menús

---

## 🎨 PASO 4: Configurar el Documento Base

### 4.1 Ajustar Márgenes y Formato

En el Google Doc:

1. Ve a **Archivo > Configuración de página**
2. Configura:
   - **Orientación:** Vertical
   - **Tamaño del papel:** Carta (8.5" × 11")
   - **Márgenes:**
     - Superior: **1"** (2.54 cm)
     - Inferior: **1"** (2.54 cm)
     - Izquierdo: **1.5"** (3.81 cm)
     - Derecho: **1"** (2.54 cm)
3. Click en **Aceptar**

**O BIEN:** Usa el menú del script:
1. Ve a **🎬 Guion > ⚙️ Configurar Documento**
2. Esto aplicará automáticamente todos los ajustes

### 4.2 Añadir Contenido de Ejemplo (Opcional)

Puedes añadir un ejemplo de guion formateado para que los usuarios vean cómo funciona:

```
INT. CAFETERÍA - DÍA

Juan entra en la cafetería y mira alrededor nerviosamente.

JUAN
¿María?

María levanta la vista desde su laptop.

MARÍA
(sonriendo)
¡Llegas tarde!

JUAN
Lo siento, el tráfico estaba imposible.

CORTE A:
```

Luego usa **🎬 Guion > ✨ Formateo Inteligente** para aplicar formatos.

### 4.3 Añadir Instrucciones Iniciales

Escribe al inicio del documento:

```
=== GUION PRO - PLANTILLA PROFESIONAL ===

INSTRUCCIONES:
1. Borra este texto de instrucciones
2. Empieza a escribir tu guion
3. Usa el menú "🎬 Guion" o el Panel Lateral para aplicar formatos
4. Para abrir el Panel Lateral: 🎬 Guion > 📋 Abrir Panel Lateral

ATAJOS:
- Formateo Inteligente: Escribe texto y aplica formato automático
- Renumerar Escenas: Actualiza los números de escena
- Panel Lateral: Acceso rápido a todas las herramientas

¡Empieza a escribir tu historia!

=====================================
```

---

## 🌐 PASO 5: Hacer la Plantilla Pública y Clonable

### 5.1 Configurar Permisos de Compartir

1. En el Google Doc, click en **Compartir** (esquina superior derecha)
2. En "Obtener enlace", cambia a: **"Cualquier persona con el enlace"**
3. Asegúrate de que el rol sea: **Lector** (muy importante)
4. Click en **Copiar enlace**
5. Click en **Listo**

### 5.2 Crear el Enlace de Copia

El enlace que copiaste tendrá este formato:
```
https://docs.google.com/document/d/ID_DEL_DOCUMENTO/edit?usp=sharing
```

Modifícalo para crear un enlace de copia directa:
```
https://docs.google.com/document/d/ID_DEL_DOCUMENTO/copy
```

**Ejemplo:**
```
Original:
https://docs.google.com/document/d/1a2b3c4d5e6f7g8h9i0j/edit?usp=sharing

Enlace de copia:
https://docs.google.com/document/d/1a2b3c4d5e6f7g8h9i0j/copy
```

### 5.3 Probar el Enlace

1. Abre el enlace `/copy` en una ventana de incógnito
2. Deberías ver el diálogo **"Crear una copia"**
3. Click en **"Crear una copia"**
4. Verifica que:
   - El documento se copie correctamente
   - El menú **🎬 Guion** aparezca después de recargar
   - Todas las funciones funcionen

---

## 🚀 PASO 6: Distribuir la Plantilla

### 6.1 Opciones de Distribución

**Opción A: Enlace Directo**
- Comparte el enlace `/copy` directamente
- Los usuarios hacen clic y obtienen su copia

**Opción B: Landing Page**
- Crea una página web simple con:
  - Descripción de Guion Pro
  - Botón "Obtener Plantilla" que apunte al enlace `/copy`
  - Instrucciones de uso

**Opción C: Gumroad / Tienda Digital**
- Sube el enlace como producto digital
- Al comprar, el usuario recibe el enlace `/copy`

### 6.2 Añadir al README del Documento

Puedes añadir en el documento una sección:

```
ACERCA DE ESTA PLANTILLA
-------------------------
Guion Pro v1.0
Sistema profesional de escritura de guiones para Google Docs

CARACTERÍSTICAS:
✅ Formatos profesionales de guion
✅ Numeración automática de escenas
✅ Panel lateral con herramientas
✅ Formateo inteligente
✅ Autocompletado de personajes y localizaciones
✅ Exportación a PDF y Fountain

SOPORTE:
Para ayuda y actualizaciones, visita: [TU SITIO WEB]
```

---

## 🔄 PASO 7: Mantenimiento y Actualizaciones

### 7.1 Actualizar el Código

Para actualizar la plantilla:

1. Abre el **documento original** (no una copia)
2. Ve a **Extensiones > Apps Script**
3. Edita los archivos necesarios
4. **Guarda** los cambios
5. **IMPORTANTE:** Las copias existentes NO se actualizarán automáticamente
6. Los usuarios deberán crear una nueva copia para obtener actualizaciones

### 7.2 Versionado

Considera incluir un número de versión:
- En el código: `const VERSION = '1.0.0';`
- En el nombre del documento: "Guion Pro v1.0"
- En el footer del sidebar

### 7.3 Comunicar Actualizaciones

- Mantén un changelog en tu sitio web
- Si tienes lista de correo, notifica a los usuarios
- Considera crear una plantilla nueva con cada versión mayor

---

## ⚠️ NOTAS IMPORTANTES

### Limitaciones de Google Apps Script

1. **Cuota de Ejecución:**
   - Scripts de usuario: 6 min/ejecución
   - Esto es más que suficiente para las operaciones de Guion Pro

2. **Sin Acceso al Contenido del Usuario:**
   - Tú (creador) NO tienes acceso a los documentos de los usuarios
   - Cada copia es independiente y privada
   - El código se ejecuta en el Drive de cada usuario

3. **Permisos en Primera Ejecución:**
   - Cada usuario debe autorizar el script la primera vez
   - Es normal en Google Apps Script
   - No se puede evitar

### Consideraciones Legales/Comerciales

1. **Licencia del Código:**
   - Define una licencia clara
   - Considera si permites modificaciones

2. **Marca y Nombres:**
   - Asegúrate de tener derechos sobre "Guion Pro"
   - No uses marcas registradas de otros

3. **Términos de Uso:**
   - Incluye descargo de responsabilidad
   - Especifica que es una plantilla, no software instalable

---

## 📊 PASO 8: Testing Final

Antes de lanzar, verifica:

- [ ] Todas las funciones del menú funcionan
- [ ] El sidebar se abre correctamente
- [ ] Formateo inteligente detecta tipos correctamente
- [ ] Renumeración de escenas funciona
- [ ] Navegación por escenas funciona
- [ ] Autocompletado extrae personajes y localizaciones
- [ ] Exportación a Fountain genera código correcto
- [ ] Limpiar formato no rompe el documento
- [ ] La plantilla se copia correctamente con `/copy`
- [ ] El menú aparece en las copias (después de recargar)
- [ ] No hay errores en la consola de Apps Script

---

## 🎉 ¡Listo!

Tu plantilla de Guion Pro está lista para ser distribuida.

Los usuarios solo necesitan:
1. Hacer clic en el enlace `/copy`
2. Recargar el documento
3. Empezar a escribir

**Enlace final para compartir:**
```
https://docs.google.com/document/d/TU_ID_AQUI/copy
```
