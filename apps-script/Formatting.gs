/**
 * SISTEMA DE FORMATEO
 * Funciones para aplicar formatos de guion cinematografico
 */

// Mapeo de transiciones español → inglés (usado también por convertTransitionToEnglish en Code.gs)
var TRANSITION_MAP = {
  'CORTE A:': 'CUT TO:',
  'FUNDIDO A:': 'FADE TO:',
  'FUNDIDO A NEGRO:': 'FADE OUT:',
  'FUNDIDO DESDE NEGRO:': 'FADE IN:',
  'DISOLVENCIA A:': 'DISSOLVE TO:',
  'FUNDIDO:': 'FADE OUT:',
  'CORTE:': 'CUT TO:'
};

/**
 * Inserta texto de ejemplo si el párrafo actual está vacío.
 * @param {string} textoEjemplo - Texto de ejemplo a insertar
 */
function insertarTextoEjemploSiVacio(textoEjemplo) {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  // Obtener el párrafo desde selección o cursor
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (paragraph && paragraph.getType() === DocumentApp.ElementType.PARAGRAPH) {
    var para = paragraph.asParagraph();
    var textoActual = para.getText().trim();
    
    // Solo insertar si está vacío
    if (!textoActual) {
      para.setText(textoEjemplo);
      
      // Posicionar cursor al final del texto insertado
      var doc = DocumentApp.getActiveDocument();
      var position = doc.newPosition(para.getChild(0).asText(), textoEjemplo.length);
      doc.setCursor(position);
    }
  }
}

/**
 * Aplica formato de encabezado de escena (Scene Heading)
 */
function applySceneHeading() {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (paragraph && paragraph.getType() === DocumentApp.ElementType.PARAGRAPH) {
    var para = paragraph.asParagraph();
    var textoActual = para.getText().trim();
    
    if (!textoActual) {
      var textoEjemplo = 'INT. LOCALIZACIÓN - DÍA';
      para.setText(textoEjemplo);
      applyFormat('SCENE_HEADING');
      
      var position = doc.newPosition(para.getChild(0).asText(), textoEjemplo.length);
      doc.setCursor(position);
      return;
    }
  }
  
  applyFormat('SCENE_HEADING');
}

/**
 * Aplica formato de accion (Action)
 */
function applyAction() {
  insertarTextoEjemploSiVacio('Descripción de la acción.');
  applyFormat('ACTION');
}

/**
 * Aplica formato de personaje (Character) de forma inteligente:
 * - Si párrafo vacío: Solicita nombre al usuario
 * - Si ya tiene texto: Detecta automáticamente CONT'D según personaje anterior
 * - Siempre crea línea de diálogo automáticamente
 */
