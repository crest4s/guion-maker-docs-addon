# 🧪 Guía de Pruebas - Guion Maker v3

## 🎯 Método 1: Prueba Rápida en Documento (5 minutos)

### Paso 1: Preparar Documento
1. Abre Google Docs: https://docs.google.com
2. Crea documento nuevo: "Test Guion Maker"
3. No cierres la pestaña

### Paso 2: Abrir Apps Script
1. En el documento → **Extensiones** → **Apps Script**
2. Se abrirá editor en nueva pestaña
3. Elimina el contenido de `Code.gs`

### Paso 3: Copiar Archivos v3

**Code.gs:**
```
1. Selecciona todo el contenido de v3/Code.gs
2. Copia (Cmd+C / Ctrl+C)
3. Pega en el editor de Apps Script
4. Guarda (Cmd+S / Ctrl+S)
```

**Controller.gs:**
```
1. En Apps Script → Archivo (+) → Archivo de secuencia de comandos
2. Nombrar: Controller
3. Copiar contenido de v3/Controller.gs
4. Pegar y guardar
```

**Logic.gs:**
```
1. Archivo (+) → Archivo de secuencia de comandos
2. Nombrar: Logic
3. Copiar contenido de v3/Logic.gs
4. Pegar y guardar
```

**appsscript.json:**
```
1. En Apps Script → Configuración del proyecto (⚙️)
2. Marcar: "Mostrar archivo de manifiesto appsscript.json"
3. Volver al Editor
4. Verás appsscript.json en la lista de archivos
5. Reemplazar TODO el contenido con v3/appsscript.json
6. Guardar
```

### Paso 4: Primera Ejecución
```
1. En Apps Script → Seleccionar función: onOpen
2. Ejecutar (▶️)
3. Revisar permisos requeridos
4. Autorizar (primera vez pedirá permisos)
   - Google pedirá autorización
   - Clic en "Continuar"
   - Selecciona tu cuenta
   - Clic en "Permitir"
```

### Paso 5: Probar en Documento
```
1. Volver a la pestaña del documento de Google Docs
2. Recargar página (F5)
3. Deberías ver el menú "Guion" en la barra superior
4. Clic en "Guion" para ver el menú completo
```

### ✅ Checklist de Verificación Básica
- [ ] Menú "Guion" aparece en barra superior
- [ ] Submenú "Formato" tiene 8 opciones
- [ ] Submenú "Herramientas" tiene 3 opciones
- [ ] Submenú "Personajes" tiene 3 opciones
- [ ] Submenú "Plantillas" tiene 2 opciones
- [ ] Opciones sueltas: Renumerar escenas, Abrir panel, Atajos

---

## 🔬 Método 2: Prueba como Add-on (Completo)

### Paso 1: Crear Proyecto Standalone
1. Ve a https://script.google.com
2. **Nuevo proyecto**
3. Nombre: "Guion Maker v3 - Test"

### Paso 2: Configurar Proyecto
```
1. Copiar archivos igual que Método 1:
   - Code.gs
   - Controller.gs
   - Logic.gs
   - appsscript.json

2. Guardar todo (Cmd+S / Ctrl+S)
```

### Paso 3: Crear Implementación de Prueba
```
1. En Apps Script → Implementar → Nueva implementación
2. Tipo: Add-on de prueba
3. Descripción: "Versión de prueba v3"
4. Implementar
```

### Paso 4: Probar en Documento
```
1. Crear documento nuevo en Google Docs
2. Extensiones → Complementos → Administrar complementos
3. Pestaña "Sin publicar"
4. Verás "Guion Maker v3 - Test"
5. Usar
```

### Paso 5: Verificar Modo NONE
```
1. Herramientas → Editor de secuencias
2. Ejecutar función: test_onOpenWithAuthModeNone
3. Ver logs: debe pasar sin errores
```

---

## 🧪 Pruebas de Funcionalidad

### Test 1: Formatos Básicos
```
1. Escribe en el documento: "INT. CASA - DIA"
2. Selecciona el texto
3. Guion → Formato → Encabezado de escena
4. ✅ Debe quedar: mayúsculas, sin indent
```

### Test 2: Personaje con CONT'D
```
1. Escribe: "JUAN"
2. Guion → Formato → Personaje
3. Abajo escribe: "Primer dialogo"
4. Guion → Formato → Dialogo
5. Más abajo escribe: "JUAN" otra vez
6. Guion → Formato → Personaje
7. ✅ Debe añadir automáticamente: "JUAN (CONT'D)"
```

### Test 3: Renumeración de Escenas
```
1. Crea 3 encabezados de escena
2. Guion → Renumerar escenas
3. ✅ Deben aparecer: (1), (2), (3) al final
```

### Test 4: Validar Formato
```
1. Guion → Herramientas → Configurar documento
2. Guion → Herramientas → Validar formato
3. ✅ Debe mostrar: "El formato del documento es correcto"
```

### Test 5: Lista de Personajes
```
1. Crea varios personajes
2. Guion → Personajes → Lista de personajes
3. ✅ Debe mostrar lista alfabética sin duplicados
```

