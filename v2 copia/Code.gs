/**
 * PLANTILLA DE GUION CINEMATOGRAFICO - GOOGLE APPS SCRIPT
 * Sistema de formateo profesional tipo Final Draft para Google Docs
 * Version: 2.0
 */

// Importar configuraciones
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
    indentStart: 376, // 13.25 cm desde borde izquierdo
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
  width: 612,        // 8.5 in
  height: 792,       // 11 in
  marginTop: 72,     // 1.0 in
  marginBottom: 72,  // 1.0 in
  marginLeft: 108,   // 1.5 in
  marginRight: 72    // 1.0 in
};

/**
 * Crea el menu personalizado al abrir el documento
 */
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('Guion')
    .addSubMenu(ui.createMenu('Formato')
      .addItem('Encabezado de escena [Ctrl+Alt+1]', 'applySceneHeading')
      .addItem('Accion [Ctrl+Alt+2]', 'applyAction')
      .addItem('Personaje [Ctrl+Alt+3]', 'applyCharacter')
      .addItem('Dialogo [Ctrl+Alt+4]', 'applyDialogue')
      .addItem('Parentetico [Ctrl+Alt+5]', 'applyParenthetical')
      .addItem('Transicion [Ctrl+Alt+6]', 'applyTransition')
      .addItem('Act Break', 'applyActBreak')
      .addItem('Plano (Shot)', 'applyShot'))
    .addSeparator()
    .addItem('Renumerar escenas', 'renumberScenes')
    .addSeparator()
    .addSubMenu(ui.createMenu('Plantillas')
      .addItem('Insertar portada', 'insertTitlePage')
      .addItem('Insertar escena estandar', 'insertSceneTemplate'))
    .addSeparator()
    .addSubMenu(ui.createMenu('Herramientas')
      .addItem('Configurar documento', 'setupDocument')
      .addItem('Validar formato', 'validateFormat')
      .addItem('Limpiar formato', 'cleanFormat'))
    .addSubMenu(ui.createMenu('Personajes')
      .addItem('Lista de personajes', 'showCharacterList')
      .addItem('Contar dialogos por personaje', 'countDialoguesByCharacter')
      .addItem('Buscar personaje', 'searchCharacter'))
    .addSeparator()
    .addItem('Abrir panel lateral', 'openSidebar')
    .addItem('Atajos de teclado', 'showKeyboardShortcuts')
    .addToUi();
}

/**
 * Se ejecuta al instalar el complemento
 */
function onInstall() {
  onOpen();
}

/**
 * Abre el panel lateral con controles de formato
 */
function openSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Panel de Guion')
    .setWidth(300);
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Función auxiliar para incluir archivos HTML parciales
 * @param {string} filename - Nombre del archivo a incluir (sin extensión)
 * @return {string} - Contenido del archivo HTML
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Configura el documento con los ajustes estandar de guion
 */
function setupDocument() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  
  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = FONT.family;
  style[DocumentApp.Attribute.FONT_SIZE] = FONT.size;
  style[DocumentApp.Attribute.LINE_SPACING] = 1.0;
  body.setAttributes(style);
  
  // Establecer margenes del documento
  body.setMarginTop(PAGE_CONFIG.marginTop);
  body.setMarginBottom(PAGE_CONFIG.marginBottom);
  body.setMarginLeft(PAGE_CONFIG.marginLeft);
  body.setMarginRight(PAGE_CONFIG.marginRight);
  
  body.setPageWidth(PAGE_CONFIG.width);
  body.setPageHeight(PAGE_CONFIG.height);
  
  // CRITICO: Re-aplicar todas las indentaciones basadas en el nuevo margen
  recalculateAllIndentations();
  
  // Mensaje eliminado - configuración completada silenciosamente
}

/**
 * Valida el formato del documento completo
 */
