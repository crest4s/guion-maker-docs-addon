# 📝 EJEMPLOS DE SINTAXIS FOUNTAIN

Esta guía contiene ejemplos prácticos de cómo escribir en Fountain y cómo se convertirá automáticamente en Guion Pro.

---

## 🎬 EJEMPLO COMPLETO: ESCENA DE CAFÉ

### Texto en Fountain (lo que escribes):

```
INT. CAFETERÍA BOHEMIA - DÍA

La cafetería está llena de estudiantes. Música de jazz suena de fondo.

MARÍA entra apresurada, con libros en los brazos. Busca con la mirada.

MARÍA
(susurrando)
¿Dónde está?

Ve a JUAN sentado en una mesa del fondo. Camina hacia él.

JUAN
(sin levantar la vista del laptop)
Llegas tarde.

MARÍA
Lo siento. El tráfico estaba imposible.

Se sienta frente a él. Juan finalmente la mira.

JUAN
¿Trajiste los documentos?

María saca una carpeta de su bolso.

MARÍA
Aquí están.

JUAN
(revisando los papeles)
Esto no es lo que pedí.

MARÍA
¿Qué?

JUAN
Estos son los contratos viejos.

María se levanta bruscamente.

MARÍA
No puedo creer que pienses que yo...

JUAN
Siéntate. Hablemos.

CORTE A:
```

### Resultado Formateado (automático):

Guion Pro convertirá cada elemento:

