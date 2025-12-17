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
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  let contador = 0;
  const numChildren = body.getNumChildren();
  
  for (let i = 0; i < numChildren; i++) {
    if (body.getChild(i).getType() === DocumentApp.ElementType.PARAGRAPH) {
      contador++;
    }
  }
  
  return contador;
}

// ============================================================================
// UTILIDADES DE EXPORTACIÓN
// ============================================================================

/**
 * Prepara el documento para exportación a PDF.
 * Asegura que todos los formatos estén correctos.
 */
function prepararParaPDF() {
  const ui = DocumentApp.getUi();
  
  const respuesta = ui.alert(
    'Preparar para PDF',
    '¿Deseas verificar y corregir el formato antes de exportar a PDF?\n\n' +
    'Esto aplicará los estilos correctos y renumerará las escenas.',
    ui.ButtonSet.YES_NO
  );
  
  if (respuesta !== ui.Button.YES) {
    return;
  }
  
  try {
    // Renumerar escenas
    renumerarTodasLasEscenas();
    
    // Limpiar formato
    limpiarFormatoRoto();
    
    ui.alert(
      'Documento preparado',
      'El documento está listo para exportar a PDF.\n\n' +
      'Ve a: Archivo > Descargar > Documento PDF (.pdf)',
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    ui.alert('Error al preparar documento: ' + error.message);
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