function validateFormat() {
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
  
  if (issues.length === 0) {
    DocumentApp.getUi().alert('VALIDACIÓN COMPLETA\n\nNo se encontraron problemas de formato.');
  } else {
    var message = 'Se encontraron ' + issues.length + ' problema(s):\n\n';
    message += issues.slice(0, 10).join('\n');
    if (issues.length > 10) {
      message += '\n\n... y ' + (issues.length - 10) + ' mas.';
    }
    DocumentApp.getUi().alert(message);
  }
}

/**
 * Limpia formato no estandar del documento
 */
function cleanFormat() {
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
  
  // Formato limpiado - sin mensaje
}

/**
 * Obtiene lista de personajes para el sidebar
 */
function getCharactersForSidebar() {
  return getCharacterList();
}

/**
 * Inserta una plantilla de portada
 */
function insertTitlePage() {
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
  
  // Insertar titulo (SIN negrita)
  var title = body.insertParagraph(insertIndex, 'TITULO DEL GUION');
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  title.setSpacingBefore(200);
  title.setSpacingAfter(30);
  title.editAsText().setFontFamily(FONT.family).setFontSize(14).setBold(false);
  
  // Insertar autor
  var author = body.insertParagraph(insertIndex + 1, 'Escrito por');
  author.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  author.setSpacingAfter(10);
  author.editAsText().setFontFamily(FONT.family).setFontSize(FONT.size).setBold(false);
  
  var authorName = body.insertParagraph(insertIndex + 2, 'NOMBRE DEL AUTOR');
  authorName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  authorName.setSpacingAfter(200);
  authorName.editAsText().setFontFamily(FONT.family).setFontSize(FONT.size).setBold(false);
  
  // Insertar salto de pagina
  body.insertPageBreak(insertIndex + 3);
  
  // Portada insertada - sin mensaje
}

/**
 * Inserta una plantilla de escena estandar
 */
function insertSceneTemplate() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var cursor = doc.getCursor();
  
  if (!cursor) {
    return; // Sin cursor - operación cancelada silenciosamente
  }
  
  var element = cursor.getElement();
  while (element.getParent().getType() !== DocumentApp.ElementType.BODY_SECTION) {
    element = element.getParent();
  }
  var insertIndex = body.getChildIndex(element) + 1;
  
  // Scene Heading
  var scene = body.insertParagraph(insertIndex, 'INT. LOCACION - DIA');
  applyDirectFormat(scene, 'SCENE_HEADING');
  
  // Action (opening description)
  var action1 = body.insertParagraph(insertIndex + 1, 'Descripcion de la accion inicial. Establecimiento de la escena.');
  applyDirectFormat(action1, 'ACTION');
  
  // Character 1
  var character1 = body.insertParagraph(insertIndex + 2, 'PERSONAJE UNO');
  applyDirectFormat(character1, 'CHARACTER');
  
  // Dialogue 1
  var dialogue1 = body.insertParagraph(insertIndex + 3, 'Primer dialogo del personaje uno.');
  applyDirectFormat(dialogue1, 'DIALOGUE');
  
  // Action (beat/reaction)
  var action2 = body.insertParagraph(insertIndex + 4, 'Accion o reaccion entre dialogos.');
  applyDirectFormat(action2, 'ACTION');
  
  // Character 2
  var character2 = body.insertParagraph(insertIndex + 5, 'PERSONAJE DOS');
  applyDirectFormat(character2, 'CHARACTER');
  
  // Parenthetical
  var paren = body.insertParagraph(insertIndex + 6, '(parentetico)');
  applyDirectFormat(paren, 'PARENTHETICAL');
  
  // Dialogue 2
  var dialogue2 = body.insertParagraph(insertIndex + 7, 'Respuesta del personaje dos.');
  applyDirectFormat(dialogue2, 'DIALOGUE');
  
  // Action (closing)
  var action3 = body.insertParagraph(insertIndex + 8, 'Accion de cierre de la escena.');
  applyDirectFormat(action3, 'ACTION');
  
  // Blank line
  body.insertParagraph(insertIndex + 9, '');
  
  // Escena insertada - sin mensaje
}

