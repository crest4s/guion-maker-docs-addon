/**
 * GUION MAKER - GOOGLE APPS SCRIPT (LINKED SCRIPT)
 * Sistema de formateo profesional de guiones cinematograficos
 * Version: 2.1
 */

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

var FORMAT_CONFIG = {
  SCENE_HEADING:  { indentStart: 0,   indentEnd: 0,  spaceBefore: 12, spaceAfter: 6,  uppercase: true  },
  ACTION:         { indentStart: 0,   indentEnd: 0,  spaceBefore: 0,  spaceAfter: 6,  uppercase: false },
  CHARACTER:      { indentStart: 144, indentEnd: 0,  spaceBefore: 6,  spaceAfter: 0,  uppercase: true  },
  DIALOGUE:       { indentStart: 108, indentEnd: 72, spaceBefore: 0,  spaceAfter: 6,  uppercase: false },
  PARENTHETICAL:  { indentStart: 126, indentEnd: 90, spaceBefore: 0,  spaceAfter: 0,  uppercase: false },
  TRANSITION:     { indentStart: 376, indentEnd: 0,  spaceBefore: 6,  spaceAfter: 6,  uppercase: true  },
  ACT_BREAK:      { indentStart: 0,   indentEnd: 0,  spaceBefore: 12, spaceAfter: 12, uppercase: true,
                    alignment: DocumentApp.HorizontalAlignment.CENTER },
  SHOT:           { indentStart: 0,   indentEnd: 0,  spaceBefore: 6,  spaceAfter: 0,  uppercase: true  }
};

var FONT = { family: 'Courier New', size: 12 };

var PAGE_CONFIG = {
  width: 595, height: 842,
  marginTop: 72, marginBottom: 72, marginLeft: 108, marginRight: 72
};

// ============================================================================
// TRIGGERS
// ============================================================================

function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('Guion')
    .addSubMenu(ui.createMenu('Formato')
      .addItem('Encabezado de escena [Ctrl+Alt+1]', 'applySceneHeading')
      .addItem('Accion [Ctrl+Alt+2]',               'applyAction')
      .addItem('Personaje [Ctrl+Alt+3]',            'applyCharacter')
      .addItem('Dialogo [Ctrl+Alt+4]',              'applyDialogue')
      .addItem('Parentetico [Ctrl+Alt+5]',          'applyParenthetical')
      .addItem('Transicion [Ctrl+Alt+6]',           'applyTransition')
      .addItem('Act Break',                          'applyActBreak')
      .addItem('Plano (Shot)',                       'applyShot'))
    .addSeparator()
    .addItem('Renumerar escenas', 'renumberScenes')
    .addSeparator()
    .addSubMenu(ui.createMenu('Plantillas')
      .addItem('Insertar portada',        'insertTitlePage')
      .addItem('Insertar escena estandar', 'insertSceneTemplate'))
    .addSeparator()
    .addSubMenu(ui.createMenu('Herramientas')
      .addItem('Configurar documento', 'setupDocument')
      .addItem('Validar formato',      'validateFormat')
      .addItem('Limpiar formato',      'cleanFormat'))
    .addSubMenu(ui.createMenu('Personajes')
      .addItem('Lista de personajes', 'showCharacterList')
      .addItem('Buscar personaje',    'searchCharacter'))
    .addSeparator()
    .addItem('Abrir panel lateral', 'openSidebar')
    .addItem('Atajos de teclado',  'showKeyboardShortcuts')
    .addToUi();
}

function onInstall() {
  onOpen();
}

// ============================================================================
// SIDEBAR
// ============================================================================

function openSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Guion Pro')
    .setWidth(300);
  DocumentApp.getUi().showSidebar(html);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================================
// CONFIGURACION DEL DOCUMENTO
// ============================================================================

function setupDocument() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = FONT.family;
  style[DocumentApp.Attribute.FONT_SIZE]   = FONT.size;
  style[DocumentApp.Attribute.LINE_SPACING] = 1.0;
  body.setAttributes(style);

  body.setMarginTop(PAGE_CONFIG.marginTop);
  body.setMarginBottom(PAGE_CONFIG.marginBottom);
  body.setMarginLeft(PAGE_CONFIG.marginLeft);
  body.setMarginRight(PAGE_CONFIG.marginRight);
  body.setPageWidth(PAGE_CONFIG.width);
  body.setPageHeight(PAGE_CONFIG.height);

  recalculateAllIndentations();
}

