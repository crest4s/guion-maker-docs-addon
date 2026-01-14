/**
 * AUTOCOMPLETADO.GS - Sistema de Autocompletado de Personajes y Localizaciones
 * 
 * Rastrea y gestiona personajes y localizaciones usados en el guion
 * para ofrecer sugerencias rápidas al usuario.
 */

// ============================================================================
// EXTRACCIÓN DE PERSONAJES Y LOCALIZACIONES
// ============================================================================

/**
 * Extrae todos los personajes únicos del documento.
 * 
 * @return {Array} Array de nombres de personajes
 */
function extraerPersonajes() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  const personajes = new Set();
  
  try {
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const tipo = detectarTipoBloque(parrafo);
        
        if (tipo === 'PERSONAJE') {
          let texto = parrafo.getText().trim();
          
          // Quitar extensiones como (V.O.), (O.S.), (CONT'D), etc.
          texto = texto.replace(/\s*\([^)]+\)\s*$/g, '').trim();
          
          if (texto) {
            personajes.add(texto);
          }
        }
      }
    }
    
    // Ordenar alfabéticamente
    return Array.from(personajes).sort();
    
  } catch (error) {
    console.error('Error en extraerPersonajes:', error);
    return [];
  }
}

/**
 * Extrae todas las localizaciones únicas del documento.
 * 
 * @return {Array} Array de localizaciones
 */
function extraerLocalizaciones() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  const localizaciones = new Set();
  
  try {
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const tipo = detectarTipoBloque(parrafo);
        
        if (tipo === 'ESCENA') {
          const texto = parrafo.getText().trim();
          
          // Extraer la localización de un encabezado de escena
          // Formato: INT./EXT. LOCALIZACIÓN - MOMENTO (NÚMERO)
          const regex = /^(INT\.|EXT\.|INT-EXT|INT\/EXT)\s+([^-–(]+)/i;
          const match = texto.match(regex);
          
          if (match && match[2]) {
            const loc = match[2].trim().toUpperCase();
            if (loc) {
              localizaciones.add(loc);
            }
          }
        }
      }
    }
    
    // Ordenar alfabéticamente
    return Array.from(localizaciones).sort();
    
  } catch (error) {
    console.error('Error en extraerLocalizaciones:', error);
    return [];
  }
}

/**
 * Extrae los momentos del día usados en las escenas.
 * 
 * @return {Array} Array de momentos (DÍA, NOCHE, etc.)
 */
function extraerMomentos() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  const momentos = new Set();
  
  try {
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const tipo = detectarTipoBloque(parrafo);
        
        if (tipo === 'ESCENA') {
          const texto = parrafo.getText().trim();
          
          // Extraer el momento del día
          // Formato: INT./EXT. LOCALIZACIÓN - MOMENTO (NÚMERO)
          const regex = /[-–]\s*([^(]+)/;
          const match = texto.match(regex);
          
          if (match && match[1]) {
            const momento = match[1].trim().toUpperCase();
            // Quitar la numeración si está incluida
            const momentoLimpio = momento.replace(/\s*\(\d+\)\s*$/, '').trim();
            if (momentoLimpio) {
              momentos.add(momentoLimpio);
            }
          }
        }
      }
    }
    
    return Array.from(momentos).sort();
    
  } catch (error) {
    console.error('Error en extraerMomentos:', error);
    return [];
  }
}

// ============================================================================
// FUNCIONES PARA EL SIDEBAR
// ============================================================================

/**
 * Obtiene la lista de personajes en formato JSON para el sidebar.
 * 
 * @return {string} JSON con el array de personajes
 */
function obtenerPersonajesJSON() {
  const personajes = extraerPersonajes();
  return JSON.stringify(personajes);
}

/**
 * Obtiene la lista de localizaciones en formato JSON para el sidebar.
 * 
 * @return {string} JSON con el array de localizaciones
 */
function obtenerLocalizacionesJSON() {
  const localizaciones = extraerLocalizaciones();
  return JSON.stringify(localizaciones);
}

/**
 * Obtiene la lista de momentos en formato JSON para el sidebar.
 * 
 * @return {string} JSON con el array de momentos
 */
function obtenerMomentosJSON() {
  const momentos = extraerMomentos();
  return JSON.stringify(momentos);
}

/**
 * Inserta un nombre de personaje en la posición del cursor.
 * 
 * @param {string} nombrePersonaje - Nombre del personaje a insertar
 */