/**
 * Muestra los atajos de teclado disponibles
 */
function showKeyboardShortcuts() {
  var message = 'ATAJOS DE TECLADO\n\n';
  message += 'FORMATO:\n';
  message += 'Ctrl+Alt+1 - Encabezado de escena\n';
  message += 'Ctrl+Alt+2 - Accion\n';
  message += 'Ctrl+Alt+3 - Personaje\n';
  message += 'Ctrl+Alt+4 - Dialogo\n';
  message += 'Ctrl+Alt+5 - Parentetico\n';
  message += 'Ctrl+Alt+6 - Transicion\n\n';
  message += 'NOTA: Los atajos deben configurarse\n';
  message += 'manualmente en Google Docs usando\n';
  message += 'Herramientas > Macros > Administrar macros';
  
  // Mensaje de atajos eliminado
}

/**
 * Recalcula TODAS las indentaciones del documento basadas en el margen actual
 * SOLUCION AL PROBLEMA: Cuando cambias el margen izquierdo, las indentaciones
 * se suman al nuevo margen, causando desalineacion. Esta funcion re-aplica
 * las indentaciones correctas desde la base del nuevo margen.
 */
function recalculateAllIndentations() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var paragraphs = body.getParagraphs();
  var recalculated = 0;
  
  for (var i = 0; i < paragraphs.length; i++) {
    var para = paragraphs[i];
    var currentIndentStart = para.getIndentStart();
    var currentIndentEnd = para.getIndentEnd();
    
    // Detectar el tipo de formato basado en la indentacion actual
    var formatType = detectFormatTypeByIndentation(currentIndentStart, currentIndentEnd);
    
    if (formatType) {
      var config = FORMAT_CONFIG[formatType];
      
      // PASO 1: Resetear la indentacion a 0
      para.setIndentStart(0);
      para.setIndentEnd(0);
      para.setIndentFirstLine(0);
      
      // PASO 2: Re-aplicar la indentacion correcta desde la base del margen
      para.setIndentStart(Number(config.indentStart) || 0);
      para.setIndentEnd(Number(config.indentEnd) || 0);
      
      // PASO 3: Forzar re-aplicacion (hack para Google Docs)
      para.setIndentStart(Number(config.indentStart) || 0);
      para.setIndentEnd(Number(config.indentEnd) || 0);
      
      recalculated++;
    }
  }
  
  return recalculated;
}

/**
 * Detecta el tipo de formato basado en los valores de indentacion
 * @param {number} indentStart - Indentacion izquierda
 * @param {number} indentEnd - Indentacion derecha
 * @return {string} - Tipo de formato detectado
 */
function detectFormatTypeByIndentation(indentStart, indentEnd) {
  // Tolerancia de +/- 2 puntos para deteccion
  var tolerance = 2;
  
  // CHARACTER: 144pt izquierda, 0pt derecha
  if (Math.abs(indentStart - 144) <= tolerance && Math.abs(indentEnd - 0) <= tolerance) {
    return 'CHARACTER';
  }
  
  // DIALOGUE: 108pt izquierda, 72pt derecha
  if (Math.abs(indentStart - 108) <= tolerance && Math.abs(indentEnd - 72) <= tolerance) {
    return 'DIALOGUE';
  }
  
  // PARENTHETICAL: 126pt izquierda, 90pt derecha
  if (Math.abs(indentStart - 126) <= tolerance && Math.abs(indentEnd - 90) <= tolerance) {
    return 'PARENTHETICAL';
  }
  
  // TRANSITION: 468pt izquierda, 0pt derecha
  if (Math.abs(indentStart - 468) <= tolerance && Math.abs(indentEnd - 0) <= tolerance) {
    return 'TRANSITION';
  }
  
  // SCENE_HEADING, ACTION, ACT_BREAK, SHOT: 0pt izquierda, 0pt derecha
  if (Math.abs(indentStart - 0) <= tolerance && Math.abs(indentEnd - 0) <= tolerance) {
    // Necesitamos el texto para distinguir entre estos
    return null; // No podemos determinar sin texto
  }
  
  return null;
}