/**
 * Re-aplica indentaciones correctas tras un cambio de márgenes.
 * En Google Docs los márgenes se suman a las indentaciones, causando desalineación.
 */
function recalculateAllIndentations() {
  var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs();

  for (var i = 0; i < paragraphs.length; i++) {
    var para = paragraphs[i];
    var formatType = detectFormatTypeByIndentation(para.getIndentStart(), para.getIndentEnd());

    if (formatType) {
      var config = FORMAT_CONFIG[formatType];
      var left  = Number(config.indentStart) || 0;
      var right = Number(config.indentEnd)   || 0;
      para.setIndentStart(0);
      para.setIndentEnd(0);
      para.setIndentFirstLine(0);
      para.setIndentStart(left);
      para.setIndentEnd(right);
      para.setIndentFirstLine(left);
    }
  }
}

function detectFormatTypeByIndentation(indentStart, indentEnd) {
  var t = 2;
  if (Math.abs(indentStart - 144) <= t && Math.abs(indentEnd)      <= t) return 'CHARACTER';
  if (Math.abs(indentStart - 108) <= t && Math.abs(indentEnd - 72) <= t) return 'DIALOGUE';
  if (Math.abs(indentStart - 126) <= t && Math.abs(indentEnd - 90) <= t) return 'PARENTHETICAL';
  if (Math.abs(indentStart - 376) <= t && Math.abs(indentEnd)      <= t) return 'TRANSITION';
  return null;
}

// ============================================================================
// VALIDACION Y LIMPIEZA
// ============================================================================

function validateFormat() {
  var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs();
  var issues = [];

  for (var i = 0; i < paragraphs.length; i++) {
    var text = paragraphs[i].getText().trim();
    if (!text) continue;

    var fontFamily = paragraphs[i].editAsText().getFontFamily(0);
    var fontSize   = paragraphs[i].editAsText().getFontSize(0);

    if (fontFamily && fontFamily !== FONT.family && fontFamily !== 'Courier Prime') {
      issues.push('Linea ' + (i + 1) + ': Fuente incorrecta (' + fontFamily + ')');
    }
    if (fontSize && fontSize !== FONT.size) {
      issues.push('Linea ' + (i + 1) + ': Tamano incorrecto (' + fontSize + 'pt)');
    }
  }

  var ui = DocumentApp.getUi();
  if (issues.length === 0) {
    ui.alert('Formato correcto. No se encontraron problemas.');
  } else {
    var message = 'Se encontraron ' + issues.length + ' problema(s):\n\n';
    message += issues.slice(0, 10).join('\n');
    if (issues.length > 10) message += '\n... y ' + (issues.length - 10) + ' mas.';
    ui.alert(message);
  }
}

function cleanFormat() {
  var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs();

  for (var i = 0; i < paragraphs.length; i++) {
    if (!paragraphs[i].getText().trim()) continue;
    var textEl = paragraphs[i].editAsText();
    textEl.setFontFamily(FONT.family);
    textEl.setFontSize(FONT.size);
    textEl.setBackgroundColor(null);
    textEl.setUnderline(false);
    textEl.setItalic(false);
  }
}

// ============================================================================
// PLANTILLAS
// ============================================================================

function insertTitlePage() {
  var doc  = DocumentApp.getActiveDocument();
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

  var title = body.insertParagraph(insertIndex, 'TITULO DEL GUION');
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  title.setSpacingBefore(200);
  title.setSpacingAfter(30);
  title.editAsText().setFontFamily(FONT.family).setFontSize(14).setBold(false);

  var author = body.insertParagraph(insertIndex + 1, 'Escrito por');
  author.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  author.setSpacingAfter(10);
  author.editAsText().setFontFamily(FONT.family).setFontSize(FONT.size).setBold(false);

  var authorName = body.insertParagraph(insertIndex + 2, 'NOMBRE DEL AUTOR');
  authorName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  authorName.setSpacingAfter(200);
  authorName.editAsText().setFontFamily(FONT.family).setFontSize(FONT.size).setBold(false);

  body.insertPageBreak(insertIndex + 3);
}

