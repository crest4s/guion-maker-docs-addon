/**
 * UTILIDADES.GS - Funciones Auxiliares
 * 
 * Funciones de utilidad general que soportan el resto del sistema.
 */

// ============================================================================
// UTILIDADES DE TEXTO
// ============================================================================

/**
 * Normaliza espacios en blanco en un texto.
 * 
 * @param {string} texto - Texto a normalizar
 * @return {string} Texto normalizado
 */
function normalizarEspacios(texto) {
  if (!texto) return '';
  
  // Reemplazar múltiples espacios por uno solo
  texto = texto.replace(/\s+/g, ' ');
  
  // Quitar espacios al inicio y final
  texto = texto.trim();
  
  return texto;
}

/**
 * Capitaliza la primera letra de cada palabra.
 * 
 * @param {string} texto - Texto a capitalizar
 * @return {string} Texto capitalizado
 */
function capitalizarPalabras(texto) {
  if (!texto) return '';
  
  return texto.toLowerCase().replace(/\b\w/g, function(letra) {
    return letra.toUpperCase();
  });
}

/**
 * Convierte texto a mayúsculas de forma segura.
 * 
 * @param {string} texto - Texto a convertir
 * @return {string} Texto en mayúsculas
 */
function aMayusculas(texto) {
  if (!texto) return '';
  return texto.toUpperCase();
}

// ============================================================================
// UTILIDADES DE DOCUMENTO
// ============================================================================

/**
 * Obtiene el párrafo en la posición del cursor.
 * 
 * @return {Paragraph|null} Párrafo actual o null
 */
function obtenerParrafoActual() {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  
  if (!cursor) return null;
  
  try {
    const elemento = cursor.getElement();
    
    if (elemento.getType() === DocumentApp.ElementType.PARAGRAPH) {
      return elemento.asParagraph();
    } else if (elemento.getType() === DocumentApp.ElementType.TEXT) {
      const parent = elemento.getParent();
      if (parent.getType() === DocumentApp.ElementType.PARAGRAPH) {
        return parent.asParagraph();
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error en obtenerParrafoActual:', error);
    return null;
  }
}

/**
 * Obtiene el índice del párrafo en la posición del cursor.
 * 
 * @return {number} Índice del párrafo o -1
 */
function obtenerIndicePararrafoActual() {
  const parrafo = obtenerParrafoActual();
  if (!parrafo) return -1;
  
  try {
    const body = DocumentApp.getActiveDocument().getBody();
    return body.getChildIndex(parrafo);
  } catch (error) {
    console.error('Error en obtenerIndicePararrafoActual:', error);
    return -1;
  }
}

/**
 * Cuenta el número total de párrafos en el documento.
 * 
 * @return {number} Número de párrafos
 */
function contarParrafos() {
  return DocumentApp.getActiveDocument().getBody().getParagraphs().length;
}

// ============================================================================
// UTILIDADES DE EXPORTACIÓN
// ============================================================================

/**
 * Prepara el documento para exportación a PDF.
 * Asegura que todos los formatos estén correctos.
 */
function prepararParaPDF() {
  try {
    // Renumerar escenas
    renumerarTodasLasEscenas();
    
    // Limpiar formato
    limpiarFormatoRoto();
    
    // Preparación completada - sin mensaje
    
  } catch (error) {
    console.error('Error al preparar documento:', error);
    DocumentApp.getUi().alert('Error al preparar documento: ' + error.message);
  }
}

/**
 * Genera una versión de texto plano del guion en formato Fountain.
 * Fountain es un formato de markup para guiones que es legible como texto plano.
 * 
 * @return {string} Texto del guion en formato Fountain
 */
function exportarAFountain() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  
  let fountain = '';
  let lineaAnterior = '';
  
  try {
    // Añadir cabecera Fountain
    fountain += 'Title: ' + doc.getName() + '\n';
    fountain += 'Author: \n';
    fountain += 'Draft date: ' + Utilities.formatDate(new Date(), 
      Session.getScriptTimeZone(), 'dd/MM/yyyy') + '\n';
    fountain += '\n';
    
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const parrafo = child.asParagraph();
        const tipo = detectarTipoBloque(parrafo);
        const texto = parrafo.getText().trim();
        
        if (!texto) {
          fountain += '\n';
          lineaAnterior = '';
          continue;
        }
        
        switch (tipo) {
          case 'ESCENA':
            // En Fountain, las escenas empiezan con INT. o EXT.
            fountain += '\n' + texto + '\n\n';
            lineaAnterior = 'ESCENA';
            break;
            
          case 'ACCION':
            fountain += texto + '\n\n';
            lineaAnterior = 'ACCION';
            break;
            
          case 'PERSONAJE':
            // En Fountain, los personajes están en mayúsculas
            fountain += texto + '\n';
            lineaAnterior = 'PERSONAJE';
            break;
            
          case 'DIALOGO':
            fountain += texto + '\n';
            lineaAnterior = 'DIALOGO';
            break;
            
          case 'PARENTETICO':
            // Los parentéticos ya están entre paréntesis
            fountain += texto + '\n';
            lineaAnterior = 'PARENTETICO';
            break;
            
          case 'TRANSICION':
            // Las transiciones en Fountain necesitan '>' al inicio o 'TO:' al final
            fountain += '\n' + texto + '\n\n';
            lineaAnterior = 'TRANSICION';
            break;
            
          case 'NOTA':
            // Notas en Fountain: [[ nota ]]
            fountain += '[[' + texto + ']]\n\n';
            lineaAnterior = 'NOTA';
            break;
            
          case 'ACTO':
            fountain += '\n= ' + texto + ' =\n\n';
            lineaAnterior = 'ACTO';
            break;
        }
      }
    }
    
    return fountain;
    
  } catch (error) {
    console.error('Error en exportarAFountain:', error);
    return 'Error al generar Fountain: ' + error.message;
  }
}