function insertarNombrePersonaje(nombrePersonaje) {
  if (!nombrePersonaje) return;
  
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  
  try {
    if (cursor) {
      const elemento = cursor.getElement();
      const texto = elemento.asText();
      const offset = cursor.getOffset();
      
      // Insertar el nombre del personaje
      texto.insertText(offset, nombrePersonaje);
      
      // Mover el cursor después del texto insertado
      const nuevaPosicion = doc.newPosition(texto, offset + nombrePersonaje.length);
      doc.setCursor(nuevaPosicion);
      
      // Si el párrafo está vacío, aplicar formato de personaje
      const parrafo = elemento.getParent();
      if (parrafo.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const textoParrafo = parrafo.asParagraph().getText().trim();
        if (textoParrafo === nombrePersonaje) {
          aplicarEstiloAParrafo(parrafo.asParagraph(), 'PERSONAJE');
        }
      }
      
    } else {
      // Si no hay cursor, insertar al final del documento
      const body = doc.getBody();
      const parrafoNuevo = body.appendParagraph(nombrePersonaje);
      aplicarEstiloAParrafo(parrafoNuevo, 'PERSONAJE');
    }
    
  } catch (error) {
    console.error('Error en insertarNombrePersonaje:', error);
    DocumentApp.getUi().alert('Error al insertar personaje: ' + error.message);
  }
}

/**
 * Inserta una localización en un nuevo encabezado de escena.
 * 
 * @param {string} localizacion - Localización a insertar
 * @param {string} intExt - INT., EXT., o INT-EXT
 * @param {string} momento - DÍA, NOCHE, etc.
 */
function insertarEscenaConLocalizacion(localizacion, intExt, momento) {
  intExt = intExt || 'INT.';
  momento = momento || 'DÍA';
  localizacion = localizacion || 'LOCALIZACIÓN';
  
  const textoEscena = intExt + ' ' + localizacion + ' - ' + momento;
  insertarBloqueNuevo('ESCENA', textoEscena);
}

// ============================================================================
// PLANTILLAS Y SUGERENCIAS
// ============================================================================

/**
 * Obtiene plantillas comunes de transiciones.
 * 
 * @return {Array} Array de transiciones comunes
 */
function obtenerTransicionesComunes() {
  return [
    'CORTE A:',
    'DISOLVENCIA A:',
    'FUNDIDO A NEGRO:',
    'FUNDIDO DESDE NEGRO:',
    'FADE IN:',
    'FADE OUT:',
    'CUT TO:',
    'DISSOLVE TO:',
    'SMASH CUT TO:',
    'MATCH CUT TO:',
    'JUMP CUT TO:'
  ];
}

/**
 * Obtiene extensiones comunes para personajes.
 * 
 * @return {Array} Array de extensiones
 */
function obtenerExtensionesPersonaje() {
  return [
    '(V.O.)',      // Voice Over
    '(O.S.)',      // Off Screen
    '(O.C.)',      // Off Camera
    '(CONT\'D)',   // Continued
    '(FILTRADO)',  // Filtered (por teléfono, etc.)
    '(PRE LAP)',   // Pre-lap dialogue
    '(SUSURRO)',
    '(GRITO)'
  ];
}

/**
 * Obtiene parentéticos comunes.
 * 
 * @return {Array} Array de parentéticos
 */
function obtenerParenteticosComunes() {
  return [
    '(pausa)',
    '(sonríe)',
    '(enfadado)',
    '(triste)',
    '(sarcástico)',
    '(susurrando)',
    '(gritando)',
    '(para sí mismo)',
    '(al teléfono)',
    '(interrumpiendo)',
    '(continuando)',
    '(beat)',
    '(ríe)',
    '(llora)'
  ];
}

/**
 * Obtiene momentos del día comunes.
 * 
 * @return {Array} Array de momentos
 */
function obtenerMomentosComunes() {
  return [
    'DÍA',
    'NOCHE',
    'AMANECER',
    'ATARDECER',
    'MADRUGADA',
    'CONTINUO',
    'MISMO TIEMPO',
    'MOMENTOS DESPUÉS',
    'MÁS TARDE'
  ];
}

/**
 * Obtiene sugerencias de INT/EXT.
 * 
 * @return {Array} Array de opciones INT/EXT
 */
function obtenerOpcionesIntExt() {
  return [
    'INT.',
    'EXT.',
    'INT-EXT',
    'INT./EXT.'
  ];
}
