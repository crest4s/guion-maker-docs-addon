/**
 * NAVEGACION.GS - Sistema de Numeración y Navegación
 * 
 * Funciones para numerar escenas, extraer índices y navegar por el documento.
 */

// ============================================================================
// NUMERACIÓN DE ESCENAS
// ============================================================================

/**
 * Renumera todas las escenas del documento secuencialmente.
 * Actualiza los encabezados de escena con números (1), (2), (3), etc.
 */
function renumerarTodasLasEscenas() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const ui = DocumentApp.getUi();
  
  try {
    let numeroEscena = 1;
    let escenasActualizadas = 0;
    const numChildren = body.getNumChildren();
    
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const tipo = detectarTipoBloque(parrafo);
        
        if (tipo === 'ESCENA') {
          // Actualizar el texto de la escena con el número
          let texto = parrafo.getText();
          
          // Quitar numeración anterior si existe
          texto = quitarNumeracionEscena(texto);
          
          // Añadir nueva numeración al final
          const textoNumerado = texto + ' (' + numeroEscena + ')';
          parrafo.setText(textoNumerado);
          
          // Reaplicar el estilo (por si se perdió al cambiar el texto)
          aplicarEstiloAParrafo(parrafo, 'ESCENA');
          
          numeroEscena++;
          escenasActualizadas++;
        }
      }
    }
    
    if (escenasActualizadas > 0) {
      // Renumeración completada - feedback silencioso
    } else {
      // No se encontraron escenas - sin mensaje
    }
    
  } catch (error) {
    console.error('Error en renumerarTodasLasEscenas:', error);
    ui.alert('Error al renumerar escenas: ' + error.message);
  }
}

/**
 * Quita la numeración existente de un encabezado de escena.
 * 
 * @param {string} texto - Texto de la escena
 * @return {string} Texto sin numeración
 */
function quitarNumeracionEscena(texto) {
  // Quitar numeración al final: (1), (2), etc.
  return texto.replace(/\s*\(\d+\)\s*$/, '').trim();
}

/**
 * Extrae el número de una escena si lo tiene.
 * 
 * @param {string} texto - Texto de la escena
 * @return {number|null} Número de escena o null
 */
function extraerNumeroEscena(texto) {
  const match = texto.match(/\((\d+)\)\s*$/);
  return match ? parseInt(match[1]) : null;
}

// ============================================================================
// ÍNDICE Y NAVEGACIÓN
// ============================================================================

/**
 * Obtiene un índice de todas las escenas del documento.
 * 
 * @return {Array} Array de objetos con información de cada escena
 */
function obtenerIndiceEscenas() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  const escenas = [];
  
  try {
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const tipo = detectarTipoBloque(parrafo);
        
        if (tipo === 'ESCENA') {
          const texto = parrafo.getText();
          const numero = extraerNumeroEscena(texto);
          const textoLimpio = quitarNumeracionEscena(texto);
          
          escenas.push({
            indice: i,
            numero: numero || escenas.length + 1,
            texto: textoLimpio,
            textoCompleto: texto
          });
        }
      }
    }
    
    return escenas;
    
  } catch (error) {
    console.error('Error en obtenerIndiceEscenas:', error);
    return [];
  }
}

/**
 * Navega a una escena específica por su índice en el documento.
 * 
 * @param {number} indice - Índice del párrafo de la escena
 */
function navegarAEscena(indice) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  try {
    if (indice >= 0 && indice < body.getNumChildren()) {
      const parrafo = body.getChild(indice);
      
      if (parrafo.getType() === DocumentApp.ElementType.PARAGRAPH) {
        // Posicionar el cursor al inicio de la escena
        const posicion = doc.newPosition(parrafo.asParagraph().editAsText(), 0);
        doc.setCursor(posicion);
        
        // Navegación completada - feedback visual (cursor movido)
      }
    }
  } catch (error) {
    console.error('Error en navegarAEscena:', error);
    DocumentApp.getUi().alert('Error al navegar: ' + error.message);
  }
}