/**
 * Muestra el código Fountain en un diálogo para copiar.
 */
function mostrarExportacionFountain() {
  const fountain = exportarAFountain();
  const ui = DocumentApp.getUi();
  
  const html = HtmlService.createHtmlOutput(
    '<html><body>' +
    '<h3>Exportación a Fountain</h3>' +
    '<p>Copia el contenido a continuación:</p>' +
    '<textarea style="width:100%;height:400px;font-family:monospace;font-size:12px;">' +
    fountain +
    '</textarea>' +
    '<p><small>Fountain es un formato de texto plano para guiones. ' +
    'Puedes usar este texto en aplicaciones como Highland 2, Fade In, etc.</small></p>' +
    '</body></html>'
  )
    .setWidth(600)
    .setHeight(550);
  
  ui.showModalDialog(html, 'Exportar a Fountain');
}

// ============================================================================
// UTILIDADES DE PROPIEDADES
// ============================================================================

/**
 * Guarda una preferencia del usuario.
 * 
 * @param {string} clave - Clave de la preferencia
 * @param {string} valor - Valor a guardar
 */
function guardarPreferencia(clave, valor) {
  try {
    const propiedades = PropertiesService.getDocumentProperties();
    propiedades.setProperty('PREF_' + clave, valor);
  } catch (error) {
    console.error('Error al guardar preferencia:', error);
  }
}

/**
 * Obtiene una preferencia del usuario.
 * 
 * @param {string} clave - Clave de la preferencia
 * @param {string} valorPorDefecto - Valor por defecto si no existe
 * @return {string} Valor de la preferencia
 */
function obtenerPreferencia(clave, valorPorDefecto) {
  try {
    const propiedades = PropertiesService.getDocumentProperties();
    const valor = propiedades.getProperty('PREF_' + clave);
    return valor !== null ? valor : valorPorDefecto;
  } catch (error) {
    console.error('Error al obtener preferencia:', error);
    return valorPorDefecto;
  }
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
// UTILIDADES DE DEBUG
// ============================================================================

/**
 * Registra información de debug en la consola.
 * 
 * @param {string} mensaje - Mensaje a registrar
 * @param {*} datos - Datos adicionales (opcional)
 */
function debug(mensaje, datos) {
  if (typeof datos !== 'undefined') {
    console.log('[GUION PRO] ' + mensaje, datos);
  } else {
    console.log('[GUION PRO] ' + mensaje);
  }
}

/**
 * Muestra información de diagnóstico del documento.
 */
function mostrarDiagnostico() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const stats = calcularEstadisticasGuion();
  const numParrafos = contarParrafos();
  
  const info = 
    'DIAGNÓSTICO DEL DOCUMENTO\n\n' +
    'Nombre: ' + doc.getName() + '\n' +
    'ID: ' + doc.getId() + '\n' +
    'Párrafos totales: ' + numParrafos + '\n' +
    'Escenas: ' + stats.escenas + '\n' +
    'Personajes: ' + stats.personajes.length + '\n' +
    'Configurado: ' + (PropertiesService.getDocumentProperties()
      .getProperty('GUION_CONFIGURADO') || 'No') + '\n\n' +
    'Márgenes:\n' +
    '  Superior: ' + body.getMarginTop() + 'pt\n' +
    '  Inferior: ' + body.getMarginBottom() + 'pt\n' +
    '  Izquierdo: ' + body.getMarginLeft() + 'pt\n' +
    '  Derecho: ' + body.getMarginRight() + 'pt';
  
  DocumentApp.getUi().alert('Diagnóstico', info, DocumentApp.getUi().ButtonSet.OK);
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

/**
 * Obtiene lista de personajes en formato JSON para el sidebar.
 * @return {string} JSON con array de nombres de personajes
 */
function obtenerPersonajesJSON() {
  try {
    var personajes = new Set();
    var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs();
    
    for (var i = 0; i < paragraphs.length; i++) {
      var indent = paragraphs[i].getIndentStart();
      
      // Detectar personajes por indentación (144pt)
      if (Math.abs(indent - 144) <= 2) {
        var texto = paragraphs[i].getText();
        if (texto) {
          // Limpiar (CONT'D) y paréntesis
          var nombre = texto.trim().replace(/\s*\([^)]*\).*$/, '');
          if (nombre.length >= 2 && nombre.length <= 35) {
            personajes.add(nombre);
          }
        }
      }
    }
    
    return JSON.stringify(Array.from(personajes).sort());
    
  } catch (error) {
    console.error('Error en obtenerPersonajesJSON:', error);
    return JSON.stringify([]);
  }
}

