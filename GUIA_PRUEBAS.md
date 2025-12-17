# 🧪 GUÍA DE PRUEBAS - IDENTACIONES

## Cómo Probar las Identaciones Implementadas

### 📋 Preparación

1. Abre un nuevo Google Doc
2. Ve a **Extensiones** (o **Complementos**) y asegúrate de que el script esté vinculado
3. Ejecuta la función `configurarDocumentoGuion()` para aplicar los márgenes correctos

### ✅ Prueba 1: Insertar Bloques Nuevos

Usa el menú: **🎬 Guion → Insertar Bloque**

Inserta en este orden y verifica visualmente:

1. **Encabezado de Escena**
   - Escribe: `INT. OFICINA - DÍA`
   - ✓ Debe quedar pegado al margen izquierdo
   - ✓ En MAYÚSCULAS
   - ✓ Espacio de 12pt antes, 6pt después

2. **Acción**
   - Escribe: `María entra apresuradamente con documentos en la mano.`
   - ✓ Debe quedar pegado al margen izquierdo
   - ✓ Sin espacio antes, 6pt después
   - ✓ Texto normal (no mayúsculas)

3. **Personaje**
   - Escribe: `MARÍA`
   - ✓ Debe quedar centrado visualmente
   - ✓ Aproximadamente 2 pulgadas desde el margen izquierdo
   - ✓ En MAYÚSCULAS
   - ✓ Espacio de 6pt antes, 0pt después

4. **Diálogo**
   - Escribe: `No puedo creer que me hayas esperado todo este tiempo.`
   - ✓ Debe tener sangría izquierda y derecha
   - ✓ Más estrecho que la Acción
   - ✓ Aproximadamente 1.5 pulgadas desde margen izquierdo
   - ✓ Sin espacio antes, 6pt después

5. **Parentético**
   - Escribe: `(sonriendo)`
   - ✓ Debe quedar aún más sangrado que el diálogo
   - ✓ Centrado dentro del ancho del diálogo
   - ✓ Aproximadamente 1.75 pulgadas desde margen izquierdo

6. **Transición**
   - Escribe: `CORTE A:`
   - ✓ Debe quedar alineado a la derecha visual
   - ✓ Aproximadamente 6.5 pulgadas desde margen izquierdo
   - ✓ En MAYÚSCULAS
   - ✓ Espacio de 6pt antes y después

### ✅ Prueba 2: Convertir Texto Existente

1. Escribe varias líneas de texto normal:
   ```
   INT. CAFETERÍA - DÍA
   María entra nerviosa.
   MARÍA
   ¿Dónde está Juan?
   (mirando alrededor)
   CORTE A:
   ```

2. Selecciona cada línea y usa: **🎬 Guion → Convertir a...**
   - Línea 1 → Escena
   - Línea 2 → Acción
   - Línea 3 → Personaje
   - Línea 4 → Diálogo
   - Línea 5 → Parentético
   - Línea 6 → Transición

3. ✓ Verifica que cada bloque se reformatea correctamente

### ✅ Prueba 3: Formateo Automático con Fountain

1. Copia este texto en un Google Doc:
   ```
   INT. CAFETERÍA - DÍA
   
   María entra apresuradamente. Busca a Juan con la mirada.
   
   MARÍA
   (susurrando)
   ¿Estás aquí?
   
   CORTE A:
   ```

2. Selecciona todo el texto
3. Usa: **🎬 Guion → 📌 Formatear Selección (Fountain)**
4. ✓ Verifica que se detecte y formatee automáticamente cada bloque

### ✅ Prueba 4: Valores Numéricos Exactos

Para verificar los valores exactos con precisión:

1. Aplica un formato (ej: PERSONAJE)
2. Con el cursor en ese párrafo, ejecuta en el editor de scripts:
   ```javascript
   function verificarIdentacion() {
     const doc = DocumentApp.getActiveDocument();
     const cursor = doc.getCursor();
     const parrafo = cursor.getElement().getParent().asParagraph();
     
     Logger.log('Indent Start: ' + parrafo.getIndentStart());
     Logger.log('Indent End: ' + parrafo.getIndentEnd());
     Logger.log('Alignment: ' + parrafo.getAlignment());
     Logger.log('Spacing Before: ' + parrafo.getSpacingBefore());
     Logger.log('Spacing After: ' + parrafo.getSpacingAfter());
   }
   ```
3. Verifica en los logs que los valores coincidan:
   - PERSONAJE: indentStart = 144, indentEnd = 0
   - DIALOGO: indentStart = 108, indentEnd = 72
   - PARENTETICO: indentStart = 126, indentEnd = 90
   - TRANSICION: indentStart = 468, indentEnd = 0

### ✅ Prueba 5: Comparación Visual

Crea un guion de ejemplo completo:

```
INT. OFICINA - DÍA

María entra con una caja de documentos. Los deja sobre el 
escritorio y se sienta, exhausta.

MARÍA
(suspirando)
Por fin terminé.

Juan asoma la cabeza desde la puerta.

JUAN
¿Todo listo?

MARÍA
Todo listo.

CORTE A:

EXT. CALLE - NOCHE

La ciudad está iluminada por las luces de neón.
```

Aplica el formato y compara visualmente con un guion de Final Draft o cualquier plantilla profesional.

### 📏 Valores Esperados (Referencia Rápida)

| Bloque | Indent Start | Indent End | Spacing Before | Spacing After |
|--------|--------------|------------|----------------|---------------|
| ESCENA | 0 pt | 0 pt | 12 pt | 6 pt |
| ACCION | 0 pt | 0 pt | 0 pt | 6 pt |
| PERSONAJE | 144 pt | 0 pt | 6 pt | 0 pt |
| DIALOGO | 108 pt | 72 pt | 0 pt | 6 pt |
| PARENTETICO | 126 pt | 90 pt | 0 pt | 0 pt |
| TRANSICION | 468 pt | 0 pt | 6 pt | 6 pt |

### 🐛 Problemas Comunes

**❌ El personaje no está centrado:**
- ✓ Verifica que `sangriaIzq = 144` y `alineacion = LEFT`
- ✓ NO debe usar `CENTER` alignment

**❌ La transición no está a la derecha:**
- ✓ Verifica que `sangriaIzq = 468` y `alineacion = LEFT`
- ✓ NO debe usar `RIGHT` alignment

**❌ El diálogo es muy ancho:**
- ✓ Verifica que `sangriaDer = 72` (no 108)

**❌ Los espacios entre bloques son inconsistentes:**
- ✓ Verifica los valores de `espacioAntes` y `espacioDespues`
- ✓ ESCENA tiene 12pt antes, 6pt después
- ✓ ACCION tiene 0pt antes, 6pt después
- ✓ PERSONAJE tiene 6pt antes, 0pt después

### ✅ Señales de Éxito

Si todo está correcto, deberías ver:

1. ✓ **Consistencia visual** - Todos los bloques alineados perfectamente
2. ✓ **Sin tabs visibles** - No hay caracteres `→` en el documento
3. ✓ **Espaciado profesional** - Respiración adecuada entre bloques
4. ✓ **Márgenes correctos** - Izq: 1.5", Der: 1.0", Superior/Inferior: 1.0"
5. ✓ **Fuente monoespaciada** - Courier New, 12pt
6. ✓ **60 líneas por página** - Aproximadamente (con interlineado 1.0)

---

_Guía de Pruebas - Sistema Guion Pro_  
_14 de diciembre de 2025_
