# ⚡ INSTALACIÓN RÁPIDA - GUION PRO 2.0

## 🎯 Guía de 5 Minutos

---

## PASO 1: Crear Documento Base

1. Ve a [Google Docs](https://docs.google.com)
2. Click en "+ En blanco" para crear un nuevo documento
3. Nombre sugerido: `Plantilla Guion Pro 2.0`

---

## PASO 2: Abrir Editor de Apps Script

1. En el documento, ve al menú: **Extensiones** → **Apps Script**
2. Se abrirá una nueva pestaña con el editor de código
3. Verás un archivo llamado `Code.gs` con código de ejemplo

---

## PASO 3: Copiar Archivos .gs (Scripts)

### 3.1 Code.gs (ya existe)

1. **Selecciona TODO** el contenido del archivo `Code.gs` existente
2. **Borra** todo
3. **Copia y pega** el contenido completo del archivo [Code.gs](Code.gs) del proyecto

### 3.2 Crear FountainParser.gs ⭐ NUEVO

1. Click en el botón **+** junto a "Archivos"
2. Selecciona **Archivo de comandos**
3. Nombre: `FountainParser`
4. Copia y pega el contenido de [FountainParser.gs](FountainParser.gs)

### 3.3 Crear resto de archivos .gs

Repite el proceso para cada uno:

| Archivo | Nombre a usar |
|---------|---------------|
| Formateo.gs | `Formateo` |
| SmartFormat.gs | `SmartFormat` |
| Navegacion.gs | `Navegacion` |
| Autocompletado.gs | `Autocompletado` |
| Utilidades.gs | `Utilidades` |

**Total: 7 archivos .gs**

---

## PASO 4: Copiar Archivos .html (Interfaz)

### 4.1 Crear sidebar.html

1. Click en **+** junto a "Archivos"
2. Selecciona **Archivo HTML**
3. Nombre: `sidebar`
4. Copia y pega el contenido de [sidebar.html](sidebar.html)

### 4.2 Crear sidebar-css.html

1. Click en **+** → **Archivo HTML**
2. Nombre: `sidebar-css`
3. Copia y pega el contenido de [sidebar-css.html](sidebar-css.html)

### 4.3 Crear sidebar-js.html

1. Click en **+** → **Archivo HTML**
2. Nombre: `sidebar-js`
3. Copia y pega el contenido de [sidebar-js.html](sidebar-js.html)

**Total: 3 archivos .html**

---

## PASO 5: Guardar Proyecto

1. Click en el icono de **disco** (guardar) o presiona `Ctrl+S` / `Cmd+S`
2. Nombre del proyecto: `Guion Pro`
3. Espera a que se guarde (verás "Guardado" en la parte superior)

---

## PASO 6: Volver al Documento y Recargar

1. **Cierra** la pestaña del editor de Apps Script
2. **Vuelve** a la pestaña del documento de Google Docs
3. **Recarga** la página presionando `F5` o `Ctrl+R` / `Cmd+R`
4. **Espera** 5-10 segundos

---

## PASO 7: Verificar Instalación

Deberías ver un nuevo menú en la barra superior: **🎬 Guion**

Si NO aparece:
1. Espera 10-15 segundos más
2. Recarga nuevamente
3. Si aún no aparece, ve al Paso 8

---

## PASO 8: Ejecutar Manualmente (si el menú no aparece)

1. **Extensiones** → **Apps Script**
2. En el editor, asegúrate de estar en el archivo `Code.gs`
3. En la lista desplegable de funciones (arriba), selecciona: `onOpen`
4. Click en el botón **Ejecutar** (▶️)
5. **IMPORTANTE:** La primera vez pedirá autorización:
   - Click en **Revisar permisos**
   - Selecciona tu cuenta de Google
   - Click en **Avanzado**
   - Click en **Ir a Guion Pro (no seguro)**
   - Click en **Permitir**
6. Vuelve al documento y recarga

---

## PASO 9: Configurar Documento

1. En el documento, click en: **🎬 Guion** → **⚙️ Configurar Documento**
2. Click en **Sí** cuando pregunte
3. Esto aplicará:
   - Márgenes profesionales (1.5" izq, 1" resto)
   - Fuente Courier New 12pt
   - Interlineado simple

---

## PASO 10: ¡Probar!

### Prueba básica:

1. Escribe esto en el documento:

```
INT. CAFETERÍA - DÍA

Juan entra.

JUAN
Hola.

MARÍA
Hola, Juan.

CORTE A:
```

2. Ve a: **🎬 Guion** → **✨ Formatear Todo (Fountain → Guion)**

3. Click en **Sí** para confirmar

4. ¡Deberías ver tu texto formateado profesionalmente!

---

## 🎉 ¡INSTALACIÓN COMPLETADA!

Ahora tienes un sistema completo de escritura de guiones con:

✅ Parser Fountain  
✅ Formateo inteligente  
✅ Panel lateral  
✅ Navegación de escenas  
✅ Autocompletado  
✅ Exportación  

---

## 📱 CONVERTIR EN PLANTILLA CLONABLE

Para que otros puedan usar tu plantilla:

### 1. Obtener URL del documento

La URL debería verse así:
```
https://docs.google.com/document/d/ABC123XYZ456/edit
```

### 2. Cambiar /edit por /copy

URL modificada:
```
https://docs.google.com/document/d/ABC123XYZ456/copy
```

### 3. Configurar permisos

1. Click en **Compartir** (arriba a la derecha)
2. En "Acceso general", selecciona: **Cualquiera con el enlace**
3. Nivel: **Lector** (es suficiente)
4. Click en **Listo**

### 4. Compartir el enlace /copy

Cuando alguien abra ese enlace:
- Google creará automáticamente una copia
- Con todos los scripts incluidos
- Lista para usar

---

## 🆘 SOLUCIÓN DE PROBLEMAS RÁPIDA

### ❌ "El menú no aparece"

**Solución:**
1. Recarga el documento (F5)
2. Espera 15 segundos
3. Si no aparece, ejecuta `onOpen` manualmente (ver Paso 8)

### ❌ "Error: detectarTipoBloque is not defined"

**Solución:**
1. Verifica que hayas copiado TODOS los archivos .gs
2. Especialmente `SmartFormat.gs` (contiene esa función)

### ❌ "El sidebar no se carga"

**Solución:**
1. Verifica que existan los 3 archivos .html
2. Nombres exactos: `sidebar`, `sidebar-css`, `sidebar-js`
3. Verifica que `Code.gs` tenga la función `include()`

### ❌ "Error al autorizar permisos"

**Solución:**
1. Asegúrate de hacer click en "Avanzado"
2. Luego "Ir a Guion Pro (no seguro)"
3. Es seguro - es tu propio código

### ❌ "Fountain no detecta escenas"

**Solución:**
Verifica la sintaxis:
- ✅ `INT. CASA - DÍA` (con punto)
- ❌ `INT CASA - DÍA` (sin punto)

---

## 📚 PRÓXIMOS PASOS

### 1. Leer la documentación

- [GUIA_COMPLETA.md](GUIA_COMPLETA.md) - Documentación completa
- [EJEMPLOS_FOUNTAIN.md](EJEMPLOS_FOUNTAIN.md) - Ejemplos prácticos

### 2. Practicar con ejemplos

Copia un ejemplo de [EJEMPLOS_FOUNTAIN.md](EJEMPLOS_FOUNTAIN.md) y formatéalo.

### 3. Escribir tu primer guion

Usa sintaxis Fountain y formatea con un click.

### 4. Explorar el panel lateral

Abre: **🎬 Guion** → **📱 Abrir Panel Lateral**

---

## ✅ CHECKLIST DE INSTALACIÓN

- [ ] Documento de Google Docs creado
- [ ] Editor de Apps Script abierto
- [ ] 7 archivos .gs copiados
  - [ ] Code.gs
  - [ ] FountainParser.gs ⭐
  - [ ] Formateo.gs
  - [ ] SmartFormat.gs
  - [ ] Navegacion.gs
  - [ ] Autocompletado.gs
  - [ ] Utilidades.gs
- [ ] 3 archivos .html copiados
  - [ ] sidebar.html
  - [ ] sidebar-css.html
  - [ ] sidebar-js.html
- [ ] Proyecto guardado como "Guion Pro"
- [ ] Documento recargado
- [ ] Menú "🎬 Guion" visible
- [ ] Permisos autorizados
- [ ] Documento configurado
- [ ] Prueba básica realizada
- [ ] ¡Funcionando!

---

## 🎓 RECURSOS

- **Sintaxis Fountain:** [Fountain.io](https://fountain.io)
- **Guía completa:** [GUIA_COMPLETA.md](GUIA_COMPLETA.md)
- **Ejemplos:** [EJEMPLOS_FOUNTAIN.md](EJEMPLOS_FOUNTAIN.md)

---

## 📞 AYUDA

Si algo no funciona:

1. Revisa el **PASO 8** (Ejecutar manualmente)
2. Lee **TROUBLESHOOTING.md**
3. Verifica que todos los archivos estén copiados correctamente

---

**¡Bienvenido a Guion Pro 2.0! 🎬✨**

**Tiempo estimado de instalación:** 5-10 minutos  
**Nivel de dificultad:** Fácil (copiar/pegar)  
**Conocimientos requeridos:** Ninguno