/**
 * Inserta nombre de personaje en la posición del cursor.
 * @param {string} nombre - Nombre del personaje
 */
function insertarNombrePersonaje(nombre) {
  try {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    if (!cursor) return;
    
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    
    if (element) {
      var para = element.asParagraph();
      para.setText(nombre);
      applyFormat('CHARACTER');
      doc.setCursor(doc.newPosition(para.getChild(0).asText(), nombre.length));
    }
  } catch (error) {
    console.error('Error en insertarNombrePersonaje:', error);
    DocumentApp.getUi().alert('Error al insertar personaje: ' + error.message);
  }
}

/**
 * Obtiene lista de localizaciones en formato JSON para el sidebar.
 * @return {string} JSON con array de localizaciones
 */
function obtenerLocalizacionesJSON() {
  try {
    var localizaciones = new Set();
    var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs();
    var regex = /^(INT\.|EXT\.|INT\.\/EXT\.)\s+(.+?)\s+-/i;
    
    for (var i = 0; i < paragraphs.length; i++) {
      var texto = paragraphs[i].getText();
      if (texto) {
        var match = texto.match(regex);
        if (match && match[2]) {
          var loc = match[2].trim().replace(/\s*\(\d+\)\s*$/, '');
          if (loc) localizaciones.add(loc);
        }
      }
    }
    
    return JSON.stringify(Array.from(localizaciones).sort());
    
  } catch (error) {
    console.error('Error en obtenerLocalizacionesJSON:', error);
    return JSON.stringify([]);
  }
}

/**
 * Inserta un encabezado de escena con plantilla.
 * @param {string} localizacion - Nombre de la localización
 * @param {string} tipo - Tipo de escena (INT. o EXT.)
 * @param {string} tiempo - Tiempo (DÍA, NOCHE, etc.)
 */
function insertarEscenaConLocalizacion(localizacion, tipo, tiempo) {
  try {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    if (!cursor) return;
    
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    
    if (element) {
      var para = element.asParagraph();
      var textoEscena = tipo + ' ' + localizacion + ' - ' + tiempo;
      para.setText(textoEscena);
      applyFormat('SCENE_HEADING');
      doc.setCursor(doc.newPosition(para.getChild(0).asText(), textoEscena.length));
    }
  } catch (error) {
    console.error('Error en insertarEscenaConLocalizacion:', error);
    DocumentApp.getUi().alert('Error al insertar escena: ' + error.message);
  }
}

/**
 * Inserta un bloque nuevo formateado en la posición actual.
 * @param {string} tipo - Tipo de bloque (TRANSICION, etc.)
 * @param {string} texto - Texto del bloque
 */
function insertarBloqueNuevo(tipo, texto) {
  try {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    if (!cursor) return;
    
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    
    if (element) {
      var para = element.asParagraph();
      para.setText(texto);
      applyFormat(tipo === 'TRANSICION' ? 'TRANSITION' : tipo);
      doc.setCursor(doc.newPosition(para.getChild(0).asText(), texto.length));
    }
  } catch (error) {
    console.error('Error en insertarBloqueNuevo:', error);
    DocumentApp.getUi().alert('Error al insertar bloque: ' + error.message);
  }
}

/**
 * Muestra diálogo con estadísticas del guion.
 */
function mostrarEstadisticasGuion() {
  try {
    var stats = calcularEstadisticasGuion();
    
    var mensaje = 'ESTADÍSTICAS DEL GUION\n\n';
    mensaje += 'Escenas: ' + stats.escenas + '\n';
    mensaje += 'Personajes únicos: ' + stats.personajes.size + '\n';
    mensaje += 'Localizaciones: ' + stats.localizaciones.size + '\n';
    mensaje += 'Bloques de diálogo: ' + stats.dialogos + '\n';
    mensaje += 'Palabras en diálogo: ' + stats.palabrasDialogo + '\n';
    mensaje += 'Palabras en acción: ' + stats.palabrasAccion + '\n';
    mensaje += 'Transiciones: ' + stats.transiciones + '\n\n';
    
    if (stats.personajes.size > 0) {
      mensaje += 'PERSONAJES:\n';
      var personajesArray = Array.from(stats.personajes).sort();
      personajesArray.forEach(function(p) {
        mensaje += '  • ' + p + '\n';
      });
    }
    
    DocumentApp.getUi().alert('Estadísticas', mensaje, DocumentApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    console.error('Error en mostrarEstadisticasGuion:', error);
    DocumentApp.getUi().alert('Error al calcular estadísticas: ' + error.message);
  }
}
