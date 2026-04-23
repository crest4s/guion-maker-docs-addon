/**
 * GUION MAKER - LÓGICA DE NEGOCIO
 * Toda la lógica dura de manipulación de texto, formateo y análisis
 * 
 * @file Logic.gs
 * @description Funciones puras de negocio sin dependencias de UI
 * @restrictions Solo usa DocumentApp.getActiveDocument() (no DriveApp)
 */

// ============================================================================
// CONFIGURACIÓN DE FORMATOS
// ============================================================================

var FORMAT_CONFIG = {
  SCENE_HEADING: {
    indentStart: 0,
    indentEnd: 0,
    spaceBefore: 12,
    spaceAfter: 6,
    uppercase: true
  },
  ACTION: {
    indentStart: 0,
    indentEnd: 0,
    spaceBefore: 0,
    spaceAfter: 6,
    uppercase: false
  },
  CHARACTER: {
    indentStart: 144, // 2.0 in
    indentEnd: 0,
    spaceBefore: 6,
    spaceAfter: 0,
    uppercase: true
  },
  DIALOGUE: {
    indentStart: 108, // 1.5 in
    indentEnd: 72,    // 1.0 in
    spaceBefore: 0,
    spaceAfter: 6,
    uppercase: false
  },
  PARENTHETICAL: {
    indentStart: 126, // 1.75 in
    indentEnd: 90,    // 1.25 in
    spaceBefore: 0,
    spaceAfter: 0,
    uppercase: false
  },
  TRANSITION: {
    indentStart: 376, // ~5.2 in desde borde izquierdo
    indentEnd: 0,
    spaceBefore: 6,
    spaceAfter: 6,
    uppercase: true
  },
  ACT_BREAK: {
    indentStart: 0,
    indentEnd: 0,
    spaceBefore: 12,
    spaceAfter: 12,
    uppercase: true,
    alignment: DocumentApp.HorizontalAlignment.CENTER
  },
  SHOT: {
    indentStart: 0,
    indentEnd: 0,
    spaceBefore: 6,
    spaceAfter: 0,
    uppercase: true
  }
};

var FONT = {
  family: 'Courier New',
  size: 12
};

var PAGE_CONFIG = {
  width: 595,        // A4 210mm
  height: 842,       // A4 297mm
  marginTop: 72,     // 1.0 in
  marginBottom: 72,  // 1.0 in
  marginLeft: 108,   // 1.5 in
  marginRight: 72    // 1.0 in
};

var TRANSITION_MAP = {
  'CORTE A:': 'CUT TO:',
  'FUNDIDO A:': 'FADE TO:',
  'FUNDIDO A NEGRO:': 'FADE OUT:',
  'FUNDIDO DESDE NEGRO:': 'FADE IN:',
  'DISOLVENCIA A:': 'DISSOLVE TO:',
  'FUNDIDO:': 'FADE OUT:',
  'CORTE:': 'CUT TO:'
};

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Obtiene el párrafo en la posición del cursor.
 * 
 * @return {Paragraph|null} Párrafo actual o null
 */
function getParagraphAtCursor() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    var selection = doc.getSelection();
    
    if (selection) {
      var elements = selection.getRangeElements();
      if (elements.length > 0) {
        var element = elements[0].getElement();
        while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
          element = element.getParent();
        }
        return element ? element.asParagraph() : null;
      }
    }
    
    if (cursor) {
      var element = cursor.getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      return element ? element.asParagraph() : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error en getParagraphAtCursor:', error);
    return null;
  }
}

/**
 * Detecta el tipo de bloque de un párrafo según su formato.
 * 
 * @param {Paragraph} paragraph - Párrafo a analizar
 * @return {string|null} Tipo detectado (ESCENA, PERSONAJE, etc.)
 */
