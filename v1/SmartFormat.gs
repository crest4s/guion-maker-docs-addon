/**
 * SMARTFORMAT.GS - Formateo Inteligente
 * 
 * Detecta automáticamente el tipo de bloque basándose en el contenido
 * y aplica el formato correspondiente.
 */

// ============================================================================
// FORMATEO INTELIGENTE
// ============================================================================

/**
 * Aplica formateo inteligente a la selección o párrafo actual.
 * Analiza el contenido y determina automáticamente el tipo de bloque.
 */
function aplicarFormateoInteligente() {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();
  
  try {
    let parrafos = [];
    
    if (selection) {
      // Procesar selección
      const elementos = selection.getRangeElements();
      
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
    } else {
      // Procesar párrafo actual
      const cursor = doc.getCursor();
      if (cursor) {
        const elemento = cursor.getElement();
        let parrafo = null;
        
        if (elemento.getType() === DocumentApp.ElementType.PARAGRAPH) {
          parrafo = elemento.asParagraph();
        } else if (elemento.getType() === DocumentApp.ElementType.TEXT) {
          parrafo = elemento.getParent().asParagraph();
        }
        
        if (parrafo) {
          parrafos.push(parrafo);
        }
      }
    }
    
    // Aplicar formateo inteligente a cada párrafo
    let contadorFormateados = 0;
    
    for (let i = 0; i < parrafos.length; i++) {
      const tipoDetectado = detectarTipoBloquePorContenido(parrafos[i]);
      if (tipoDetectado) {
        aplicarEstiloAParrafo(parrafos[i], tipoDetectado);
        contadorFormateados++;
      }
    }
    
    if (contadorFormateados > 0) {
      // Feedback silencioso - el usuario verá el cambio en el documento
    } else {
      DocumentApp.getUi().alert('No se pudo determinar el tipo de bloque');
    }
    
  } catch (error) {
    console.error('Error en aplicarFormateoInteligente:', error);
    DocumentApp.getUi().alert('Error en formateo inteligente: ' + error.message);
  }
}

/**
 * Detecta el tipo de bloque analizando el contenido del párrafo.
 * 
 * @param {Paragraph} parrafo - Párrafo a analizar
 * @return {string|null} Tipo de bloque detectado
 */