/**
 * Obtiene el conteo de parrafos recalculados (para mostrar en alertas)
 */
function getRecalculatedParagraphsCount() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var paragraphs = body.getParagraphs();
  var count = 0;
  
  for (var i = 0; i < paragraphs.length; i++) {
    var para = paragraphs[i];
    var indentStart = para.getIndentStart();
    var indentEnd = para.getIndentEnd();
    
    if (detectFormatTypeByIndentation(indentStart, indentEnd)) {
      count++;
    }
  }
  
  return count;
}

/**
 * Aplica formato Fountain a todo el documento
 * Interpreta el documento completo como texto plano Fountain y aplica formatos
 */
function applyFountainFormat() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var totalParagraphs = body.getNumChildren();
  var totalProcessed = 0;
  
  var previousWasCharacter = false;
  var previousWasParenthetical = false;
  
  // Recorrer todos los elementos del body
  for (var i = 0; i < totalParagraphs; i++) {
    var element = body.getChild(i);
    
    // Solo procesar si es un parrafo
    if (element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      continue;
    }
    
    var para = element.asParagraph();
    var text = para.getText().trim();
    
    if (!text) {
      previousWasCharacter = false;
      previousWasParenthetical = false;
      continue;
    }
    
    var formatType = detectFountainBlockType(text, previousWasCharacter, previousWasParenthetical);
    
    if (formatType) {
      applyDirectFormat(para, formatType);
      totalProcessed++;
      
      previousWasCharacter = (formatType === 'CHARACTER');
      previousWasParenthetical = (formatType === 'PARENTHETICAL');
    } else {
      previousWasCharacter = false;
      previousWasParenthetical = false;
    }
  }
  
  // Formateo completado - sin mensaje
}

/**
 * Detecta el tipo de bloque segun reglas Fountain
 * @param {string} text - Texto del parrafo
 * @param {boolean} previousWasCharacter - Si el bloque anterior era CHARACTER
 * @param {boolean} previousWasParenthetical - Si el bloque anterior era PARENTHETICAL
 * @return {string} - Tipo de formato a aplicar
 */
