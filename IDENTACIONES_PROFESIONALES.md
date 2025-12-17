# IDENTACIONES PROFESIONALES - GUION CINEMATOGRÁFICO

## 📐 ESPECIFICACIONES IMPLEMENTADAS

Este documento describe las identaciones **EXACTAS** implementadas en el sistema, basadas en estándares profesionales de la industria (Final Draft).

---

## 🎯 VALORES IMPLEMENTADOS

### 1️⃣ SCENE HEADING (Encabezado de Escena)
```
✓ setIndentStart(0 pt)
✓ setIndentEnd(0 pt)
✓ setAlignment(LEFT)
✓ Espacio antes: 12 pt
✓ Espacio después: 6 pt
✓ Texto: MAYÚSCULAS
```

**Ejemplo:**
```
INT. CAFETERÍA - DÍA
```

---

### 2️⃣ ACTION (Acción / Descripción)
```
✓ setIndentStart(0 pt)
✓ setIndentEnd(0 pt)
✓ setAlignment(LEFT)
✓ Espacio antes: 0 pt
✓ Espacio después: 6 pt
✓ Texto: Normal
```

**Ejemplo:**
```
María entra apresuradamente, con el cabello mojado por la lluvia. 
Busca una mesa cerca de la ventana.
```

---

### 3️⃣ CHARACTER (Personaje)
```
✓ setIndentStart(144 pt)  // 2.0 in desde margen izquierdo
✓ setIndentEnd(0 pt)
✓ setAlignment(LEFT)
✓ Espacio antes: 6 pt
✓ Espacio después: 0 pt
✓ Texto: MAYÚSCULAS
```

**Ejemplo:**
```
                    MARÍA
```

**IMPORTANTE:** El centrado visual se logra con `setIndentStart(144)`, NO con alineación CENTER.

---

### 4️⃣ DIALOGUE (Diálogo)
```
✓ setIndentStart(108 pt)  // 1.5 in desde margen izquierdo
✓ setIndentEnd(72 pt)     // 1.0 in desde margen derecho
✓ setAlignment(LEFT)
✓ Espacio antes: 0 pt
✓ Espacio después: 6 pt
✓ Texto: Normal
```

**Ejemplo:**
```
            No puedo creer que me hayas 
            esperado todo este tiempo.
```

**IMPORTANTE:** El ancho limitado del diálogo se logra con `setIndentStart(108) + setIndentEnd(72)`.

---

### 5️⃣ PARENTHETICAL (Parentético)
```
✓ setIndentStart(126 pt)  // 1.75 in desde margen izquierdo
✓ setIndentEnd(90 pt)     // 1.25 in desde margen derecho
✓ setAlignment(LEFT)
✓ Espacio antes: 0 pt
✓ Espacio después: 0 pt
✓ Texto: Entre paréntesis
```

**Ejemplo:**
```
                 (sonriendo)
```

---

### 6️⃣ TRANSITION (Transición)
```
✓ setIndentStart(468 pt)  // 6.5 in desde margen izquierdo
✓ setIndentEnd(0 pt)
✓ setAlignment(LEFT)
✓ Espacio antes: 6 pt
✓ Espacio después: 6 pt
✓ Texto: MAYÚSCULAS
```

**Ejemplo:**
```
                                                  CORTE A:
```

**IMPORTANTE:** Alineación a la derecha se logra con `setIndentStart(468)`, NO con alineación RIGHT.

---

## 📏 TABLA DE REFERENCIA RÁPIDA

| Tipo         | Indent Start | Indent End | Alignment | Spacing Before | Spacing After |
|--------------|--------------|------------|-----------|----------------|---------------|
| ESCENA       | 0 pt         | 0 pt       | LEFT      | 12 pt          | 6 pt          |
| ACCION       | 0 pt         | 0 pt       | LEFT      | 0 pt           | 6 pt          |
| PERSONAJE    | 144 pt       | 0 pt       | LEFT      | 6 pt           | 0 pt          |
| DIALOGO      | 108 pt       | 72 pt      | LEFT      | 0 pt           | 6 pt          |
| PARENTETICO  | 126 pt       | 90 pt      | LEFT      | 0 pt           | 0 pt          |
| TRANSICION   | 468 pt       | 0 pt       | LEFT      | 6 pt           | 6 pt          |

---

## ⚙️ CONFIGURACIÓN BASE DEL DOCUMENTO

```
✓ Página: Carta (8.5 x 11 in)
✓ Margen Superior: 72 pt (1.0 in)
✓ Margen Inferior: 72 pt (1.0 in)
✓ Margen Izquierdo: 108 pt (1.5 in)
✓ Margen Derecho: 72 pt (1.0 in)
✓ Fuente: Courier New / Courier Prime
✓ Tamaño: 12 pt
✓ Interlineado: 1.0 (sencillo)
```

---

## 🔧 CONVERSIÓN PULGADAS → PUNTOS

```
1 pulgada = 72 puntos

0.0 in = 0 pt
1.0 in = 72 pt
1.25 in = 90 pt
1.5 in = 108 pt
1.75 in = 126 pt
2.0 in = 144 pt
6.5 in = 468 pt
```

---

## ✅ IMPLEMENTACIÓN EN CÓDIGO

### Ubicación en el código:
- **Archivo:** `Code.gs`
- **Constante:** `ESTILOS_GUION`
- **Función aplicadora:** `aplicarEstiloAParrafo()` en `Formateo.gs`

### Reseteo de atributos:
La función `aplicarEstiloAParrafo()` resetea TODOS los atributos de párrafo antes de aplicar el nuevo estilo:

```javascript
parrafo.setAlignment(estilo.alineacion);
parrafo.setIndentFirstLine(0); // RESET: sin sangría de primera línea
parrafo.setIndentStart(estilo.sangriaIzq);
parrafo.setIndentEnd(estilo.sangriaDer);
parrafo.setSpacingBefore(estilo.espacioAntes);
parrafo.setSpacingAfter(estilo.espacioDespues);
parrafo.setLineSpacing(estilo.interlineado);
```

---

## ⚠️ REGLAS CRÍTICAS

1. ✅ **TODAS** las identaciones en **puntos (pt)**, no pulgadas
2. ✅ **NO usar** tabs (`\t`) ni espacios manuales
3. ✅ **NO usar** columnas
4. ✅ **NO justificar** texto
5. ✅ Usar siempre `DocumentApp.HorizontalAlignment.LEFT` (excepto NOTA y ACTO)
6. ✅ Cada bloque **resetea** indentación antes de aplicar la suya
7. ✅ El código maneja líneas vacías donde está el cursor
8. ✅ Centrado visual se logra con `setIndentStart()`, NO con alineación CENTER

---

## 🎬 RESULTADO FINAL

Con estas especificaciones, el sistema produce guiones con formato **profesional** idéntico a Final Draft, usando **únicamente** las APIs nativas de Google Docs:

- `setIndentStart()` → Sangría izquierda
- `setIndentEnd()` → Sangría derecha  
- `setAlignment()` → Alineación horizontal
- `setSpacingBefore()` → Espacio antes
- `setSpacingAfter()` → Espacio después

**Sin hacks, sin workarounds, sin limitaciones.**

---

_Documento generado: 14 de diciembre de 2025_  
_Sistema: Guion Pro para Google Docs_