function detectBlockType(paragraph) {
  if (!paragraph) return null;
  
  try {
    var indent = paragraph.getIndentStart();
    var text = paragraph.getText().trim();
    
    // ESCENA - indent 0 y empieza con INT/EXT
    if (Math.abs(indent - 0) <= 2 && /^(INT\.|EXT\.|INT\.\/EXT\.)/i.test(text)) {
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
    
    // TRANSICION - indent 376pt
    if (Math.abs(indent - 376) <= 2) {
      return 'TRANSICION';
    }
    
    // ACT_BREAK - centrado
    if (paragraph.getAlignment() === DocumentApp.HorizontalAlignment.CENTER) {
      return 'ACTO';
    }
    
    // ACCION - por defecto
    return 'ACCION';
  } catch (error) {
    console.error('Error en detectBlockType:', error);
    return null;
  }
}

/**
 * Verifica si un párrafo es un encabezado de escena.
 * 
 * @param {Paragraph} paragraph - Párrafo a verificar
 * @return {boolean} true si es encabezado de escena
 */
function isSceneHeading(paragraph) {
  if (!paragraph) return false;
  
  try {
    var text = paragraph.getText().trim();
    var indent = paragraph.getIndentStart();
    return Math.abs(indent - 0) <= 2 && /^(INT\.|EXT\.|INT\.\/EXT\.)/i.test(text);
  } catch (error) {
    return false;
  }
}

// ============================================================================
// APLICACIÓN DE FORMATOS
// ============================================================================

/**
 * Aplica formato a un párrafo según el tipo especificado.
 * Función principal de formateo con reset completo.
 * 
 * @param {Paragraph} paragraph - Párrafo a formatear
 * @param {string} formatType - Tipo de formato (SCENE_HEADING, CHARACTER, etc.)
 */
function applyFormatToParagraph(paragraph, formatType) {
  if (!paragraph || !formatType) return;
  
  var config = FORMAT_CONFIG[formatType];
  if (!config) return;
  
  try {
    var originalText = paragraph.getText();
    
    // PASO 1: Reset absoluto de todas las propiedades
    paragraph.setIndentStart(0);
    paragraph.setIndentEnd(0);
    paragraph.setIndentFirstLine(0);
    paragraph.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
    paragraph.setLineSpacing(1.0);
    paragraph.setSpacingBefore(0);
    paragraph.setSpacingAfter(0);
    
    var textElement = paragraph.editAsText();
    textElement.setFontFamily(FONT.family);
    textElement.setFontSize(FONT.size);
    textElement.setBold(false);
    textElement.setItalic(false);
    textElement.setUnderline(false);
    textElement.setBackgroundColor(null);
    
    // PASO 2: Aplicar indentaciones
    var leftIndent = Number(config.indentStart) || 0;
    var rightIndent = Number(config.indentEnd) || 0;
    
    paragraph.setIndentStart(leftIndent);
    paragraph.setIndentEnd(rightIndent);
    paragraph.setIndentFirstLine(leftIndent);
    
    // PASO 3: Aplicar espaciado
    paragraph.setSpacingBefore(Number(config.spaceBefore) || 0);
    paragraph.setSpacingAfter(Number(config.spaceAfter) || 0);
    
    // PASO 4: Aplicar alineación
    if (config.alignment) {
      paragraph.setAlignment(config.alignment);
    }
    
    // PASO 5: Aplicar transformaciones de texto
    if (config.uppercase) {
      var finalText = originalText.toUpperCase();
      
      // Caso especial: CHARACTER - detectar CONT'D
      if (formatType === 'CHARACTER') {
        var upperText = originalText.toUpperCase().trim();
        var currentName = upperText.replace(/\s*\([^)]*\).*$/, '').trim();
        var previousChar = getPreviousCharacterName(paragraph);
        
        if (previousChar && currentName === previousChar.toUpperCase()) {
          if (!upperText.includes("CONT'D") && !upperText.includes('CONTD')) {
            finalText = currentName + " (CONT'D)";
          } else {
            finalText = upperText;
          }
        } else {
          finalText = currentName;
        }
      }
      
      // Caso especial: TRANSITION - convertir a inglés
      if (formatType === 'TRANSITION') {
        finalText = convertTransitionToEnglish(originalText);
      }
      
      paragraph.setText(finalText);
    }
    
    // PASO 6: Re-aplicar fuente después de setText
    textElement = paragraph.editAsText();
    textElement.setFontFamily(FONT.family);
    textElement.setFontSize(FONT.size);
    textElement.setBold(false);
    
    // PASO 7: Hack - Re-aplicar indentación para forzar recálculo
    paragraph.setIndentStart(leftIndent);
    paragraph.setIndentEnd(rightIndent);
    
  } catch (error) {
    console.error('Error en applyFormatToParagraph:', error);
    throw error;
  }
}

