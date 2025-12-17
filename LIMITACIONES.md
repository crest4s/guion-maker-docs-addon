# ⚠️ Limitaciones y Aproximaciones

## 🎯 Resumen Ejecutivo

Este documento detalla honestamente qué funcionalidades de Final Draft **NO** se pueden replicar en Google Docs, qué aproximaciones se han usado, y las limitaciones técnicas del sistema.

---

## ❌ FUNCIONALIDADES IMPOSIBLES EN GOOGLE DOCS

### 1. Autocompletado en Tiempo Real con Dropdown

**En Final Draft:**
- Al escribir, aparece un dropdown con sugerencias
- Se completa mientras escribes en el cursor

**En Google Docs:**
- ❌ **IMPOSIBLE**: Google Docs API no permite crear dropdowns dinámicos en el cursor
- ❌ **IMPOSIBLE**: No se puede interceptar teclas en tiempo real mientras el usuario escribe
- ✅ **APROXIMACIÓN**: Panel lateral con listas clicables de personajes/localizaciones

**Por qué:**
Google Apps Script no tiene acceso a eventos de teclado en tiempo real ni puede modificar la UI del editor mientras se escribe.

---

### 2. Atajos de Teclado Personalizados

**En Final Draft:**
- Tab cambia al siguiente tipo de bloque inteligentemente
- Enter después de Personaje → Diálogo automáticamente
- Ctrl+1, Ctrl+2, etc. para tipos de bloque

**En Google Docs:**
- ❌ **IMPOSIBLE**: No se pueden asignar atajos de teclado personalizados
- ❌ **IMPOSIBLE**: No se puede interceptar Tab o Enter para cambiar comportamiento
- ✅ **APROXIMACIÓN**: Botones en el sidebar y formateo inteligente manual

**Por qué:**
Google Docs tiene atajos predefinidos que no se pueden sobrescribir mediante Apps Script.

---

### 3. Numeración de Escenas en Columnas Laterales

**En Final Draft:**
- Números de escena aparecen en los márgenes izquierdo y derecho
- Formato profesional: número izquierdo y derecho simultáneamente

**En Google Docs:**
- ❌ **IMPOSIBLE**: Google Docs no soporta texto en márgenes fuera del cuerpo
- ❌ **IMPOSIBLE**: No hay concepto de "columnas de numeración"
- ✅ **APROXIMACIÓN**: Número al final del encabezado de escena: `INT. CASA - DÍA (12)`

**Por qué:**
La API de Google Docs solo permite contenido dentro del cuerpo principal del documento.

---

### 4. Elementos de Producción (Breakdown)

**En Final Draft:**
- Resaltado de elementos (props, vestuario, FX, etc.)
- Categorización automática
- Informes de producción

**En Google Docs:**
- ❌ **IMPOSIBLE**: No hay sistema de metadatos por elemento de texto
- ❌ **IMPOSIBLE**: No se pueden crear categorías personalizadas persistentes
- ✅ **APROXIMACIÓN**: Podrías usar comentarios o notas del autor, pero no es automático

**Por qué:**
Google Docs no tiene un sistema de "tagging" de elementos inline.

---

### 5. Modos de Vista (Normal, Tarjetas, Outline)

**En Final Draft:**
- Vista de tarjetas (index cards) para reorganizar escenas
- Vista outline para estructura
- Drag & drop de escenas

**En Google Docs:**
- ❌ **IMPOSIBLE**: No se puede crear una vista alternativa del documento
- ❌ **IMPOSIBLE**: No hay drag & drop de párrafos mediante script
- ✅ **APROXIMACIÓN**: Índice navegable en el sidebar (solo navegación, no reorganización)

**Por qué:**
Google Docs tiene una única vista de documento. No se pueden crear interfaces alternativas.

---

### 6. Revisiones y Marcas de Cambio Avanzadas

**En Final Draft:**
- Sistema de revisiones por color (Pink Pages, Blue Pages, etc.)
- Marcas de revisión con asteriscos en el margen
- Páginas bloqueadas

