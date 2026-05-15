/**
 * FOUNTAINPARSER.GS - Parser y Convertidor de Fountain a Guion
 * 
 * Implementa un parser completo de sintaxis Fountain que convierte
 * texto plano en guion formateado profesional.
 * 
 * Basado en la especificación Fountain: https://fountain.io/syntax
 * Compatible con herramientas como Fountainize.
 * 
 * @author Guion Pro
 * @version 2.0
 */

// ============================================================================
// PARSER FOUNTAIN - FUNCIÓN PRINCIPAL
// ============================================================================

/**
 * Convierte todo el documento de formato Fountain a guion formateado.
 * 
 * Esta función analiza cada párrafo del documento, detecta el tipo de
 * elemento según las reglas de Fountain, y aplica el formato apropiado.
 */
function formatearDocumentoFountain() {
  const doc = DocumentApp.getActiveDocument();
  const ui = DocumentApp.getUi();
  
  try {
    const body = doc.getBody();
    const numChildren = body.getNumChildren();
    let contadorFormateados = 0;
    let ultimoTipo = null;
    
    // Iterar sobre todos los párrafos
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const texto = parrafo.getText().trim();
        
        // Saltar párrafos vacíos
        if (!texto) {
          continue;
        }
        
        // Detectar tipo de bloque según sintaxis Fountain
        const tipoDetectado = detectarTipoFountain(parrafo, ultimoTipo);
        
        if (tipoDetectado) {
          aplicarEstiloAParrafo(parrafo, tipoDetectado);
          ultimoTipo = tipoDetectado;
          contadorFormateados++;
        }
      }
    }
    
    // Renumerar escenas automáticamente
    renumberScenes();
    
    // Formateo completado - sin mensaje
    console.log('Formateados ' + contadorFormateados + ' bloques');
    
  } catch (error) {
    console.error('Error en formatearDocumentoFountain:', error);
    ui.alert('Error al formatear documento: ' + error.message);
  }
}

// ============================================================================
// DETECCIÓN DE TIPOS FOUNTAIN
// ============================================================================

/**
 * Detecta el tipo de bloque según las reglas de sintaxis Fountain.
 * 
 * @param {Paragraph} parrafo - Párrafo a analizar
 * @param {string} tipoAnterior - Tipo del bloque anterior (para contexto)
 * @return {string|null} Tipo de bloque detectado
 */
function detectarTipoFountain(parrafo, tipoAnterior) {
  if (!parrafo) return null;
  
  const texto = parrafo.getText().trim();
  if (!texto) return null;
  
  // REGLA 1: SCENE HEADING (Encabezado de Escena)
  // Líneas que empiezan con INT, EXT, INT/EXT, I/E (case-insensitive)
  // También se puede forzar con punto: .SCENE
  if (esCabeceroEscenaFountain(texto)) {
    return 'ESCENA';
  }
  
  // REGLA 2: TRANSITION (Transición)
  // Líneas que terminan con "TO:" o forzadas con > al inicio
  if (esTransicionFountain(texto)) {
    return 'TRANSICION';
  }
  
  // REGLA 3: PARENTHETICAL (Parentético)
  // Texto entre paréntesis
  if (esParenteticoFountain(texto)) {
    return 'PARENTETICO';
  }
  
  // REGLA 4: CHARACTER (Personaje)
  // Todo en mayúsculas, no termina en TO:, corto
  // Puede tener extensiones: (V.O.), (O.S.), (CONT'D)
  if (esPersonajeFountain(texto)) {
    return 'PERSONAJE';
  }
  
  // REGLA 5: DIALOGUE (Diálogo)
  // Texto que sigue a CHARACTER o PARENTHETICAL
  if (tipoAnterior === 'PERSONAJE' || tipoAnterior === 'PARENTETICO') {
    // Solo si no es un parentético nuevo
    if (!esParenteticoFountain(texto)) {
      return 'DIALOGO';
    }
  }
  
  // REGLA 6: ACT HEADING (Separador de Acto)
  // Forzado con = o palabras clave
  if (esActoFountain(texto)) {
    return 'ACTO';
  }
  
  // REGLA 7: NOTE (Nota del Autor)
  // Texto entre [[ y ]]
  if (esNotaFountain(texto)) {
    return 'NOTA';
  }
  
  // REGLA 8: ACTION (Acción) - DEFAULT
  // Todo lo demás es acción/descripción
  return 'ACCION';
}