### Test 6: Insertar Plantilla
```
1. Guion → Plantillas → Insertar escena estandar
2. ✅ Debe insertar: escena + acción + personajes + diálogos
```

### Test 7: Traducción de Transiciones
```
1. Escribe: "CORTE A:"
2. Guion → Formato → Transicion
3. ✅ Debe convertir a: "CUT TO:"
```

### Test 8: Búsqueda de Personaje
```
1. Guion → Personajes → Buscar personaje
2. Escribe nombre de un personaje
3. ✅ Cursor debe moverse a primera aparición
```

---

## 🐛 Troubleshooting

### Problema: "El menú no aparece"
**Solución:**
```
1. F5 para recargar documento
2. Si no aparece: Extensiones → Apps Script → Ejecutar → onOpen
3. Recargar documento otra vez
```

### Problema: "Error al ejecutar onOpen"
**Solución:**
```
1. Verificar que copiaste appsscript.json correctamente
2. Verificar que los 3 archivos .gs están guardados
3. Limpiar caché: Cerrar pestañas y volver a abrir
```

### Problema: "Error de permisos"
**Solución:**
```
1. Apps Script → Ejecutar → onOpen
2. Revisar permisos
3. Autorizar de nuevo
4. Si persiste: Configuración de proyecto → Número de proyecto GCP
   (Dejar en blanco para pruebas)
```

### Problema: "Los formatos no se aplican"
**Solución:**
```
1. Asegúrate de tener cursor o selección en un párrafo
2. Verifica que los 3 archivos están copiados
3. Ver logs: Apps Script → Ver → Registros de ejecución
```

### Problema: "CONT'D no se añade"
**Solución:**
```
1. Asegúrate de que el personaje anterior está formateado como CHARACTER
2. Debe haber diálogo entre ambos personajes
3. El nombre debe ser EXACTAMENTE igual
```

---

## 📊 Checklist Completo de Pruebas

### Formatos (8/8)
- [ ] Encabezado de escena
- [ ] Acción
- [ ] Personaje
- [ ] Diálogo
- [ ] Parentético
- [ ] Transición
- [ ] Act Break
- [ ] Plano (Shot)

### Herramientas (3/3)
- [ ] Configurar documento
- [ ] Validar formato
- [ ] Limpiar formato

### Personajes (3/3)
- [ ] Lista de personajes
- [ ] Contar diálogos por personaje
- [ ] Buscar personaje

### Plantillas (2/2)
- [ ] Insertar portada
- [ ] Insertar escena estándar

### Otras (3/3)
- [ ] Renumerar escenas
- [ ] Abrir panel lateral
- [ ] Atajos de teclado

### Características Especiales (4/4)
- [ ] Auto-detección CONT'D
- [ ] Traducción transiciones español→inglés
- [ ] Validación de formato
- [ ] Búsqueda de personajes

---

## 🎓 Consejos de Prueba

### 1. Usa Documento de Prueba
- No pruebes en guiones reales
- Crea documento específico: "Test Guion v3"
- Puedes borrarlo después

### 2. Prueba Secuencial
- Empieza por formatos básicos
- Luego herramientas
- Finalmente funciones avanzadas

### 3. Verifica Logs
```
Apps Script → Ver → Registros de ejecución
Busca errores (console.error)
```

### 4. Prueba Edge Cases
- Párrafos vacíos
- Texto muy largo
- Caracteres especiales
- Múltiples selecciones

### 5. Compara con v2
Si tienes v2 funcionando:
- Abre documento con v2
- Abre documento con v3
- Compara comportamiento lado a lado

---

## 🚀 Siguiente Paso: Prueba de Integración

Una vez que todas las pruebas básicas pasen:

1. **Crea un guión completo de prueba:**
   ```
   - Portada
   - 5 escenas
   - 3 personajes
   - Diálogos entre ellos
   - Transiciones
   - Act breaks
   ```

2. **Aplica todas las funciones:**
   - Configura documento
   - Valida formato
   - Renumera escenas
   - Lista personajes
   - Cuenta diálogos

3. **Verifica resultado:**
   - Formato correcto
   - Numeración secuencial
   - CONT'D donde corresponde
   - Sin errores de fuente/tamaño

---

## ✅ Prueba Exitosa

Si completaste todas las pruebas sin errores:

**¡Tu Add-on está listo!** 🎉

Próximos pasos:
1. Revisar DEPLOYMENT.gs para publicación
2. Configurar Google Cloud Project
3. Solicitar verificación
4. Publicar en Marketplace

---

## 📞 Ayuda Adicional

Si encuentras errores:
1. Revisar logs en Apps Script
2. Verificar que copiaste todos los archivos
3. Asegurar que appsscript.json está correcto
4. Revisar permisos autorizados

**Logs útiles:**
```javascript
// En Apps Script → Ver → Registros de ejecución
console.log() → Información
console.error() → Errores
```

¡Buena suerte con las pruebas! 🎬