function insertSceneTemplate() {
  var doc    = DocumentApp.getActiveDocument();
  var body   = doc.getBody();
  var cursor = doc.getCursor();

  if (!cursor) return;

  var element = cursor.getElement();
  while (element.getParent().getType() !== DocumentApp.ElementType.BODY_SECTION) {
    element = element.getParent();
  }
  var idx = body.getChildIndex(element) + 1;

  applyDirectFormat(body.insertParagraph(idx,     'INT. LOCACION - DIA'),                   'SCENE_HEADING');
  applyDirectFormat(body.insertParagraph(idx + 1, 'Descripcion de la accion inicial.'),      'ACTION');
  applyDirectFormat(body.insertParagraph(idx + 2, 'PERSONAJE UNO'),                          'CHARACTER');
  applyDirectFormat(body.insertParagraph(idx + 3, 'Primer dialogo del personaje.'),          'DIALOGUE');
  applyDirectFormat(body.insertParagraph(idx + 4, 'Accion entre dialogos.'),                 'ACTION');
  applyDirectFormat(body.insertParagraph(idx + 5, 'PERSONAJE DOS'),                          'CHARACTER');
  applyDirectFormat(body.insertParagraph(idx + 6, '(parentetico)'),                          'PARENTHETICAL');
  applyDirectFormat(body.insertParagraph(idx + 7, 'Respuesta del segundo personaje.'),       'DIALOGUE');
  body.insertParagraph(idx + 8, '');
}

// ============================================================================
// PERSONAJES
// ============================================================================

function showCharacterList() {
  var body = DocumentApp.getActiveDocument().getBody();
  var characters = new Set();

  for (var i = 0; i < body.getNumChildren(); i++) {
    var child = body.getChild(i);
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    var para = child.asParagraph();
    if (Math.abs(para.getIndentStart() - 144) <= 2) {
      var name = para.getText().trim().replace(/\s*\([^)]*\).*$/, '').trim();
      if (name && name.length >= 2) characters.add(name);
    }
  }

  var list = Array.from(characters).sort();
  DocumentApp.getUi().alert('PERSONAJES EN EL GUION\n\nTotal: ' + list.length + '\n\n' + list.join('\n'));
}