function applyCharacter() {
  var doc = DocumentApp.getActiveDocument();
  var ui = DocumentApp.getUi();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  // Obtener el párrafo
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (!paragraph) {
    return; // Sin cursor - operación cancelada
  }
  
  var para = paragraph.asParagraph();
  var currentText = para.getText().trim();
  
  // CASO 1: Párrafo vacío - solicitar nombre del personaje
  if (!currentText) {
    var response = ui.prompt(
      'Nombre del Personaje',
      'Introduce el nombre del personaje (en mayúsculas):',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (response.getSelectedButton() !== ui.Button.OK) {
      return; // Usuario canceló
    }
    
    var nombrePersonaje = response.getResponseText().trim().toUpperCase();
    
    if (!nombrePersonaje) {
      return; // Sin nombre - operación cancelada
    }
    
    // Detectar si debe llevar CONT'D
    var previousChar = getPreviousCharacter(para);
    var nombreFinal = nombrePersonaje;
    
    if (previousChar && previousChar.toUpperCase() === nombrePersonaje) {
      if (!nombrePersonaje.includes("CONT'D") && !nombrePersonaje.includes('CONTD')) {
        nombreFinal = nombrePersonaje + " (CONT'D)";
      }
    }
    
    para.setText(nombreFinal);
    applyFormat('CHARACTER');
    
    // Crear línea de diálogo
    crearLineaDialogoDespuesDePersonaje(doc, para);
    return;
  }
  
  // CASO 2: Ya tiene texto - detectar si necesita CONT'D
  var currentIndent = para.getIndentStart();
  var isAlreadyCharacter = Math.abs(currentIndent - 144) <= 2;
  
  // Extraer nombre limpio (sin extensiones)
  var currentName = currentText.replace(/\s*\([^)]*\).*$/, '').trim().toUpperCase();
  
  // Detectar personaje anterior
  var previousChar = getPreviousCharacter(para);
  
  // Si el personaje anterior es el mismo, añadir (CONT'D)
  if (previousChar && previousChar.toUpperCase() === currentName) {
    if (!currentText.includes("CONT'D") && !currentText.includes('CONTD')) {
      para.setText(currentName + " (CONT'D)");
    }
  } else {
    // Asegurar que el nombre esté en mayúsculas sin CONT'D
    para.setText(currentName);
  }
  
  // Aplicar formato de personaje
  applyFormat('CHARACTER');
  
  // Crear línea de diálogo si es necesario
  crearLineaDialogoDespuesDePersonaje(doc, para);
}

/**
 * Función auxiliar para crear una línea de diálogo después de un personaje
 * @param {Document} doc - Documento activo
 * @param {Paragraph} para - Párrafo del personaje
 */
function crearLineaDialogoDespuesDePersonaje(doc, para) {
  var body = doc.getBody();
  var childIndex = body.getChildIndex(para);
  
  // Verificar si ya existe un párrafo siguiente que sea diálogo
  var nextIndex = childIndex + 1;
  var createNew = true;
  
  if (nextIndex < body.getNumChildren()) {
    var nextChild = body.getChild(nextIndex);
    if (nextChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var nextPara = nextChild.asParagraph();
      var nextIndent = nextPara.getIndentStart();
      
      // Si el siguiente ya es un diálogo (108pt) o parentético (126pt), no crear nuevo
      if (Math.abs(nextIndent - 108) <= 2 || Math.abs(nextIndent - 126) <= 2) {
        createNew = false;
        // Solo mover cursor al existente
        var position = doc.newPosition(nextPara, 0);
        doc.setCursor(position);
      }
    }
  }
  
  if (createNew) {
    // Crear nuevo párrafo después del personaje
    var newPara = body.insertParagraph(childIndex + 1, '');
    
    // Aplicar formato de DIÁLOGO
    var dialogueConfig = FORMAT_CONFIG.DIALOGUE;
    newPara.setIndentStart(Number(dialogueConfig.indentStart) || 0);
    newPara.setIndentEnd(Number(dialogueConfig.indentEnd) || 0);
    newPara.setIndentFirstLine(Number(dialogueConfig.indentStart) || 0);
    newPara.setSpacingBefore(Number(dialogueConfig.spaceBefore) || 0);
    newPara.setSpacingAfter(Number(dialogueConfig.spaceAfter) || 0);
    newPara.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
    newPara.editAsText().setFontFamily(FONT.family);
    newPara.editAsText().setFontSize(FONT.size);
    newPara.editAsText().setBold(false);
    newPara.editAsText().setItalic(false);
    newPara.editAsText().setUnderline(false);
    
    // Mover cursor al nuevo párrafo de diálogo
    var position = doc.newPosition(newPara, 0);
    doc.setCursor(position);
  }
}

/**
 * Detecta si el personaje anterior es el mismo que el actual
 * @param {Paragraph} currentPara - Párrafo actual
 * @return {string|null} - Nombre del personaje anterior o null
 */
