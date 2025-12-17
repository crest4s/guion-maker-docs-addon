/**
 * SISTEMA DE FORMATEO
 * Funciones para aplicar formatos de guion cinematografico
 */

var PATTERNS = {
  sceneHeading: /^(INT\.|EXT\.|INT\.\/EXT\.|I\/E|INT\/EXT|INTERIOR|EXTERIOR)/i,
  transition: /^(CUT TO:|FADE IN:|FADE OUT:|FADE TO:|DISSOLVE TO:|MATCH CUT TO:|JUMP CUT TO:|SMASH CUT TO:)/i,
  centered: /^>\s*(.+)\s*<$/,
  character: /^[A-Z][A-Z\s\.\'\-]+(\s*\([A-Z\.\']+\))?$/,
  parenthetical: /^\(.+\)$/,
  dualDialogue: /\^$/
};

/**
 * Aplica formato de encabezado de escena (Scene Heading)
 */
function applySceneHeading() {
  applyFormat('SCENE_HEADING');
}

/**
 * Aplica formato de accion (Action)
 */
function applyAction() {
  applyFormat('ACTION');
}

/**
 * Aplica formato de personaje (Character)
 */
function applyCharacter() {
  applyFormat('CHARACTER');
}

/**
 * Aplica formato de dialogo (Dialogue)
 */
function applyDialogue() {
  applyFormat('DIALOGUE');
}

/**
 * Aplica formato parentetico (Parenthetical)
 */
function applyParenthetical() {
  applyFormat('PARENTHETICAL');
}

/**
 * Aplica formato de transicion (Transition)
 */
function applyTransition() {
  applyFormat('TRANSITION');
}

/**
 * Aplica formato de Act Break
 */
function applyActBreak() {
  applyFormat('ACT_BREAK');
}

/**
 * Aplica formato de Plano (Shot)
 */
function applyShot() {
  applyFormat('SHOT');
}

/**
 * Funcion generica para aplicar formato segun configuracion
 * MEJORADA PARA MOVER PALABRAS VISUALMENTE SI O SI
 * @param {string} formatType - Tipo de formato a aplicar
 */
function applyFormat(formatType) {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  // Obtener el parrafo desde seleccion o cursor
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      // Buscar el parrafo padre
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    // Buscar el parrafo padre
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (!paragraph || paragraph.getType() !== DocumentApp.ElementType.PARAGRAPH) {
    DocumentApp.getUi().alert('Coloca el cursor en un parrafo para aplicar formato.');
    return;
  }
  
  var config = FORMAT_CONFIG[formatType];
  var para = paragraph.asParagraph();
  
  // TECNICA AGRESIVA: Reset total y re-aplicacion multiple
  var originalText = para.getText();
  
  // PASO 1: RESET ABSOLUTO de todas las propiedades
  para.setIndentStart(0);
  para.setIndentEnd(0);
  para.setIndentFirstLine(0);
  para.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  para.setLineSpacing(1.0);
  para.setSpacingBefore(0);
  para.setSpacingAfter(0);
  
  var textElement = para.editAsText();
  textElement.setFontFamily(FONT.family);
  textElement.setFontSize(FONT.size);
  textElement.setBold(false);
  textElement.setItalic(false);
  textElement.setUnderline(false);
  textElement.setBackgroundColor(null);
  
  // PASO 2: Aplicar indentaciones (forzar evaluacion numerica)
  var leftIndent = Number(config.indentStart) || 0;
  var rightIndent = Number(config.indentEnd) || 0;
  
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  
  // PASO 3: Aplicar espaciado
  para.setSpacingBefore(Number(config.spaceBefore) || 0);
  para.setSpacingAfter(Number(config.spaceAfter) || 0);
  
  // PASO 4: Aplicar alineacion
  if (config.alignment) {
    para.setAlignment(config.alignment);
  }
  
  // PASO 5: Aplicar mayusculas ANTES de re-aplicar fuente
  if (config.uppercase) {
    para.setText(originalText.toUpperCase());
  }
  
  // PASO 6: Re-aplicar fuente completa DESPUES de setText
  textElement = para.editAsText();
  textElement.setFontFamily(FONT.family);
  textElement.setFontSize(FONT.size);
  textElement.setBold(false);
  textElement.setItalic(false);
  textElement.setUnderline(false);
  
  // PASO 7: HACK - Re-aplicar indentacion para forzar Google Docs a recalcular
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
}

/**
 * Detecta automaticamente el tipo de bloque y aplica el formato correspondiente
 */
function applySmartFormat() {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  // Obtener el parrafo desde seleccion o cursor
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      // Buscar el parrafo padre
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    // Buscar el parrafo padre
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (!paragraph || paragraph.getType() !== DocumentApp.ElementType.PARAGRAPH) {
    DocumentApp.getUi().alert('Coloca el cursor en un parrafo para aplicar formateo inteligente.');
    return;
  }
  
  var text = paragraph.asParagraph().getText().trim();
  
  if (!text) {
    return;
  }
  
  var formatType;
  
  // Reglas de deteccion (orden de prioridad)
  if (PATTERNS.sceneHeading.test(text)) {
    formatType = 'SCENE_HEADING';
  } else if (PATTERNS.transition.test(text) || (/:$/.test(text) && text.length < 30)) {
    formatType = 'TRANSITION';
  } else if (PATTERNS.parenthetical.test(text)) {
    formatType = 'PARENTHETICAL';
  } else if (text === text.toUpperCase() && 
             text.length >= 2 && 
             text.length <= 35 && 
             PATTERNS.character.test(text)) {
    formatType = 'CHARACTER';
  } else if (/^(CLOSE ON|CLOSE UP|CLOSEUP|WIDE SHOT|ANGLE ON|POV|INSERT|MONTAGE|SERIES OF SHOTS)/i.test(text)) {
    formatType = 'SHOT';
  } else if (PATTERNS.centered.test(text)) {
    formatType = 'ACTION';
    text = text.replace(/^>\s*(.+)\s*<$/, '$1');
    paragraph.asParagraph().setText(text);
  } else {
    formatType = 'ACTION';
  }
  
  var config = FORMAT_CONFIG[formatType];
  var para = paragraph.asParagraph();
  
  // TECNICA AGRESIVA: Reset total y re-aplicacion multiple
  var originalText = para.getText();
  
  // PASO 1: RESET ABSOLUTO
  para.setIndentStart(0);
  para.setIndentEnd(0);
  para.setIndentFirstLine(0);
  para.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  para.setLineSpacing(1.0);
  para.setSpacingBefore(0);
  para.setSpacingAfter(0);
  
  var textElement = para.editAsText();
  textElement.setFontFamily(FONT.family);
  textElement.setFontSize(FONT.size);
  textElement.setBold(false);
  textElement.setItalic(false);
  textElement.setUnderline(false);
  textElement.setBackgroundColor(null);
  
  // PASO 2: Aplicar indentaciones
  var leftIndent = Number(config.indentStart) || 0;
  var rightIndent = Number(config.indentEnd) || 0;
  
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  
  // PASO 3: Aplicar espaciado
  para.setSpacingBefore(Number(config.spaceBefore) || 0);
  para.setSpacingAfter(Number(config.spaceAfter) || 0);
  
  // PASO 4: Aplicar alineacion
  if (config.alignment) {
    para.setAlignment(config.alignment);
  }
  
  // PASO 5: Aplicar mayusculas
  if (config.uppercase) {
    para.setText(text.toUpperCase());
  }
  
  // PASO 6: Re-aplicar fuente
  textElement = para.editAsText();
  textElement.setFontFamily(FONT.family);
  textElement.setFontSize(FONT.size);
  textElement.setBold(false);
  
  // PASO 7: HACK - Re-aplicar indentacion multiple
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
}

/**
 * Renumera todas las escenas del documento
 */
function renumberScenes() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var paragraphs = body.getParagraphs();
  var sceneNumber = 1;
  
  for (var i = 0; i < paragraphs.length; i++) {
    var para = paragraphs[i];
    var text = para.getText().trim();
    
    if (isSceneHeading(para)) {
      text = removeSceneNumber(text);
      var numberedText = text + ' (' + sceneNumber + ')';
      para.setText(numberedText.toUpperCase());
      
      var config = FORMAT_CONFIG.SCENE_HEADING;
      para.setIndentStart(config.indentStart);
      para.setIndentEnd(config.indentEnd);
      para.setSpacingBefore(config.spaceBefore);
      para.setSpacingAfter(config.spaceAfter);
      para.setLineSpacing(1.0);
      para.editAsText().setFontFamily(FONT.family);
      para.editAsText().setFontSize(FONT.size);
      para.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      
      sceneNumber++;
    }
  }
  
  DocumentApp.getUi().alert('Escenas renumeradas: ' + (sceneNumber - 1) + ' escenas encontradas.');
}