/**
 * Obtiene el índice de escenas en formato JSON para el sidebar.
 * 
 * @return {string} JSON con el array de escenas
 */
function obtenerIndiceEscenasJSON() {
  const escenas = obtenerIndiceEscenas();
  return JSON.stringify(escenas);
}

// ============================================================================
// ESTADÍSTICAS Y ANÁLISIS
// ============================================================================

/**
 * Calcula estadísticas del guion (páginas, escenas, diálogos, etc.).
 * 
 * @return {Object} Objeto con estadísticas del documento
 */
function calcularEstadisticasGuion() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  
  const stats = {
    escenas: 0,
    personajes: new Set(),
    localizaciones: new Set(),
    dialogos: 0,
    palabrasDialogo: 0,
    palabrasAccion: 0,
    transiciones: 0,
    notasAutor: 0
  };
  
  try {
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const tipo = detectarTipoBloque(parrafo);
        const texto = parrafo.getText().trim();
        
        if (!texto) continue;
        
        switch (tipo) {
          case 'ESCENA':
            stats.escenas++;
            // Extraer localización
            const locMatch = texto.match(/(?:INT\.|EXT\.|INT-EXT|INT\/EXT)\s+([^-–]+)/i);
            if (locMatch && locMatch[1]) {
              stats.localizaciones.add(locMatch[1].trim().toUpperCase());
            }
            break;
            
          case 'PERSONAJE':
            const nombrePersonaje = texto.split('(')[0].trim(); // Quitar extensiones
            stats.personajes.add(nombrePersonaje);
            break;
            
          case 'DIALOGO':
            stats.dialogos++;
            stats.palabrasDialogo += contarPalabras(texto);
            break;
            
          case 'ACCION':
            stats.palabrasAccion += contarPalabras(texto);
            break;
            
          case 'TRANSICION':
            stats.transiciones++;
            break;
            
          case 'NOTA':
            stats.notasAutor++;
            break;
        }
      }
    }
    
    // Convertir Sets a Arrays
    stats.personajes = Array.from(stats.personajes);
    stats.localizaciones = Array.from(stats.localizaciones);
    
    // Calcular estimación de páginas (aproximado)
    // Regla general: ~55 líneas por página en formato guion
    const numParrafos = numChildren;
    stats.paginasEstimadas = Math.ceil(numParrafos / 55);
    
    return stats;
    
  } catch (error) {
    console.error('Error en calcularEstadisticasGuion:', error);
    return stats;
  }
}

/**
 * Cuenta palabras en un texto.
 * 
 * @param {string} texto - Texto a analizar
 * @return {number} Número de palabras
 */
function contarPalabras(texto) {
  if (!texto) return 0;
  const palabras = texto.trim().split(/\s+/);
  return palabras.filter(p => p.length > 0).length;
}

/**
 * Muestra las estadísticas del guion en un diálogo.
 */
function mostrarEstadisticasGuion() {
  const stats = calcularEstadisticasGuion();
  const ui = DocumentApp.getUi();
  
  const mensaje = 
    'ESTADISTICAS DEL GUION\n\n' +
    'Paginas estimadas: ' + stats.paginasEstimadas + '\n' +
    'Escenas: ' + stats.escenas + '\n' +
    'Personajes: ' + stats.personajes.length + '\n' +
    'Localizaciones: ' + stats.localizaciones.length + '\n' +
    'Dialogos: ' + stats.dialogos + '\n' +
    'Palabras en dialogo: ' + stats.palabrasDialogo + '\n' +
    'Palabras en accion: ' + stats.palabrasAccion + '\n' +
    'Transiciones: ' + stats.transiciones + '\n' +
    'Notas del autor: ' + stats.notasAutor + '\n\n' +
    'Personajes principales:\n' +
    stats.personajes.slice(0, 10).join(', ');
  
  ui.alert('Estadisticas del Guion', mensaje, ui.ButtonSet.OK);
}