function detectarTipoBloquePorContenido(parrafo) {
  if (!parrafo) return null;
  
  const texto = parrafo.getText().trim();
  if (!texto) return null;
  
  try {
    // 1. ESCENA: Empieza con INT., EXT., INT-EXT, INT/EXT
    if (/^(INT\.|EXT\.|INT-EXT|INT\/EXT)/i.test(texto)) {
      return 'ESCENA';
    }
    
    // 2. TRANSICIÓN: Termina con ":" y está en mayúsculas
    // Ejemplos: CORTE A:, DISOLVENCIA A:, FUNDIDO A NEGRO:
    if (texto.endsWith(':') && texto === texto.toUpperCase() && texto.length < 40) {
      const transicionesComunes = [
        'CORTE A:',
        'DISOLVENCIA A:',
        'FUNDIDO A:',
        'FUNDIDO A NEGRO:',
        'FADE TO:',
        'CUT TO:',
        'DISSOLVE TO:',
        'SMASH CUT TO:'
      ];
      
      for (let i = 0; i < transicionesComunes.length; i++) {
        if (texto.includes(transicionesComunes[i])) {
          return 'TRANSICION';
        }
      }
      
      // Cualquier texto corto en mayúsculas que termine en : se considera transición
      if (texto.length < 30) {
        return 'TRANSICION';
      }
    }
    
    // 3. PARENTÉTICO: Entre paréntesis
    if (texto.startsWith('(') && texto.endsWith(')')) {
      return 'PARENTETICO';
    }
    
    // 4. ACTO: Palabras clave de estructura
    const actosRegex = /^(ACTO|ACT|FIN DEL ACTO|END OF ACT|INICIO|TEASER|TAG)/i;
    if (actosRegex.test(texto) && texto.length < 50) {
      return 'ACTO';
    }
    
    // 5. PERSONAJE: Todo en mayúsculas, corto (< 40 caracteres), sin puntuación al final
    // y no es una escena ni transición
    if (texto === texto.toUpperCase() && 
        texto.length < 40 && 
        !texto.endsWith(':') &&
        !texto.endsWith('.') &&
        !/^(INT\.|EXT\.)/.test(texto)) {
      
      // Verificar que no contenga demasiadas palabras (máx 5)
      const palabras = texto.split(/\s+/);
      if (palabras.length <= 5) {
        return 'PERSONAJE';
      }
    }
    
    // 6. NOTA: Empieza con "NOTA:", "[", o contiene palabras clave
    if (/^(NOTA:|NOTE:|\[)/i.test(texto) || /\[.*\]/.test(texto)) {
      return 'NOTA';
    }
    
    // 7. DIÁLOGO vs ACCIÓN: Heurística compleja
    // Si el párrafo anterior es PERSONAJE o PARENTETICO, probablemente es DIÁLOGO
    const body = parrafo.getParent();
    const indiceParrafo = body.getChildIndex(parrafo);
    
    if (indiceParrafo > 0) {
      const parrafoAnterior = body.getChild(indiceParrafo - 1);
      if (parrafoAnterior.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const tipoAnterior = detectarTipoBloque(parrafoAnterior.asParagraph());
        
        if (tipoAnterior === 'PERSONAJE' || tipoAnterior === 'PARENTETICO') {
          return 'DIALOGO';
        }
      }
    }
    
    // 8. DEFAULT: ACCIÓN
    // La acción es el tipo por defecto para texto narrativo
    return 'ACCION';
    
  } catch (error) {
    console.error('Error en detectarTipoBloquePorContenido:', error);
    return 'ACCION'; // Fallback seguro
  }
}

/**
 * Formatea automáticamente todo el documento aplicando formateo inteligente.
 * Útil para convertir texto plano en guion formateado.
 */
function formatearDocumentoCompleto() {
  const doc = DocumentApp.getActiveDocument();
  const ui = DocumentApp.getUi();
  
  // Confirmar con el usuario
  const respuesta = ui.alert(
    'Formatear documento completo',
    '¿Deseas aplicar formateo inteligente a todo el documento?\n\n' +
    'Esta operación analizará cada párrafo y aplicará el formato apropiado.',
    ui.ButtonSet.YES_NO
  );
  
  if (respuesta !== ui.Button.YES) {
    return;
  }
  
  try {
    const body = doc.getBody();
    const numChildren = body.getNumChildren();
    let contadorFormateados = 0;
    
    // Procesar documento
    // ui.toast no está disponible, usamos alert al final
    
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const texto = parrafo.getText().trim();
        
        // Solo formatear párrafos con contenido
        if (texto) {
          const tipoDetectado = detectarTipoBloquePorContenido(parrafo);
          if (tipoDetectado) {
            aplicarEstiloAParrafo(parrafo, tipoDetectado);
            contadorFormateados++;
          }
        }
      }
    }
    
    ui.alert(
      'Formateo Inteligente',
      'Documento formateado: ' + contadorFormateados + ' párrafos',
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    console.error('Error en formatearDocumentoCompleto:', error);
    ui.alert('Error al formatear documento: ' + error.message);
  }
}

/**
 * Analiza el documento y genera un reporte de tipos de bloque detectados.
 * Útil para debugging y comprensión del contenido.
 * 
 * @return {Object} Estadísticas de tipos de bloque
 */
function analizarEstructuraDocumento() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  
  const estadisticas = {
    ESCENA: 0,
    ACCION: 0,
    PERSONAJE: 0,
    DIALOGO: 0,
    PARENTETICO: 0,
    TRANSICION: 0,
    NOTA: 0,
    ACTO: 0,
    VACIO: 0,
    TOTAL: numChildren
  };
  
  try {
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const texto = parrafo.getText().trim();
        
        if (!texto) {
          estadisticas.VACIO++;
          continue;
        }
        
        const tipo = detectarTipoBloquePorContenido(parrafo);
        if (tipo && estadisticas.hasOwnProperty(tipo)) {
          estadisticas[tipo]++;
        }
      }
    }
    
    return estadisticas;
    
  } catch (error) {
    console.error('Error en analizarEstructuraDocumento:', error);
    return estadisticas;
  }
}

/**
 * Muestra un diálogo con las estadísticas del documento.
 */
function mostrarEstadisticasDocumento() {
  const stats = analizarEstructuraDocumento();
  const ui = DocumentApp.getUi();
  
  const mensaje = 
    'ESTADÍSTICAS DEL DOCUMENTO\n\n' +
    'Escenas: ' + stats.ESCENA + '\n' +
    'Acción: ' + stats.ACCION + '\n' +
    'Personajes: ' + stats.PERSONAJE + '\n' +
    'Diálogos: ' + stats.DIALOGO + '\n' +
    'Parentéticos: ' + stats.PARENTETICO + '\n' +
    'Transiciones: ' + stats.TRANSICION + '\n' +
    'Notas: ' + stats.NOTA + '\n' +
    'Actos: ' + stats.ACTO + '\n' +
    'Párrafos vacíos: ' + stats.VACIO + '\n\n' +
    'Total de elementos: ' + stats.TOTAL;
  
  ui.alert('Análisis del Documento', mensaje, ui.ButtonSet.OK);
}
