/**
 * UTILIDADES.GS - Funciones Auxiliares
 * 
 * Funciones de utilidad general que soportan el resto del sistema.
 */

// ============================================================================
// UTILIDADES DE DOCUMENTO
// ============================================================================

/**
 * Cuenta el número total de párrafos en el documento.
 * 
 * @return {number} Número de párrafos
 */
function contarParrafos() {
  return DocumentApp.getActiveDocument().getBody().getParagraphs().length;
}

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

/**
 * Valida que un encabezado de escena tenga el formato correcto.
 * 
 * @param {string} texto - Texto a validar
 * @return {boolean} true si es válido
 */
function validarEncabezadoEscena(texto) {
  if (!texto) return false;
  
  // Debe empezar con INT., EXT., o variaciones
  const regex = /^(INT\.|EXT\.|INT-EXT|INT\/EXT)\s+.+\s+-\s+.+/i;
  return regex.test(texto);
}

/**
 * Sugiere correcciones para un encabezado de escena inválido.
 * 
 * @param {string} texto - Texto a corregir
 * @return {string} Sugerencia de corrección
 */
function sugerirCorreccionEscena(texto) {
  if (!texto) return 'INT. LOCALIZACIÓN - DÍA';
  
  // Si no empieza con INT/EXT, añadirlo
  if (!/^(INT\.|EXT\.)/i.test(texto)) {
    texto = 'INT. ' + texto;
  }
  
  // Si no tiene guión separador, añadirlo
  if (!texto.includes(' - ') && !texto.includes(' – ')) {
    texto = texto + ' - DÍA';
  }
  
  return texto.toUpperCase();
}

// ============================================================================
// FUNCIONES PARA SIDEBAR
// ============================================================================

/**
 * Detecta el tipo de bloque de un párrafo.
 * @param {Paragraph} parrafo - Párrafo a analizar
 * @return {string} Tipo de bloque (ESCENA, ACCION, PERSONAJE, etc.)
 */
function detectarTipoBloque(parrafo) {
  var indent = parrafo.getIndentStart();
  var texto = parrafo.getText().trim();
  
  // ESCENA - indent 0 y empieza con INT/EXT
  if (Math.abs(indent - 0) <= 2 && /^(INT\.|EXT\.|INT\.\/EXT\.)/i.test(texto)) {
    return 'ESCENA';
  }
  
  // PERSONAJE - indent 144pt
  if (Math.abs(indent - 144) <= 2) {
    return 'PERSONAJE';
  }
  
  // DIALOGO - indent 108pt
  if (Math.abs(indent - 108) <= 2) {
    return 'DIALOGO';
  }
  
  // PARENTETICO - indent 126pt
  if (Math.abs(indent - 126) <= 2) {
    return 'PARENTETICO';
  }
  
  // TRANSICION - indent 376pt (13.25cm desde borde izquierdo)
  if (Math.abs(indent - 376) <= 2) {
    return 'TRANSICION';
  }
  
  // ACT_BREAK - centrado
  if (parrafo.getAlignment() === DocumentApp.HorizontalAlignment.CENTER) {
    return 'ACTO';
  }
  
  // ACCION - por defecto
  return 'ACCION';
}

/**
 * Verifica si un párrafo es un encabezado de escena.
 * @param {Paragraph} parrafo - Párrafo a verificar
 * @return {boolean} true si es encabezado de escena
 */
function isSceneHeading(parrafo) {
  var texto = parrafo.getText().trim();
  var indent = parrafo.getIndentStart();
  return Math.abs(indent - 0) <= 2 && /^(INT\.|EXT\.|INT\.\/EXT\.)/i.test(texto);
}

/**
 * Aplica estilo a un párrafo según el tipo.
 * @param {Paragraph} parrafo - Párrafo a formatear
 * @param {string} tipo - Tipo de bloque
 */
function aplicarEstiloAParrafo(parrafo, tipo) {
  var formatMap = {
    'ESCENA': 'SCENE_HEADING',
    'ACCION': 'ACTION',
    'PERSONAJE': 'CHARACTER',
    'DIALOGO': 'DIALOGUE',
    'PARENTETICO': 'PARENTHETICAL',
    'TRANSICION': 'TRANSITION',
    'ACTO': 'ACT_BREAK'
  };
  
  var formatType = formatMap[tipo];
  if (formatType && FORMAT_CONFIG[formatType]) {
    applyDirectFormat(parrafo, formatType);
  }
}