/**
 * Convierte transiciones de español a inglés.
 * 
 * @param {string} text - Texto de la transición
 * @return {string} Transición en inglés
 */
function convertTransitionToEnglish(text) {
  var upperText = text.toUpperCase().trim();
  
  for (var spanish in TRANSITION_MAP) {
    if (upperText === spanish || upperText.indexOf(spanish) === 0) {
      return TRANSITION_MAP[spanish];
    }
  }
  
  // Si no está en el mapa, devolver en mayúsculas
  var finalText = upperText;
  if (!finalText.endsWith(':')) {
    finalText += ':';
  }
  
  return finalText;
}

/**
 * Obtiene el nombre del personaje anterior en el documento.
 * 
 * @param {Paragraph} currentParagraph - Párrafo actual
 * @return {string|null} Nombre del personaje anterior o null
 */
function getPreviousCharacterName(currentParagraph) {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var currentIndex = body.getChildIndex(currentParagraph);
    
    if (currentIndex <= 0) return null;
    
    // Buscar hacia atrás el último personaje
    for (var i = currentIndex - 1; i >= 0; i--) {
      var child = body.getChild(i);
      
      if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
      
      var para = child.asParagraph();
      var indent = para.getIndentStart();
      
      // Si es un personaje (indent 144pt)
      if (Math.abs(indent - 144) <= 2) {
        var text = para.getText().trim();
        var cleanName = text.replace(/\s*\([^)]*\).*$/, '').trim();
        return cleanName;
      }
      
      // Si encontramos un encabezado de escena, detener búsqueda
      if (isSceneHeading(para)) {
        break;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error en getPreviousCharacterName:', error);
    return null;
  }
}

// ============================================================================
// CONFIGURACIÓN DE DOCUMENTO
// ============================================================================

/**
 * Configura el documento con los estándares de guión.
 */
function setupDocumentStandards() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    
    // Aplicar estilo base
    var style = {};
    style[DocumentApp.Attribute.FONT_FAMILY] = FONT.family;
    style[DocumentApp.Attribute.FONT_SIZE] = FONT.size;
    style[DocumentApp.Attribute.LINE_SPACING] = 1.0;
    body.setAttributes(style);
    
    // Establecer márgenes
    body.setMarginTop(PAGE_CONFIG.marginTop);
    body.setMarginBottom(PAGE_CONFIG.marginBottom);
    body.setMarginLeft(PAGE_CONFIG.marginLeft);
    body.setMarginRight(PAGE_CONFIG.marginRight);
    
    // Establecer tamaño de página
    body.setPageWidth(PAGE_CONFIG.width);
    body.setPageHeight(PAGE_CONFIG.height);

    // Re-aplicar indentaciones tras el cambio de márgenes
    recalculateAllIndentations();

  } catch (error) {
    console.error('Error en setupDocumentStandards:', error);
    throw error;
  }
}

/**
 * Re-aplica indentaciones correctas tras un cambio de márgenes.
 * En Google Docs los márgenes se suman a las indentaciones, causando desalineación.
 */