**En Google Docs:**
- ❌ **IMPOSIBLE**: No hay sistema de "revisiones de producción"
- ❌ **IMPOSIBLE**: No se pueden bloquear páginas
- ✅ **APROXIMACIÓN**: Usar el sistema nativo de sugerencias de Google Docs
- ✅ **APROXIMACIÓN**: Usar el historial de versiones nativo

**Por qué:**
El concepto de "páginas de revisión" es específico del flujo de producción cinematográfica y no tiene equivalente en Google Docs.

---

### 7. Paginación Exacta y Consistente

**En Final Draft:**
- Una página = exactamente una página de papel al imprimir
- Consistencia absoluta entre diferentes computadoras
- Control total sobre breaks de página

**En Google Docs:**
- ⚠️ **LIMITADO**: Google Docs intenta paginar, pero puede variar ligeramente
- ⚠️ **LIMITADO**: Diferentes navegadores pueden mostrar sutiles diferencias
- ✅ **APROXIMACIÓN**: Configuración profesional de márgenes y fuente ayuda, pero no es 100% idéntico

**Por qué:**
Google Docs es un procesador en la nube con rendering variable. Final Draft es local con control total.

---

### 8. Importación/Exportación Perfecta con Formatos de Guion

**En Final Draft:**
- FDX (Final Draft XML) es el estándar
- Importa y exporta perfectamente a FDX, PDF profesional
- Mantiene toda la información de producción

**En Google Docs:**
- ❌ **IMPOSIBLE**: No se puede generar FDX nativo
- ✅ **APROXIMACIÓN**: Exportación a Fountain (formato texto plano)
- ✅ **APROXIMACIÓN**: Exportación a PDF usando la función nativa de Docs (buena calidad)

**Por qué:**
FDX es un formato propietario de Final Draft. Google Docs no lo soporta nativamente.

---

### 9. Reportes de Producción Automáticos

**En Final Draft:**
- Reportes de escenas por localización
- Reportes de días de rodaje
- Listas de personajes con conteo de escenas

**En Google Docs:**
- ⚠️ **PARCIAL**: Se puede extraer información (personajes, localizaciones, escenas)
- ❌ **IMPOSIBLE**: No se pueden generar reportes formateados complejos
- ✅ **APROXIMACIÓN**: Estadísticas básicas en el sidebar y diálogos

**Por qué:**
Google Apps Script puede analizar datos, pero no puede generar documentos auxiliares complejos automáticamente.

---

### 10. Colaboración en Tiempo Real con Bloqueo de Escenas

**En Final Draft:**
- En la versión colaborativa, puedes bloquear escenas específicas
- Control fino sobre quién edita qué

**En Google Docs:**
- ✅ **VENTAJA**: Google Docs tiene MEJOR colaboración en tiempo real que Final Draft
- ❌ **IMPOSIBLE**: No se puede bloquear secciones específicas del documento mediante script
- ⚠️ **PARCIAL**: Puedes usar "Modo de sugerencias" para control editorial

**Nota:**
Esta es una de las pocas áreas donde Google Docs es SUPERIOR a Final Draft.

---

## ✅ APROXIMACIONES IMPLEMENTADAS

### 1. Formateo Inteligente vs. SmartType

**SmartType (Final Draft):**
- Detecta tipo mientras escribes
- Aplica formato automáticamente

**Formateo Inteligente (Guion Pro):**
- Detecta tipo después de escribir
- Usuario aplica con un botón o menú
- **Compromiso aceptable**: Un paso extra, pero funciona bien

---

### 2. Sidebar vs. Paleta Flotante

**Final Draft:**
- Paleta flotante que se puede mover

**Guion Pro:**
- Sidebar fijo a la derecha
- **Compromiso aceptable**: Google Docs solo permite sidebars, pero es funcional

---

### 3. Numeración Inline vs. Marginal

**Final Draft:**
- Números en márgenes izquierdo/derecho