function detectFountainBlockType(text, previousWasCharacter, previousWasParenthetical) {
  // 1. SCENE HEADING
  if (/^(INT\.|EXT\.|INT\.\/EXT\.|I\/E|INT\/EXT)/i.test(text)) {
    return 'SCENE_HEADING';
  }
  
  // 2. TRANSITION (incluye español e inglés)
  if (/:$/.test(text) && text.length < 30) {
    return 'TRANSITION';
  }
  if (/^(CUT TO:|FADE IN:|FADE OUT:|FADE TO:|DISSOLVE TO:|MATCH CUT TO:|JUMP CUT TO:|SMASH CUT TO:|CORTE A:|FUNDIDO A:|FUNDIDO A NEGRO:|DISOLVENCIA A:)/i.test(text)) {
    return 'TRANSITION';
  }
  
  // 3. PARENTHETICAL
  if (/^\(.+\)$/.test(text)) {
    return 'PARENTHETICAL';
  }
  
  // 4. DIALOGUE (despues de CHARACTER o PARENTHETICAL)
  if (previousWasCharacter || previousWasParenthetical) {
    if (!/^\(.+\)$/.test(text) && !(text === text.toUpperCase() && text.length >= 2 && text.length <= 35)) {
      return 'DIALOGUE';
    }
  }
  
  // 5. CHARACTER
  if (text === text.toUpperCase() && 
      text.length >= 2 && 
      text.length <= 35 && 
      /^[A-Z][A-Z\s\.\'\-]+(\s*\([A-Z\.\']+\))?$/.test(text)) {
    return 'CHARACTER';
  }
  
  // 6. SHOT
  if (/^(CLOSE ON|CLOSE UP|CLOSEUP|WIDE SHOT|ANGLE ON|POV|INSERT|MONTAGE|SERIES OF SHOTS)/i.test(text)) {
    return 'SHOT';
  }
  
  // 7. ACTION (default)
  return 'ACTION';
}

/**
 * Aplica formato directamente a un parrafo usando FORMAT_CONFIG
 * Replica la logica exacta de applyFormat() pero sin requerir cursor
 * @param {Paragraph} para - Parrafo al que aplicar formato
 * @param {string} formatType - Tipo de formato a aplicar
 */
function applyDirectFormat(para, formatType) {
  var config = FORMAT_CONFIG[formatType];
  
  if (!config) return;
  
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
  
  // Aplicar indentStart primero para mover el inicio del párrafo
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  // Asegurar que indentFirstLine sea igual a indentStart para que todo el párrafo se mueva
  para.setIndentFirstLine(leftIndent);
  
  // PASO 3: Aplicar espaciado
  para.setSpacingBefore(Number(config.spaceBefore) || 0);
  para.setSpacingAfter(Number(config.spaceAfter) || 0);
  
  // PASO 4: Aplicar alineacion (SIN negrita en ninguna parte)
  if (config.alignment) {
    para.setAlignment(config.alignment);
  }
  
  // PASO 5: Aplicar mayusculas
  if (config.uppercase) {
    var finalText = originalText.toUpperCase();
    
    // ESPECIAL: Si es PERSONAJE, verificar CONT'D
    if (formatType === 'CHARACTER') {
      var upperText = originalText.toUpperCase().trim();
      var currentName = upperText.replace(/\s*\([^)]*\).*$/, '').trim();
      var previousChar = getPreviousCharacterDirect(para);
      
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
    
    // ESPECIAL: Si es TRANSICIÓN, convertir a inglés
    if (formatType === 'TRANSITION') {
      finalText = convertTransitionToEnglish(originalText);
    }
    
    para.setText(finalText);
  }
  
  // PASO 6: Re-aplicar fuente SIN negrita
  textElement = para.editAsText();
  textElement.setFontFamily(FONT.family);
  textElement.setFontSize(FONT.size);
  textElement.setBold(false);
  
  // PASO 7: HACK - Re-aplicar indentacion multiple
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  
  return para;
}

/**
 * Detecta el personaje anterior (versión para applyDirectFormat)
 * @param {Paragraph} currentPara - Párrafo actual
 * @return {string|null} - Nombre del personaje anterior o null
 */
function getPreviousCharacterDirect(currentPara) {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  
  // Obtener el índice del párrafo actual usando getChildIndex
  var currentIndex = -1;
  try {
    currentIndex = body.getChildIndex(currentPara);
  } catch (e) {
    return null;
  }
  
  if (currentIndex <= 0) return null;
  
  for (var i = currentIndex - 1; i >= 0; i--) {
    var child = body.getChild(i);
    
    // Solo procesar si es un párrafo
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    
    var para = child.asParagraph();
    var indent = para.getIndentStart();
    
    if (Math.abs(indent - 144) <= 2) {
      var text = para.getText().trim();
      var cleanName = text.replace(/\s*\([^)]*\).*$/, '').trim();
      return cleanName;
    }
    
    if (isSceneHeading(para)) {
      break;
    }
  }
  
  return null;
}

/**
 * Convierte transiciones de español a inglés
 * @param {string} text - Texto de la transición
 * @return {string} - Transición en inglés
 */