function getPreviousCharacter(currentPara) {
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
  
  // Buscar hacia atrás el último personaje
  for (var i = currentIndex - 1; i >= 0; i--) {
    var child = body.getChild(i);
    
    // Solo procesar si es un párrafo
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    
    var para = child.asParagraph();
    var indent = para.getIndentStart();
    
    // Si es un personaje (indent 144pt)
    if (Math.abs(indent - 144) <= 2) {
      var text = para.getText().trim();
      // Eliminar (CONT'D) o cualquier paréntesis del nombre
      var cleanName = text.replace(/\s*\([^)]*\).*$/, '').trim();
      return cleanName;
    }
    
    // Si encontramos un encabezado de escena, detener búsqueda
    if (isSceneHeading(para)) {
      break;
    }
  }
  
  return null;
}

/**
 * Aplica formato de dialogo (Dialogue)
 * Si no hay un personaje anterior, solicita el nombre del personaje primero.
 */
function applyDialogue() {
  var doc = DocumentApp.getActiveDocument();
  var ui = DocumentApp.getUi();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  // Obtener el párrafo actual
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (!paragraph) {
    return; // Sin cursor - operación cancelada
  }
  
  var para = paragraph.asParagraph();
  var body = doc.getBody();
  var currentIndex = body.getChildIndex(para);
  
  // Verificar si hay un personaje en el párrafo anterior
  var hasCharacterAbove = false;
  
  if (currentIndex > 0) {
    var prevChild = body.getChild(currentIndex - 1);
    if (prevChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var prevPara = prevChild.asParagraph();
      var prevIndent = prevPara.getIndentStart();
      
      // Si es personaje (144pt) o parentético (126pt)
      if (Math.abs(prevIndent - 144) <= 2 || Math.abs(prevIndent - 126) <= 2) {
        hasCharacterAbove = true;
      }
    }
  }
  
  // Si no hay personaje arriba, crear uno primero
  if (!hasCharacterAbove) {
    var response = ui.prompt(
      'Nombre del Personaje',
      'No hay un personaje asociado a este diálogo.\nIntroduce el nombre del personaje (en mayúsculas):',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (response.getSelectedButton() !== ui.Button.OK) {
      return; // Usuario canceló
    }
    
    var nombrePersonaje = response.getResponseText().trim().toUpperCase();
    
    if (!nombrePersonaje) {
      return; // Sin nombre - operación cancelada
    }
    
    // Detectar si debe llevar CONT'D
    var previousChar = getPreviousCharacter(para);
    var nombreFinal = nombrePersonaje;
    
    if (previousChar && previousChar.toUpperCase() === nombrePersonaje) {
      if (!nombrePersonaje.includes("CONT'D") && !nombrePersonaje.includes('CONTD')) {
        nombreFinal = nombrePersonaje + " (CONT'D)";
      }
    }
    
    // Insertar párrafo de personaje antes del diálogo
    var charPara = body.insertParagraph(currentIndex, nombreFinal);
    applyDirectFormat(charPara, 'CHARACTER');
  }
  
  // Aplicar formato de diálogo
  var textoActual = para.getText().trim();
  if (!textoActual) {
    para.setText('Diálogo del personaje.');
  }
  
  applyFormat('DIALOGUE');
}

/**
 * Aplica formato parentetico (Parenthetical)
 */
function applyParenthetical() {  insertarTextoEjemploSiVacio('(acción)');  applyFormat('PARENTHETICAL');
}

/**
 * Aplica formato de transicion (Transition)
 */
function applyTransition() {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (paragraph && paragraph.getType() === DocumentApp.ElementType.PARAGRAPH) {
    var para = paragraph.asParagraph();
    var textoActual = para.getText().trim();
    
    if (!textoActual) {
      var textoEjemplo = 'CORTE A:';
      para.setText(textoEjemplo);
      applyFormat('TRANSITION');
      
      var position = doc.newPosition(para.getChild(0).asText(), textoEjemplo.length);
      doc.setCursor(position);
      return;
    }
  }
  
  applyFormat('TRANSITION');
}

/**
 * Aplica formato de Act Break
 */
function applyActBreak() {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (paragraph && paragraph.getType() === DocumentApp.ElementType.PARAGRAPH) {
    var para = paragraph.asParagraph();
    var textoActual = para.getText().trim();
    
    if (!textoActual) {
      var textoEjemplo = 'FIN DEL ACTO UNO';
      para.setText(textoEjemplo);
      applyFormat('ACT_BREAK');
      
      var position = doc.newPosition(para.getChild(0).asText(), textoEjemplo.length);
      doc.setCursor(position);
      return;
    }
  }
  
  applyFormat('ACT_BREAK');
}

/**
 * Aplica formato de Plano (Shot)
 */
function applyShot() {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();
  var paragraph = null;
  
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
        element = element.getParent();
      }
      paragraph = element;
    }
  } else if (cursor) {
    var element = cursor.getElement();
    while (element && element.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      element = element.getParent();
    }
    paragraph = element;
  }
  
  if (paragraph && paragraph.getType() === DocumentApp.ElementType.PARAGRAPH) {
    var para = paragraph.asParagraph();
    var textoActual = para.getText().trim();
    
    if (!textoActual) {
      var textoEjemplo = 'PLANO GENERAL';
      para.setText(textoEjemplo);
      applyFormat('SHOT');
      
      var position = doc.newPosition(para.getChild(0).asText(), textoEjemplo.length);
      doc.setCursor(position);
      return;
    }
  }
  
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
    return; // Sin párrafo - operación cancelada
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
  
  // Aplicar indentStart primero para mover el inicio del párrafo
  para.setIndentStart(leftIndent);
  para.setIndentEnd(rightIndent);
  // Asegurar que indentFirstLine sea igual a indentStart para que todo el párrafo se mueva
  para.setIndentFirstLine(leftIndent);
  
  // PASO 3: Aplicar espaciado
  para.setSpacingBefore(Number(config.spaceBefore) || 0);
  para.setSpacingAfter(Number(config.spaceAfter) || 0);
  
  // PASO 4: Aplicar alineacion
  if (config.alignment) {
    para.setAlignment(config.alignment);
  }
  
  // PASO 5: Aplicar mayusculas ANTES de re-aplicar fuente
  if (config.uppercase) {
    var finalText = originalText.toUpperCase();
    
    // ESPECIAL: Si es PERSONAJE, FORZAR mayúsculas y verificar CONT'D
    if (formatType === 'CHARACTER') {
      // Convertir TODO a mayúsculas primero (no permitir minúsculas)
      var upperText = originalText.toUpperCase().trim();
      var currentName = upperText.replace(/\s*\([^)]*\).*$/, '').trim();
      var previousChar = getPreviousCharacter(para);
      
      if (previousChar && currentName === previousChar.toUpperCase()) {
        // Añadir (CONT'D) si no lo tiene ya
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
      var upperText = originalText.toUpperCase().trim();
      // Buscar en el mapa de traducciones
      for (var spanish in TRANSITION_MAP) {
        if (upperText === spanish || upperText.indexOf(spanish) === 0) {
          finalText = TRANSITION_MAP[spanish];
          break;
        }
      }
      // Si no termina en ':', añadirlo
      if (!finalText.endsWith(':')) {
        finalText += ':';
      }
    }
    
    para.setText(finalText);
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
      var numberedText = sceneNumber + '. ' + text.toUpperCase();
      para.setText(numberedText);
      
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
  
  // Escenas renumeradas - sin mensaje
}

/**
 * Quita la numeración de un encabezado de escena.
 * Alias para compatibilidad: removeSceneNumber
 * @param {string} text - Texto de escena
 * @return {string} Texto sin numeración
 */
function removeSceneNumber(text) {
  return text.replace(/^\d+\.\s*/, '').replace(/\s*\(\d+\)\s*$/, '').trim();
}