**Guion Pro:**
- Número al final del texto: `(12)`
- **Compromiso aceptable**: No es idéntico, pero es profesionalmente válido

Muchos guiones profesionales usan este formato cuando se convierten a PDF simple.

---

### 4. Listas de Autocompletado vs. Autocompletado Dinámico

**Final Draft:**
- Dropdown en el cursor

**Guion Pro:**
- Listas en sidebar que insertan con clic
- **Compromiso aceptable**: Menos fluido, pero funcional

---

### 5. Exportación Fountain vs. FDX

**Final Draft:**
- FDX es el estándar de intercambio

**Guion Pro:**
- Fountain es un formato de texto plano abierto
- **Ventaja**: Fountain es más portable y puede importarse en muchas apps (Highland, Fade In, etc.)
- **Desventaja**: No incluye metadatos de producción

---

## 🔧 LIMITACIONES TÉCNICAS DE GOOGLE APPS SCRIPT

### 1. Tiempo de Ejecución

- **Límite**: 6 minutos por ejecución (usuarios normales)
- **Impacto**: Ninguno en Guion Pro (las operaciones son rápidas)

### 2. Cuotas Diarias

- **Límite**: ~20,000 llamadas a métodos de Docs por día
- **Impacto**: Muy bajo (el uso normal no lo alcanza)

### 3. Tamaño del Documento

- **Google Docs**: Máximo ~1.02 millones de caracteres
- **Impacto**: Un guion de 120 páginas = ~30,000 caracteres
- **Conclusión**: No es problema (cabrían 30+ guiones largos)

### 4. Latencia de la API

- **Realidad**: Cada llamada a Apps Script tiene ~100-300ms de latencia
- **Impacto**: El formateo puede sentirse ligeramente más lento que en software local
- **Mitigación**: Optimización de operaciones por lotes

### 5. Sin Acceso a Sistema de Archivos

- **Limitación**: No se pueden leer/escribir archivos locales
- **Impacto**: No se puede importar directamente desde archivos FDX en el disco
- **Alternativa**: Copiar/pegar texto o usar Drive

---

## 📊 COMPARACIÓN: FINAL DRAFT vs. GUION PRO

| Funcionalidad | Final Draft | Guion Pro | Comentario |
|--------------|-------------|-----------|------------|
| **Formatos de Bloque** | ✅ | ✅ | Idéntico |
| **Numeración de Escenas** | ✅ Marginal | ✅ Inline | Aproximación válida |
| **Autocompletado** | ✅ Dinámico | ⚠️ Manual | Funcional pero menos fluido |
| **Atajos de Teclado** | ✅ | ❌ | Limitación de Google Docs |
| **Navegación** | ✅ | ✅ | Implementado en sidebar |
| **Formateo Inteligente** | ✅ Automático | ✅ Semi-auto | Un botón extra |
| **Exportación PDF** | ✅ | ✅ | Nativo de Google Docs |
| **Exportación FDX** | ✅ | ❌ | Fountain como alternativa |
| **Colaboración** | ⚠️ Limitada | ✅ Excelente | Google Docs superior |
| **Precio** | $249.99 | Gratis | Ventaja obvia |
| **Requiere Instalación** | Sí | No | Solo navegador |
| **Funciona Offline** | Sí | ⚠️ Parcial | Docs funciona offline con setup |
| **Breakdown de Producción** | ✅ | ❌ | Imposible en Docs |
| **Revisiones por Color** | ✅ | ❌ | Imposible en Docs |

---

## 💡 CUÁNDO USAR GUION PRO vs. FINAL DRAFT

### Usa GUION PRO si:
- ✅ Estás empezando y no quieres invertir $250
- ✅ Trabajas en equipo y necesitas colaboración en tiempo real
- ✅ Quieres escribir desde cualquier dispositivo (incluso tablet/móvil)
- ✅ No necesitas funciones avanzadas de producción
- ✅ Estás en etapa de escritura/reescritura
- ✅ Prefieres trabajar en la nube