function convertTransitionToEnglish(text) {
  var TRANSITION_MAP = {
    'CORTE A:': 'CUT TO:',
    'FUNDIDO A:': 'FADE TO:',
    'FUNDIDO A NEGRO:': 'FADE OUT:',
    'FUNDIDO DESDE NEGRO:': 'FADE IN:',
    'DISOLVENCIA A:': 'DISSOLVE TO:',
    'FUNDIDO:': 'FADE OUT:',
    'CORTE:': 'CUT TO:'
  };
  
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
 * Muestra lista de personajes
 */
function showCharacterList() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var characters = new Set();
  var numChildren = body.getNumChildren();
  
  for (var i = 0; i < numChildren; i++) {
    var child = body.getChild(i);
    if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var para = child.asParagraph();
      var indent = para.getIndentStart();
      
      if (Math.abs(indent - 144) <= 2) {
        var text = para.getText().trim();
        var name = text.replace(/\s*\([^)]*\).*$/, '').trim();
        if (name && name.length >= 2) {
          characters.add(name);
        }
      }
    }
  }
  
  var charArray = Array.from(characters).sort();
  var message = 'PERSONAJES EN EL GUION\n\n';
  message += 'Total: ' + charArray.length + '\n\n';
  message += charArray.join('\n');
  
  DocumentApp.getUi().alert(message);
}

/**
 * Cuenta diálogos por personaje
 */
function countDialoguesByCharacter() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var dialogues = {};
  var numChildren = body.getNumChildren();
  var currentCharacter = null;
  
  for (var i = 0; i < numChildren; i++) {
    var child = body.getChild(i);
    if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var para = child.asParagraph();
      var indent = para.getIndentStart();
      
      // Personaje (144pt)
      if (Math.abs(indent - 144) <= 2) {
        var text = para.getText().trim();
        currentCharacter = text.replace(/\s*\([^)]*\).*$/, '').trim();
        if (!dialogues[currentCharacter]) {
          dialogues[currentCharacter] = 0;
        }
      }
      // Diálogo (108pt)
      else if (Math.abs(indent - 108) <= 2 && currentCharacter) {
        dialogues[currentCharacter]++;
      }
    }
  }
  
  // Ordenar por cantidad de diálogos
  var sorted = Object.keys(dialogues).sort(function(a, b) {
    return dialogues[b] - dialogues[a];
  });
  
  var message = 'DIÁLOGOS POR PERSONAJE\n\n';
  sorted.forEach(function(char) {
    message += char + ': ' + dialogues[char] + '\n';
  });
  
  DocumentApp.getUi().alert(message);
}

/**
 * Busca un personaje en el documento
 */
function searchCharacter() {
  var ui = DocumentApp.getUi();
  var response = ui.prompt('Buscar Personaje', 'Introduce el nombre del personaje:', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() === ui.Button.OK) {
    var searchName = response.getResponseText().toUpperCase().trim();
    if (!searchName) return;
    
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var found = [];
    var numChildren = body.getNumChildren();
    
    for (var i = 0; i < numChildren; i++) {
      var child = body.getChild(i);
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        var para = child.asParagraph();
        var indent = para.getIndentStart();
        
        if (Math.abs(indent - 144) <= 2) {
          var text = para.getText().trim().toUpperCase();
          if (text.indexOf(searchName) === 0) {
            found.push({ index: i, text: text });
          }
        }
      }
    }
    
    if (found.length === 0) {
      // No se encontraron apariciones - sin mensaje
    } else {
      // Ir a la primera aparición silenciosamente
      var firstPara = body.getChild(found[0].index).asParagraph();
      doc.setCursor(doc.newPosition(firstPara.editAsText(), 0));
    }
  }
}

/**
 * Muestra atajos de teclado
 */
function showKeyboardShortcuts() {
  var message = 'ATAJOS DE TECLADO\n\n';
  message += 'Formatos:\n';
  message += 'Ctrl+Alt+1 - Encabezado de escena\n';
  message += 'Ctrl+Alt+2 - Acción\n';
  message += 'Ctrl+Alt+3 - Personaje\n';
  message += 'Ctrl+Alt+4 - Diálogo\n';
  message += 'Ctrl+Alt+5 - Parentético\n';
  message += 'Ctrl+Alt+6 - Transición\n';
  message += 'Ctrl+Alt+F - Formateo inteligente\n\n';
  message += 'Navegación:\n';
  message += 'Ctrl+Shift+Up - Escena anterior\n';
  message += 'Ctrl+Shift+Down - Escena siguiente\n';
  
  DocumentApp.getUi().alert(message);
}