function recalculateAllIndentations() {
  var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs();

  for (var i = 0; i < paragraphs.length; i++) {
    var para       = paragraphs[i];
    var formatType = detectFormatTypeByIndentation(para.getIndentStart(), para.getIndentEnd());

    if (formatType) {
      var config = FORMAT_CONFIG[formatType];
      var left   = Number(config.indentStart) || 0;
      var right  = Number(config.indentEnd)   || 0;
      para.setIndentStart(0);
      para.setIndentEnd(0);
      para.setIndentFirstLine(0);
      para.setIndentStart(left);
      para.setIndentEnd(right);
      para.setIndentFirstLine(left);
    }
  }
}

/**
 * Detecta el tipo de formato por valores de indentación.
 *
 * @param {number} indentStart - Indentación izquierda en puntos
 * @param {number} indentEnd   - Indentación derecha en puntos
 * @return {string|null} Tipo de formato o null si no se reconoce
 */
function detectFormatTypeByIndentation(indentStart, indentEnd) {
  var t = 2;
  if (Math.abs(indentStart - 144) <= t && Math.abs(indentEnd)      <= t) return 'CHARACTER';
  if (Math.abs(indentStart - 108) <= t && Math.abs(indentEnd - 72) <= t) return 'DIALOGUE';
  if (Math.abs(indentStart - 126) <= t && Math.abs(indentEnd - 90) <= t) return 'PARENTHETICAL';
  if (Math.abs(indentStart - 376) <= t && Math.abs(indentEnd)      <= t) return 'TRANSITION';
  return null;
}

// ============================================================================
// NUMERACIÓN DE ESCENAS
// ============================================================================

/**
 * Renumera todas las escenas del documento secuencialmente.
 * 
 * @return {number} Cantidad de escenas renumeradas
 */
function renumberAllScenes() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var numChildren = body.getNumChildren();
    var sceneNumber = 1;
    var count = 0;
    
    for (var i = 0; i < numChildren; i++) {
      var child = body.getChild(i);
      
      if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
      
      var paragraph = child.asParagraph();
      
      if (isSceneHeading(paragraph)) {
        var text = paragraph.getText();
        
        // Quitar numeración anterior
        text = text.replace(/^\d+\.\s*/, '').replace(/\s*\(\d+\)\s*$/, '').trim();

        // Añadir nueva numeración
        var numberedText = sceneNumber + '. ' + text;
        paragraph.setText(numberedText);
        
        // Reaplicar estilo
        applyFormatToParagraph(paragraph, 'SCENE_HEADING');
        
        sceneNumber++;
        count++;
      }
    }
    
    return count;
  } catch (error) {
    console.error('Error en renumberAllScenes:', error);
    throw error;
  }
}

// ============================================================================
// EXTRACCIÓN DE PERSONAJES
// ============================================================================

/**
 * Extrae todos los personajes únicos del documento.
 * 
 * @return {Array<string>} Array de nombres de personajes
 */
function extractCharacters() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var numChildren = body.getNumChildren();
    var characters = new Set();
    
    for (var i = 0; i < numChildren; i++) {
      var child = body.getChild(i);
      
      if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
      
      var paragraph = child.asParagraph();
      var indent = paragraph.getIndentStart();
      
      // Detectar personajes por indentación (144pt)
      if (Math.abs(indent - 144) <= 2) {
        var text = paragraph.getText().trim();
        
        // Quitar extensiones (V.O.), (O.S.), (CONT'D)
        text = text.replace(/\s*\([^)]+\)\s*$/g, '').trim();
        
        if (text && text.length >= 2 && text.length <= 35) {
          characters.add(text);
        }
      }
    }
    
    return Array.from(characters).sort();
  } catch (error) {
    console.error('Error en extractCharacters:', error);
    return [];
  }
}

// ============================================================================
// PLANTILLAS
// ============================================================================

/**
 * Inserta una plantilla de portada en el documento.
 */