// ============================================================================
// FUNCIONES DE DETECCIÓN ESPECÍFICAS
// ============================================================================

/**
 * Detecta si una línea es un encabezado de escena según Fountain.
 * 
 * Reglas:
 * - Empieza con INT, EXT, INT/EXT, I/E (case-insensitive)
 * - Puede incluir punto después: INT.
 * - Puede ser forzado con punto inicial: .CUALQUIER COSA
 * 
 * @param {string} texto - Texto a analizar
 * @return {boolean} True si es encabezado de escena
 */
function esCabeceroEscenaFountain(texto) {
  if (!texto) return false;
  
  // Forzado con punto inicial
  if (texto.startsWith('.')) {
    return true;
  }
  
  // Patrones estándar de escena
  const patronesEscena = [
    /^INT[\.\s]/i,
    /^EXT[\.\s]/i,
    /^INT\/EXT[\.\s]/i,
    /^I\/E[\.\s]/i,
    /^INTERIOR[\.\s]/i,
    /^EXTERIOR[\.\s]/i,
    /^EST[\.\s]/i  // Español: Establecimiento
  ];
  
  for (let i = 0; i < patronesEscena.length; i++) {
    if (patronesEscena[i].test(texto)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detecta si una línea es una transición según Fountain.
 * 
 * Reglas:
 * - Termina con "TO:"
 * - Está en mayúsculas
 * - O está forzada con > al inicio
 * 
 * @param {string} texto - Texto a analizar
 * @return {boolean} True si es transición
 */
function esTransicionFountain(texto) {
  if (!texto) return false;
  
  // Forzado con >
  if (texto.startsWith('>') && !texto.startsWith('>>')) {
    return true;
  }
  
  // Termina con TO: y está en mayúsculas
  if (texto.endsWith('TO:') && texto === texto.toUpperCase()) {
    return true;
  }
  
  // Transiciones comunes
  const transicionesComunes = [
    'FADE IN:',
    'FADE OUT',
    'FADE TO BLACK',
    'CUT TO BLACK',
    'FUNDIDO A:',
    'CORTE A:',
    'DISOLVENCIA A:'
  ];
  
  const textoUpper = texto.toUpperCase();
  for (let i = 0; i < transicionesComunes.length; i++) {
    if (textoUpper === transicionesComunes[i]) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detecta si una línea es un parentético según Fountain.
 * 
 * Reglas:
 * - Empieza y termina con paréntesis: (texto)
 * 
 * @param {string} texto - Texto a analizar
 * @return {boolean} True si es parentético
 */
function esParenteticoFountain(texto) {
  if (!texto) return false;
  
  return texto.startsWith('(') && texto.endsWith(')');
}

/**
 * Detecta si una línea es un nombre de personaje según Fountain.
 * 
 * Reglas:
 * - Está completamente en mayúsculas
 * - No termina con "TO:"
 * - Tiene menos de 40 caracteres
 * - Puede tener extensiones entre paréntesis: JUAN (V.O.)
 * - No es un encabezado de escena
 * 
 * @param {string} texto - Texto a analizar
 * @return {boolean} True si es nombre de personaje
 */
function esPersonajeFountain(texto) {
  if (!texto) return false;
  
  // Forzado con @ al inicio
  if (texto.startsWith('@')) {
    return true;
  }
  
  // No debe ser encabezado de escena
  if (esCabeceroEscenaFountain(texto)) {
    return false;
  }
  
  // No debe ser transición
  if (esTransicionFountain(texto)) {
    return false;
  }
  
  // Debe estar en mayúsculas
  if (texto !== texto.toUpperCase()) {
    return false;
  }
  
  // Debe ser relativamente corto
  if (texto.length > 50) {
    return false;
  }
  
  // Quitar extensiones para analizar
  const textoSinExtensiones = texto.replace(/\s*\([^)]+\)\s*$/g, '').trim();
  
  // No debe terminar con puntuación (excepto extensiones)
  if (textoSinExtensiones.endsWith('.') || 
      textoSinExtensiones.endsWith(',') ||
      textoSinExtensiones.endsWith(':')) {
    return false;
  }
  
  // Debe tener entre 1 y 5 palabras
  const palabras = textoSinExtensiones.split(/\s+/);
  if (palabras.length === 0 || palabras.length > 5) {
    return false;
  }
  
  return true;
}

/**
 * Detecta si una línea es un separador de acto según Fountain.
 * 
 * Reglas:
 * - Forzado con = al inicio
 * - O contiene palabras clave: ACTO, ACT, FIN DEL ACTO, etc.
 * 
 * @param {string} texto - Texto a analizar
 * @return {boolean} True si es separador de acto
 */
function esActoFountain(texto) {
  if (!texto) return false;
  
  // Forzado con =
  if (texto.startsWith('=')) {
    return true;
  }
  
  // Palabras clave
  const patronesActo = [
    /^ACTO\s+[IVX\d]+/i,
    /^ACT\s+[IVX\d]+/i,
    /^FIN DEL ACTO/i,
    /^END OF ACT/i,
    /^TEASER/i,
    /^TAG/i,
    /^COLD OPEN/i
  ];
  
  for (let i = 0; i < patronesActo.length; i++) {
    if (patronesActo[i].test(texto)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detecta si una línea es una nota del autor según Fountain.
 * 
 * Reglas:
 * - Texto entre [[ y ]]
 * - O empieza con "NOTA:" o "NOTE:"
 * 
 * @param {string} texto - Texto a analizar
 * @return {boolean} True si es nota
 */
function esNotaFountain(texto) {
  if (!texto) return false;
  
  // Notas entre corchetes dobles
  if (texto.startsWith('[[') && texto.endsWith(']]')) {
    return true;
  }
  
  // Notas con prefijo
  if (/^(NOTA:|NOTE:|\[NOTA\]|\[NOTE\])/i.test(texto)) {
    return true;
  }
  
  return false;
}

// ============================================================================
// FORMATEO DE SELECCIÓN (MODO HÍBRIDO)
// ============================================================================

/**
 * Aplica formateo Fountain solo a la selección actual.
 * Útil para convertir bloques específicos sin afectar todo el documento.
 */
function formatearSeleccionFountain() {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();
  const ui = DocumentApp.getUi();
  
  if (!selection) {
    return; // Sin selección - operación cancelada
  }
  
  try {
    const elementos = selection.getRangeElements();
    let contadorFormateados = 0;
    let ultimoTipo = null;
    
    // Recopilar párrafos únicos
    const parrafos = [];
    for (let i = 0; i < elementos.length; i++) {
      const elem = elementos[i].getElement();
      let parrafo = null;
      
      if (elem.getType() === DocumentApp.ElementType.PARAGRAPH) {
        parrafo = elem.asParagraph();
      } else if (elem.getType() === DocumentApp.ElementType.TEXT) {
        parrafo = elem.getParent().asParagraph();
      }
      
      if (parrafo && parrafos.indexOf(parrafo) === -1) {
        parrafos.push(parrafo);
      }
    }
    
    // Formatear cada párrafo
    for (let i = 0; i < parrafos.length; i++) {
      const texto = parrafos[i].getText().trim();
      
      if (texto) {
        const tipoDetectado = detectarTipoFountain(parrafos[i], ultimoTipo);
        
        if (tipoDetectado) {
          aplicarEstiloAParrafo(parrafos[i], tipoDetectado);
          ultimoTipo = tipoDetectado;
          contadorFormateados++;
        }
      }
    }
    
    if (contadorFormateados > 0) {
      // Feedback silencioso
    } else {
      // No se detectaron bloques - sin mensaje
    }
    
  } catch (error) {
    console.error('Error en formatearSeleccionFountain:', error);
    ui.alert('Error al formatear selección: ' + error.message);
  }
}

// La exportación a Fountain se gestiona desde Utilities.gs (mostrarExportacionFountain / exportarAFountain),
// que muestra el resultado en un diálogo copiable sin necesitar permisos de Drive.