function searchCharacter() {
  var ui = DocumentApp.getUi();
  var response = ui.prompt('Buscar Personaje', 'Nombre del personaje:', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;

  var searchName = response.getResponseText().toUpperCase().trim();
  if (!searchName) return;

  var doc   = DocumentApp.getActiveDocument();
  var body  = doc.getBody();
  var found = [];

  for (var i = 0; i < body.getNumChildren(); i++) {
    var child = body.getChild(i);
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    var para = child.asParagraph();
    if (Math.abs(para.getIndentStart() - 144) <= 2) {
      var text = para.getText().trim().toUpperCase();
      if (text.indexOf(searchName) === 0) found.push({ index: i, text: text });
    }
  }

  if (found.length === 0) {
    ui.alert('No se encontro "' + searchName + '" en el guion.');
  } else {
    var firstPara = body.getChild(found[0].index).asParagraph();
    doc.setCursor(doc.newPosition(firstPara.editAsText(), 0));
    ui.alert('Se encontraron ' + found.length + ' aparicion(es) de "' + searchName + '".\nCursor movido a la primera.');
  }
}

// ============================================================================
// ATAJOS DE TECLADO
// ============================================================================

function showKeyboardShortcuts() {
  var msg = 'ATAJOS DE TECLADO\n\n';
  msg += 'FORMATO:\n';
  msg += 'Ctrl+Alt+1  Encabezado de escena\n';
  msg += 'Ctrl+Alt+2  Accion\n';
  msg += 'Ctrl+Alt+3  Personaje\n';
  msg += 'Ctrl+Alt+4  Dialogo\n';
  msg += 'Ctrl+Alt+5  Parentetico\n';
  msg += 'Ctrl+Alt+6  Transicion\n\n';
  msg += 'CONFIGURAR:\n';
  msg += 'Herramientas > Macros > Administrar macros\n';
  msg += 'Asigna cada atajo a la funcion correspondiente.';
  DocumentApp.getUi().alert('Atajos de Teclado', msg, DocumentApp.getUi().ButtonSet.OK);
}

// ============================================================================
// FUNCIONES INTERNAS
// Usadas por Formatting.gs, FountainParser.gs, Utilities.gs, Navigation.gs
// ============================================================================

/**
 * Aplica formato a un párrafo sin requerir cursor (para inserciones en batch).
 * Es la función base de formateo; applyFormat() en Formatting.gs es la versión
 * interactiva que además gestiona el cursor activo.
 */
function applyDirectFormat(para, formatType) {
  var config = FORMAT_CONFIG[formatType];
  if (!config) return;

  var originalText = para.getText();

  // Reset absoluto
  para.setIndentStart(0);
  para.setIndentEnd(0);
  para.setIndentFirstLine(0);
  para.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  para.setLineSpacing(1.0);
  para.setSpacingBefore(0);
  para.setSpacingAfter(0);

  var te = para.editAsText();
  te.setFontFamily(FONT.family);
  te.setFontSize(FONT.size);
  te.setBold(false);
  te.setItalic(false);
  te.setUnderline(false);
  te.setBackgroundColor(null);

  var left  = Number(config.indentStart) || 0;
  var right = Number(config.indentEnd)   || 0;

  para.setIndentStart(left);
  para.setIndentEnd(right);
  para.setIndentFirstLine(left);
  para.setSpacingBefore(Number(config.spaceBefore) || 0);
  para.setSpacingAfter(Number(config.spaceAfter)   || 0);

  if (config.alignment) para.setAlignment(config.alignment);

  if (config.uppercase) {
    var finalText = originalText.toUpperCase();

    if (formatType === 'CHARACTER') {
      var upper       = originalText.toUpperCase().trim();
      var cleanName   = upper.replace(/\s*\([^)]*\).*$/, '').trim();
      var prevChar    = getPreviousCharacterDirect(para);

      if (prevChar && cleanName === prevChar.toUpperCase()) {
        finalText = upper.includes("CONT'D") || upper.includes('CONTD')
          ? upper
          : cleanName + " (CONT'D)";
      } else {
        finalText = cleanName;
      }
    }

    if (formatType === 'TRANSITION') {
      finalText = convertTransitionToEnglish(originalText);
    }

    para.setText(finalText);
  }

  // Re-aplicar fuente tras setText (Google Docs la resetea)
  te = para.editAsText();
  te.setFontFamily(FONT.family);
  te.setFontSize(FONT.size);
  te.setBold(false);

  // Forzar recálculo de layout
  para.setIndentStart(left);
  para.setIndentEnd(right);

  return para;
}

/**
 * Busca el nombre del último personaje antes de currentPara (para CONT'D).
 */
function getPreviousCharacterDirect(currentPara) {
  var body = DocumentApp.getActiveDocument().getBody();
  var currentIndex;

  try {
    currentIndex = body.getChildIndex(currentPara);
  } catch (e) {
    return null;
  }

  if (currentIndex <= 0) return null;

  for (var i = currentIndex - 1; i >= 0; i--) {
    var child = body.getChild(i);
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    var para = child.asParagraph();

    if (Math.abs(para.getIndentStart() - 144) <= 2) {
      return para.getText().trim().replace(/\s*\([^)]*\).*$/, '').trim();
    }
    if (isSceneHeading(para)) break;
  }

  return null;
}

/**
 * Normaliza transiciones de español a inglés y garantiza terminación en ':'.
 * Usa el mapa global TRANSITION_MAP definido en Formatting.gs.
 */
function convertTransitionToEnglish(text) {
  var upper = text.toUpperCase().trim();

  for (var spanish in TRANSITION_MAP) {
    if (upper === spanish || upper.indexOf(spanish) === 0) {
      return TRANSITION_MAP[spanish];
    }
  }

  if (!upper.endsWith(':')) upper += ':';
  return upper;
}