function insertTitlePageTemplate() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var cursor = doc.getCursor();
    
    var insertIndex = 0;
    if (cursor) {
      var element = cursor.getElement();
      while (element.getParent().getType() !== DocumentApp.ElementType.BODY_SECTION) {
        element = element.getParent();
      }
      insertIndex = body.getChildIndex(element);
    }
    
    // Insertar título
    var title = body.insertParagraph(insertIndex, 'TÍTULO DEL GUIÓN');
    title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    title.setSpacingBefore(200);
    title.setSpacingAfter(30);
    title.editAsText().setFontFamily(FONT.family).setFontSize(14).setBold(false);
    
    // Insertar "Escrito por"
    var author = body.insertParagraph(insertIndex + 1, 'Escrito por');
    author.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    author.setSpacingAfter(10);
    author.editAsText().setFontFamily(FONT.family).setFontSize(FONT.size).setBold(false);
    
    // Insertar nombre del autor
    var authorName = body.insertParagraph(insertIndex + 2, 'NOMBRE DEL AUTOR');
    authorName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    authorName.setSpacingAfter(200);
    authorName.editAsText().setFontFamily(FONT.family).setFontSize(FONT.size).setBold(false);
    
    // Insertar salto de página
    body.insertPageBreak(insertIndex + 3);
    
  } catch (error) {
    console.error('Error en insertTitlePageTemplate:', error);
    throw error;
  }
}

/**
 * Inserta una plantilla de escena estándar en el cursor.
 */
function insertSceneTemplateAtCursor() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var cursor = doc.getCursor();
    
    if (!cursor) {
      throw new Error('No se encontró cursor');
    }
    
    var element = cursor.getElement();
    while (element.getParent().getType() !== DocumentApp.ElementType.BODY_SECTION) {
      element = element.getParent();
    }
    var insertIndex = body.getChildIndex(element) + 1;
    
    // Scene Heading
    var scene = body.insertParagraph(insertIndex, 'INT. LOCALIZACIÓN - DÍA');
    applyFormatToParagraph(scene, 'SCENE_HEADING');
    
    // Action
    var action1 = body.insertParagraph(insertIndex + 1, 'Descripción de la acción inicial.');
    applyFormatToParagraph(action1, 'ACTION');
    
    // Character
    var character1 = body.insertParagraph(insertIndex + 2, 'PERSONAJE UNO');
    applyFormatToParagraph(character1, 'CHARACTER');
    
    // Dialogue
    var dialogue1 = body.insertParagraph(insertIndex + 3, 'Primer diálogo.');
    applyFormatToParagraph(dialogue1, 'DIALOGUE');
    
    // Action
    var action2 = body.insertParagraph(insertIndex + 4, 'Acción entre diálogos.');
    applyFormatToParagraph(action2, 'ACTION');
    
    // Character
    var character2 = body.insertParagraph(insertIndex + 5, 'PERSONAJE DOS');
    applyFormatToParagraph(character2, 'CHARACTER');
    
    // Parenthetical
    var paren = body.insertParagraph(insertIndex + 6, '(acción)');
    applyFormatToParagraph(paren, 'PARENTHETICAL');
    
    // Dialogue
    var dialogue2 = body.insertParagraph(insertIndex + 7, 'Respuesta del segundo personaje.');
    applyFormatToParagraph(dialogue2, 'DIALOGUE');
    
    // Blank line
    body.insertParagraph(insertIndex + 8, '');
    
  } catch (error) {
    console.error('Error en insertSceneTemplateAtCursor:', error);
    throw error;
  }
}

// ============================================================================
// HELPERS INTERNOS
// ============================================================================

/**
 * Crea una línea de diálogo vacía después de un párrafo de personaje,
 * a menos que la siguiente línea ya sea diálogo o parentético.
 *
 * @param {Document} doc - Documento activo
 * @param {Paragraph} charParagraph - Párrafo del personaje
 */