### Usa FINAL DRAFT si:
- ✅ Trabajas en producción profesional con equipos grandes
- ✅ Necesitas breakdown de producción integrado
- ✅ Requieres compatibilidad total con estándares de estudio
- ✅ Necesitas revisiones por color (Pink Pages, etc.)
- ✅ Trabajas con guiones de 200+ páginas
- ✅ Requieres exportación FDX para intercambio

### Usa AMBOS si:
- ✅ Escribe el primer borrador en Guion Pro (gratis, colaborativo)
- ✅ Exporta a Fountain
- ✅ Importa Fountain a Final Draft para la etapa de producción
- ✅ **Best of both worlds**

---

## 🎓 CONSEJOS PARA USUARIOS

### 1. Workflow Recomendado

```
1. Escribe libremente en Guion Pro
2. Usa formateo inteligente cada pocas escenas
3. Renumera escenas al terminar el acto
4. Exporta a PDF para lecturas
5. Si vas a producción → Exporta a Fountain → Importa a Final Draft
```

### 2. Organización de Documentos

- **Un documento por guion** (no pongas varios guiones en uno)
- **Usa nombres descriptivos**: "TITULO - Borrador 3 - 2025-12-14"
- **Carpetas de Drive**: Organiza por proyecto
- **Comentarios de Docs**: Úsalos para notas de reescritura

### 3. Colaboración Efectiva

- **Modo Sugerencias**: Para feedback de guionistas/directores
- **Comentarios**: Para notas de producción
- **Historial de Versiones**: Para comparar borradores
- **Asignar Tareas**: En comentarios para reescrituras

### 4. Exportación Profesional

**Para PDF de lectura:**
1. 🎬 Guion > ⚙️ Configurar Documento
2. 🎬 Guion > 🔢 Renumerar Escenas
3. Archivo > Descargar > PDF
4. ✅ Listo para enviar

**Para continuar en otra app:**
1. 🎬 Guion > (Añadir función "Exportar a Fountain")
2. Copiar el texto Fountain
3. Importar en Highland 2, Fade In, WriterDuet, etc.

---

## 🚀 ROADMAP FUTURO (Potencial)

Mejoras que podrían implementarse:

### Versión 1.1
- [ ] Plantillas de escenas comunes
- [ ] Más opciones de exportación (Markdown, HTML)
- [ ] Temas de color para el sidebar
- [ ] Atajos visuales mejorados

### Versión 1.5
- [ ] Sistema de notas de reescritura
- [ ] Contador de páginas más preciso
- [ ] Plantillas de actos (3 actos, 5 actos, etc.)
- [ ] Exportación a formato Celtx

### Versión 2.0
- [ ] Integración con herramientas de producción externas (vía API si es posible)
- [ ] Generación de reportes en hojas de cálculo de Google
- [ ] Sistema de backup automático a Drive

**NOTA:** Todas estas dependen de las capacidades de Google Apps Script.

---

## 🎬 CONCLUSIÓN

**Guion Pro NO es un reemplazo 100% de Final Draft**, pero cubre el **80-90% de las necesidades** de un guionista en etapa de escritura.

### Es perfecto para:
- Borradores y reescrituras
- Colaboración
- Escritores que empiezan
- Presupuestos limitados
- Trabajo remoto/móvil

### NO es ideal para:
- Producción profesional avanzada
- Breakdown detallado
- Revisiones por color
- Workflows de estudio establecidos

**La buena noticia:** Puedes empezar en Guion Pro gratis y migrar a Final Draft cuando llegues a producción. El formato Fountain permite la transición.

---

## 📞 SOPORTE Y MEJORAS

Si encuentras limitaciones adicionales o tienes sugerencias:
- Reporta issues específicos
- Propón mejoras viables dentro de las capacidades de Google Apps Script
- Contribuye con código (si el proyecto es de código abierto)

**Recuerda:** Las limitaciones listadas son TÉCNICAS, no por falta de implementación. No se pueden resolver sin cambios en Google Apps Script o Google Docs API.
