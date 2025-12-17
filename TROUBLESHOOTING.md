# 🔧 Solución de Problemas Comunes

## Error: "sidebar-js.gs" con error de sintaxis

### ❌ Problema
Si ves un error como:
```
SyntaxError: Unexpected token '<', línea: 1, archivo: sidebar-js.gs
```

### ✅ Solución
Significa que creaste el archivo con la extensión **incorrecta**.

**En Google Apps Script:**
- Los archivos que contienen JavaScript puro (sin HTML) deben ser `.gs`
- Los archivos que contienen HTML (con tags `<html>`, `<script>`, etc.) deben ser `.html`

**Para corregir:**
1. Ve al editor de Apps Script
2. Encuentra el archivo llamado `sidebar-js.gs`
3. **BÓRRALO**
4. Crea un nuevo archivo:
   - Click en **+** junto a "Archivos"
   - Selecciona **HTML**
   - Nómbralo: `sidebar-js` (sin extensión, Apps Script añade `.html` automáticamente)
5. Pega el contenido del código JavaScript

---

## Error: "toast is not a function"

### ✅ Ya Corregido
Este error ha sido corregido en los archivos. Se debía a que `toast()` no es una función válida en Google Apps Script.

**Cambios realizados:**
- Eliminados todos los usos de `.toast()`
- Reemplazados por feedback silencioso o `.alert()` cuando es crítico
- El usuario verá los cambios directamente en el documento

---

## Estructura Correcta de Archivos en Apps Script

### Archivos .gs (Google Apps Script)
Contienen código JavaScript puro, sin HTML:
- ✅ `Code.gs`
- ✅ `Formateo.gs`
- ✅ `SmartFormat.gs`
- ✅ `Navegacion.gs`
- ✅ `Autocompletado.gs`
- ✅ `Utilidades.gs`

### Archivos .html (HTML)
Contienen HTML, CSS o JavaScript dentro de tags HTML:
- ✅ `sidebar.html` - Contiene estructura HTML con `<html>`, `<body>`, etc.
- ✅ `sidebar-css.html` - Contiene solo `<style>...</style>`
- ✅ `sidebar-js.html` - Contiene solo `<script>...</script>`

---

## Cómo Crear Archivos en Apps Script

### Para archivos .gs:
1. Click en **+** junto a "Archivos"
2. Selecciona **Secuencia de comandos**
3. Nombra sin extensión: `Code`
4. Apps Script añade `.gs` automáticamente

### Para archivos .html:
1. Click en **+** junto a "Archivos"
2. Selecciona **HTML**
3. Nombra sin extensión: `sidebar`
4. Apps Script añade `.html` automáticamente

---

## Otros Errores Comunes

### Error: "include is not defined"

**Causa:** La función `include()` solo funciona cuando se llama desde un template HTML.

**Solución:** Asegúrate de que en `Code.gs` está definida:
```javascript
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
```

### Error: "Cannot read property 'getActiveDocument'"

**Causa:** Intentas ejecutar una función que requiere un documento activo desde el editor de scripts.

**Solución:** 
- No ejecutes funciones de documento desde el editor de Apps Script
- Ejecútalas desde el menú del Google Doc o el sidebar

### Error: El menú no aparece

**Solución:**
1. Guarda todos los archivos en Apps Script
2. Vuelve al Google Doc
3. Recarga la página (F5 o Cmd/Ctrl + R)
4. Espera 5-10 segundos
5. El menú "🎬 Guion" debería aparecer

### Error: "Autorización requerida"

**Solución:**
1. Ve a Apps Script
2. Selecciona la función `onOpen` en el menú desplegable
3. Click en **Ejecutar**
4. Sigue el proceso de autorización
5. Vuelve al documento y recarga

---

## Verificación de Instalación

### Checklist de archivos en Apps Script:

```
✅ Code.gs (código JS)
✅ Formateo.gs (código JS)
✅ SmartFormat.gs (código JS)
✅ Navegacion.gs (código JS)
✅ Autocompletado.gs (código JS)
✅ Utilidades.gs (código JS)
✅ sidebar.html (HTML completo)
✅ sidebar-css.html (solo <style>)
✅ sidebar-js.html (solo <script>)
```

### Verificar que todo funciona:

1. **Menú aparece:** ✅ Menú "🎬 Guion" visible
2. **Configuración funciona:** ✅ 🎬 Guion > Configurar Documento
3. **Formateo funciona:** ✅ Escribe texto y usa Convertir a...
4. **Sidebar abre:** ✅ 🎬 Guion > Abrir Panel Lateral
5. **Botones funcionan:** ✅ Click en botones del sidebar

---

## Depuración Avanzada

### Ver errores en Apps Script:

1. En el editor de Apps Script
2. Click en **Ejecuciones** (icono de reloj a la izquierda)
3. Ve las ejecuciones recientes y sus errores

### Ver errores en el Sidebar:

1. Con el sidebar abierto en Google Docs
2. Click derecho en el sidebar
3. Selecciona **Inspeccionar** (Chrome) o **Inspect Element** (otros)
4. Ve la consola del navegador para errores JavaScript

### Logs en Apps Script:

En cualquier función .gs, puedes añadir:
```javascript
console.log('Debug:', variable);
```

Luego ve a **Ver > Registros** en el editor de Apps Script.

---

## Contacto y Soporte

Si encuentras un error no listado aquí:

1. **Anota exactamente:**
   - El mensaje de error completo
   - Qué estabas haciendo cuando ocurrió
   - Qué navegador usas

2. **Verifica:**
   - ¿Todos los archivos están creados?
   - ¿El nombre de los archivos es correcto?
   - ¿Has recargado el documento?

3. **Prueba:**
   - Cerrar el documento y volver a abrirlo
   - Probar en modo incógnito
   - Probar en otro navegador

4. **Última opción:**
   - Borra todo el proyecto de Apps Script
   - Vuelve a crear los archivos desde cero
   - Copia y pega el código nuevamente