function createDialogueLineAfter(doc, charParagraph) {
  var body       = doc.getBody();
  var childIndex = body.getChildIndex(charParagraph);
  var nextIndex  = childIndex + 1;

  // Si el siguiente ya es diálogo (108pt) o parentético (126pt), solo mover cursor
  if (nextIndex < body.getNumChildren()) {
    var nextChild = body.getChild(nextIndex);
    if (nextChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var nextIndent = nextChild.asParagraph().getIndentStart();
      if (Math.abs(nextIndent - 108) <= 2 || Math.abs(nextIndent - 126) <= 2) {
        doc.setCursor(doc.newPosition(nextChild.asParagraph(), 0));
        return;
      }
    }
  }

  var config  = FORMAT_CONFIG.DIALOGUE;
  var newPara = body.insertParagraph(childIndex + 1, '');
  newPara.setIndentStart(Number(config.indentStart));
  newPara.setIndentEnd(Number(config.indentEnd));
  newPara.setIndentFirstLine(Number(config.indentStart));
  newPara.setSpacingBefore(Number(config.spaceBefore));
  newPara.setSpacingAfter(Number(config.spaceAfter));
  var te = newPara.editAsText();
  te.setFontFamily(FONT.family);
  te.setFontSize(FONT.size);
  te.setBold(false);
  doc.setCursor(doc.newPosition(newPara, 0));
}

// ============================================================================
// VALIDACIÓN Y LIMPIEZA
// ============================================================================

/**
 * Valida el formato del documento completo.
 * 
 * @return {Array<string>} Array de problemas encontrados
 */
function validateDocumentFormat() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var paragraphs = body.getParagraphs();
    var issues = [];
    
    for (var i = 0; i < paragraphs.length; i++) {
      var para = paragraphs[i];
      var text = para.getText().trim();
      
      if (!text) continue;
      
      var fontFamily = para.editAsText().getFontFamily(0);
      var fontSize = para.editAsText().getFontSize(0);
      
      if (fontFamily && fontFamily !== FONT.family && fontFamily !== 'Courier Prime') {
        issues.push('Linea ' + (i + 1) + ': Fuente incorrecta (' + fontFamily + ')');
      }
      
      if (fontSize && fontSize !== FONT.size) {
        issues.push('Linea ' + (i + 1) + ': Tamano incorrecto (' + fontSize + 'pt)');
      }
    }
    
    return issues;
  } catch (error) {
    console.error('Error en validateDocumentFormat:', error);
    return [];
  }
}

/**
 * Limpia formato no estándar del documento.
 * 
 * @return {number} Cantidad de párrafos limpiados
 */
function cleanDocumentFormat() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var paragraphs = body.getParagraphs();
    var cleaned = 0;
    
    for (var i = 0; i < paragraphs.length; i++) {
      var text = paragraphs[i].getText();
      if (!text || !text.trim()) continue;
      
      var textEl = paragraphs[i].editAsText();
      textEl.setFontFamily(FONT.family);
      textEl.setFontSize(FONT.size);
      textEl.setBackgroundColor(null);
      textEl.setUnderline(false);
      textEl.setItalic(false);
      
      cleaned++;
    }
    
    return cleaned;
  } catch (error) {
    console.error('Error en cleanDocumentFormat:', error);
    throw error;
  }
}

/**
 * Busca un personaje en el documento.
 * 
 * @param {string} searchName - Nombre del personaje a buscar
 * @return {Array<Object>} Array de objetos con index y text de cada aparición
 */
function searchCharacterInDocument(searchName) {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var numChildren = body.getNumChildren();
    var found = [];
    
    for (var i = 0; i < numChildren; i++) {
      var child = body.getChild(i);
      if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
      
      var para = child.asParagraph();
      var indent = para.getIndentStart();
      
      if (Math.abs(indent - 144) <= 2) {
        var text = para.getText().trim().toUpperCase();
        if (text.indexOf(searchName) === 0) {
          found.push({ index: i, text: text });
        }
      }
    }
    
    return found;
  } catch (error) {
    console.error('Error en searchCharacterInDocument:', error);
    return [];
  }
}