- `INT. CAFETERÍA BOHEMIA - DÍA` → **ESCENA** (mayúsculas, margen izq)
- Descripciones → **ACCIÓN** (texto normal)
- `MARÍA`, `JUAN` → **PERSONAJE** (mayúsculas, sangría 2.5")
- `(susurrando)`, `(sin levantar...)` → **PARENTÉTICO** (sangría 1.75")
- Diálogos → **DIÁLOGO** (sangría 1.5" izq y der)
- `CORTE A:` → **TRANSICIÓN** (alineado a la derecha)

---

## 📖 EJEMPLOS POR TIPO DE ELEMENTO

### 1. SCENE HEADING (Encabezado de Escena)

#### Ejemplos válidos:

```
INT. CASA DE JUAN - NOCHE

EXT. PARQUE CENTRAL - DÍA

INT/EXT. COCHE EN MOVIMIENTO - ATARDECER

INT./EXT. OFICINA - DÍA

I/E AEROPUERTO - MADRUGADA
```

#### Forzar escena (cualquier texto):

```
.FLASHBACK - 1995

.MONTAJE: PREPARÁNDOSE PARA LA GUERRA
```

El punto inicial `.` fuerza que se trate como escena aunque no empiece con INT/EXT.

---

### 2. CHARACTER (Personaje)

#### Ejemplos básicos:

```
JUAN

MARÍA LÓPEZ

EL PROFESOR

DETECTIVE
```

#### Con extensiones:

```
JUAN (V.O.)

MARÍA (O.S.)

DETECTIVE (CONT'D)

NIÑO (filtrado)
```

**Extensiones comunes:**
- `(V.O.)` - Voice Over (voz en off, narración)
- `(O.S.)` - Off Screen (fuera de pantalla, se oye pero no se ve)
- `(CONT'D)` - Continued (continúa hablando tras interrupción)
- `(filtrado)` - Por teléfono, radio, etc.

#### Forzar personaje:

```
@mccLANE
```

El `@` inicial fuerza tratamiento como personaje incluso si no está todo en mayúsculas.

---

### 3. DIALOGUE (Diálogo)

El diálogo es cualquier texto que sigue a un PERSONAJE o PARENTÉTICO:

```
JUAN
Hola, ¿cómo estás?

MARÍA
(sonriendo)
Muy bien, gracias por preguntar.
¿Y tú?

JUAN
No me puedo quejar.
```

**Múltiples líneas de diálogo:**

```
PROFESOR
Escuchen con atención.
Esto es importante.
No lo repetiré.
```

Cada línea se formatea automáticamente con la sangría correcta.

---

### 4. PARENTHETICAL (Parentético)

Debe estar entre paréntesis:

```
MARÍA
(llorando)
No puedo más.

JUAN
(sarcástico)
Claro, porque tú eres la única que sufre.

DETECTIVE
(mirando por la ventana)
Ahí está.
```

**Nota:** Los parentéticos deben estar en su propia línea, no mezclados con diálogo.

---

### 5. ACTION (Acción)

Todo texto que no coincida con otras reglas es ACCIÓN:

```
Juan camina hacia la puerta. Se detiene. Mira hacia atrás.

La lluvia comienza a caer sobre el techo de metal.

BANG! La puerta se cierra de golpe.

Un silencio incómodo llena la habitación.
```

**Tips:**
- Escribe en presente
- Sé conciso y visual
- Una línea de acción = una idea
- Línea en blanco = pausa/cambio de enfoque

---

### 6. TRANSITION (Transición)

#### Terminan en `TO:`:

```
CORTE A:

DISOLVENCIA A:

FUNDIDO A NEGRO:

MATCH CUT TO:

SMASH CUT TO:
```

#### Forzar transición con `>`:

```
> JUMP CUT TO:

> RÁPIDO CORTE A:
```

**Nota:** Las transiciones se alinean a la derecha automáticamente.

---

### 7. CENTERED TEXT (Texto Centrado) / ACT HEADING

#### Forzar con `=`:

```
= ACTO UNO

= FIN DEL ACTO DOS

= TRES AÑOS DESPUÉS
```

#### Palabras clave automáticas:

```
ACTO I

FIN DEL ACTO

TEASER

TAG
```

---

### 8. NOTES (Notas del Autor)

#### Con doble corchete:

```
[[ Esta escena puede ser cortada en edición ]]

[[ NOTA DE PRODUCCIÓN: Necesitamos lluvia artificial ]]
```

#### Con prefijo:

```
NOTA: Revisar continuidad con escena 5

[NOTA] Esta línea de diálogo puede cambiar
```

Las notas se formatean en gris, cursiva, con sangrías.

---

## 🎭 ESCENA COMPLETA DE EJEMPLO

### Fountain Source:

```
INT. OFICINA DEL DETECTIVE - NOCHE

Llueve afuera. El DETECTIVE MORSE (50s, cansado) revisa archivos.

Su teléfono suena. Lo ignora. Sigue sonando.

DETECTIVE MORSE
(para sí mismo)
¿Qué ahora?

Contesta el teléfono.

DETECTIVE MORSE
(al teléfono)
Morse.

CAPITÁN HARRIS (V.O.)
Tenemos otro caso.

DETECTIVE MORSE
Estoy ocupado.

CAPITÁN HARRIS (V.O.)
No es opcional.

Morse cierra los ojos, frustrado.

DETECTIVE MORSE
Dirección.

CAPITÁN HARRIS (V.O.)
(leyendo)
Avenida Central 423. Edificio abandonado.

DETECTIVE MORSE
¿Qué tenemos?

Una pausa.

CAPITÁN HARRIS (V.O.)
Un cuerpo. Sin identificación.

Morse se levanta, toma su abrigo.

DETECTIVE MORSE
Voy para allá.

Cuelga. Mira por la ventana.

DETECTIVE MORSE
(susurrando)
Siempre llueve.

CORTE A:

EXT. AVENIDA CENTRAL - NOCHE

Coches patrulla con luces intermitentes. Acordonamiento policial.

Morse llega en su sedán. Sale bajo la lluvia.

UN OFICIAL JOVEN
(corriendo hacia él)
Detective Morse. Por aquí.

Morse lo sigue hacia el edificio.

DISOLVENCIA A:
```

---

## ⚙️ FORMATEO FORZADO (ADVANCED)

Cuando Fountain no detecta correctamente un elemento, usa estos prefijos:

| Prefijo | Tipo | Ejemplo |
|---------|------|---------|
| `.` | Escena | `.SUEÑO - SECUENCIA ONÍRICA` |
| `@` | Personaje | `@mcCLANE` (no en mayúsculas) |
| `>` | Transición | `> IRIS OUT` |
| `=` | Centrado/Acto | `= EPÍLOGO` |
| `[[` `]]` | Nota | `[[ Cortar si es muy largo ]]` |
| `!` | Ignorar | `!Este texto no se formateará` |

---

## 💡 TIPS Y TRUCOS

### 1. Formateo Progresivo

Escribe todo tu guion primero en Fountain, luego formatea:

```
1. Escribe 30 páginas en texto plano
2. Formatea todo: Menú → Formatear Todo (Fountain → Guion)
3. Revisa y edita con formateo visual
4. Exporta a PDF
```

### 2. Nombres de Personajes Consistentes

Fountain distingue mayúsculas:

```
JUAN        # Personaje
juan        # Acción (texto normal)
Juan        # Acción (texto normal)
```

**Recomendación:** Usa SIEMPRE mayúsculas para nombres en diálogos.

### 3. Separación Visual

Usa líneas en blanco para separar elementos:

```
INT. CASA - DÍA
                    <- línea en blanco
Juan entra.
                    <- línea en blanco
JUAN
Hola.
```

### 4. Extensiones de Personaje

```
# Primera aparición
JUAN
Hola.

# Si continúa hablando tras una acción
JUAN (CONT'D)
Como decía...

# Voz en off
JUAN (V.O.)
Recuerdo ese día...

# Fuera de pantalla
JUAN (O.S.)
¡Espera!
```

### 5. Escenas Bilingües

Fountain soporta INT/EXT en español e inglés:

```
INT. CASA - DÍA        # Español
INTERIOR CASA - DÍA    # Español alternativo
INT. HOUSE - DAY       # Inglés
```

Guion Pro detecta ambos idiomas.

---

## 🚫 ERRORES COMUNES

### ❌ ERROR 1: Falta el punto después de INT/EXT

```
# ❌ Incorrecto:
INT CASA - DÍA

# ✅ Correcto:
INT. CASA - DÍA
```

### ❌ ERROR 2: Personaje no en mayúsculas

```
# ❌ Se detectará como ACCIÓN:
Juan
Hola.

# ✅ Correcto:
JUAN
Hola.
```

### ❌ ERROR 3: Parentético sin paréntesis

```
# ❌ Se detectará como DIÁLOGO:
susurrando

# ✅ Correcto:
(susurrando)
```

### ❌ ERROR 4: Transición sin `:` final

```
# ❌ Se detectará como PERSONAJE:
CORTE A

# ✅ Correcto:
CORTE A:
```

### ❌ ERROR 5: Mezclar tipos en una línea

```
# ❌ Incorrecto:
JUAN (llorando) No puedo más.

# ✅ Correcto:
JUAN
(llorando)
No puedo más.
```

---

## 📚 PLANTILLA INICIAL

Copia esto para empezar un nuevo guion:

```
Title: MI GUION
Author: Tu Nombre
Draft date: 14/12/2025
Contact: tu@email.com

===

FADE IN:

INT. LOCALIZACIÓN - DÍA

Descripción de la escena.

PERSONAJE
Primer diálogo.

FADE OUT.

THE END
```

Luego formatea con: `🎬 Guion` → `✨ Formatear Todo (Fountain → Guion)`

---

## 🎓 EJERCICIO PRÁCTICO

Intenta escribir esta escena en Fountain:

**Escenario:**
- Interior de una biblioteca, de noche
- Ana busca un libro
- Pedro la interrumpe
- Dialogan en susurros
- Termina con corte a exterior

**Tu turno:** Escribe la escena antes de ver la solución.

---

### SOLUCIÓN:

```
INT. BIBLIOTECA MUNICIPAL - NOCHE

Silencio absoluto. ANA (20s) busca entre los estantes con una linterna.

Encuentra un libro antiguo. Lo saca cuidadosamente.

PEDRO (O.S.)
(susurrando)
¿Ana?

Ana se sobresalta. Casi deja caer el libro.

ANA
(susurrando, molesta)
Me asustaste.

PEDRO entra en cuadro. También tiene una linterna.

PEDRO
(susurrando)
¿Lo encontraste?

ANA
(mostrando el libro)
Creo que sí.

Ambos miran el libro. Una pausa.

PEDRO
(susurrando)
¿Estás segura?

ANA
(susurrando)
Solo hay una forma de saberlo.

Abre el libro. Una luz brillante emana de las páginas.

CORTE A:

EXT. BIBLIOTECA - NOCHE

La biblioteca desde afuera. Una ventana brilla intensamente.
```

---

**¡Practica escribiendo en Fountain y usa Guion Pro para ver los resultados profesionales! 🎬✨**
