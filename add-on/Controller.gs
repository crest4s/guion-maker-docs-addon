/**
 * GUION MAKER - CONTROLLER
 * Capa de orquestación entre el menú y la lógica de negocio
 * 
 * @file Controller.gs
 * @description Funciones que coordinan las operaciones y manejan UI
 */

// ============================================================================
// CONTROLADORES DE FORMATO
// ============================================================================

/**
 * Aplica un formato específico al párrafo seleccionado.
 * 
 * @param {string} formatType - Tipo de formato a aplicar
 */
function controllerApplyFormat(formatType) {
  try {
    var doc = DocumentApp.getActiveDocument();
    var paragraph = getParagraphAtCursor();
    
    if (!paragraph) {
      showError('No se pudo encontrar el párrafo actual. Coloca el cursor en un párrafo.');
      return;
    }
    
    // Insertar texto de ejemplo si el párrafo está vacío
    var exampleText = getExampleTextForFormat(formatType);
    if (exampleText && paragraph.getText().trim() === '') {
      paragraph.setText(exampleText);
      
      // Posicionar cursor al final del texto
      var position = doc.newPosition(paragraph.getChild(0).asText(), exampleText.length);
      doc.setCursor(position);
    }
    
    // Aplicar el formato
    applyFormatToParagraph(paragraph, formatType);
    
  } catch (error) {
    console.error('Error en controllerApplyFormat:', error);
    showError('Error al aplicar formato: ' + error.message);
  }
}

/**
 * Obtiene texto de ejemplo para un tipo de formato.
 * 
 * @param {string} formatType - Tipo de formato
 * @return {string} Texto de ejemplo
 */
function getExampleTextForFormat(formatType) {
  var examples = {
    'SCENE_HEADING': 'INT. LOCALIZACIÓN - DÍA',
    'ACTION': 'Descripción de la acción.',
    'CHARACTER': 'PERSONAJE',
    'DIALOGUE': 'Texto del diálogo.',
    'PARENTHETICAL': '(acción)',
    'TRANSITION': 'CUT TO:',
    'ACT_BREAK': 'FIN DEL ACTO UNO',
    'SHOT': 'CLOSE ON'
  };
  
  return examples[formatType] || '';
}

/**
 * Valida el formato del documento completo.
 */
function controllerValidateFormat() {
  try {
    var issues = validateDocumentFormat();
    
    if (issues.length === 0) {
      showSuccess('El formato del documento es correcto.');
    } else {
      var message = 'Se encontraron ' + issues.length + ' problema(s) de formato:\n\n';
      message += issues.slice(0, 10).join('\n');
      if (issues.length > 10) {
        message += '\n\n... y ' + (issues.length - 10) + ' más.';
      }
      showInfo(message);
    }
  } catch (error) {
    console.error('Error en controllerValidateFormat:', error);
    showError('Error al validar formato: ' + error.message);
  }
}

/**
 * Limpia formato no estándar del documento.
 */
function controllerCleanFormat() {
  try {
    var count = cleanDocumentFormat();
    showSuccess('Se limpió el formato de ' + count + ' párrafos.');
  } catch (error) {
    console.error('Error en controllerCleanFormat:', error);
    showError('Error al limpiar formato: ' + error.message);
  }
}

/**
 * Busca un personaje en el documento.
 */
function controllerSearchCharacter() {
  try {
    var ui = DocumentApp.getUi();
    var response = ui.prompt(
      'Buscar Personaje',
      'Introduce el nombre del personaje:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (response.getSelectedButton() === ui.Button.OK) {
      var searchName = response.getResponseText().toUpperCase().trim();
      if (!searchName) return;
      
      var found = searchCharacterInDocument(searchName);
      
      if (found.length === 0) {
        showInfo('No se encontraron apariciones de "' + searchName + '".');
      } else {
        // Ir a la primera aparición
        var doc = DocumentApp.getActiveDocument();
        var body = doc.getBody();
        var firstPara = body.getChild(found[0].index).asParagraph();
        doc.setCursor(doc.newPosition(firstPara.editAsText(), 0));
        
        showSuccess('Se encontraron ' + found.length + ' apariciones. Cursor movido a la primera.');
      }
    }
  } catch (error) {
    console.error('Error en controllerSearchCharacter:', error);
    showError('Error al buscar personaje: ' + error.message);
  }
}

/**
 * Aplica formato de Personaje con lógica inteligente:
 * - Si el párrafo está vacío: solicita nombre
 * - Detecta CONT'D automáticamente
 * - Crea línea de diálogo vacía después del personaje
 */
function controllerApplyCharacter() {
  try {
    var doc       = DocumentApp.getActiveDocument();
    var ui        = DocumentApp.getUi();
    var paragraph = getParagraphAtCursor();

    if (!paragraph) {
      showError('Coloca el cursor en un párrafo.');
      return;
    }

    var currentText = paragraph.getText().trim();

    if (!currentText) {
      var response = ui.prompt('Personaje', 'Nombre del personaje:', ui.ButtonSet.OK_CANCEL);
      if (response.getSelectedButton() !== ui.Button.OK) return;
      var name = response.getResponseText().trim().toUpperCase();
      if (!name) return;

      var prevChar = getPreviousCharacterName(paragraph);
      if (prevChar && prevChar.toUpperCase() === name && !name.includes("CONT'D")) {
        name = name + " (CONT'D)";
      }
      paragraph.setText(name);
    }

    applyFormatToParagraph(paragraph, 'CHARACTER');
    createDialogueLineAfter(doc, paragraph);

  } catch (error) {
    console.error('Error en controllerApplyCharacter:', error);
    showError('Error al aplicar personaje: ' + error.message);
  }
}

/**
 * Aplica formato de Diálogo con lógica inteligente:
 * - Si no hay personaje encima, solicita uno primero
 * - Inserta el personaje y luego aplica formato de diálogo
 */
function controllerApplyDialogue() {
  try {
    var doc       = DocumentApp.getActiveDocument();
    var ui        = DocumentApp.getUi();
    var paragraph = getParagraphAtCursor();

    if (!paragraph) {
      showError('Coloca el cursor en un párrafo.');
      return;
    }

    var body         = doc.getBody();
    var currentIndex = body.getChildIndex(paragraph);
    var hasCharAbove = false;

    if (currentIndex > 0) {
      var prev = body.getChild(currentIndex - 1);
      if (prev.getType() === DocumentApp.ElementType.PARAGRAPH) {
        var prevIndent = prev.asParagraph().getIndentStart();
        hasCharAbove = Math.abs(prevIndent - 144) <= 2 || Math.abs(prevIndent - 126) <= 2;
      }
    }

    if (!hasCharAbove) {
      var response = ui.prompt(
        'Personaje',
        'No hay personaje asociado.\nNombre del personaje:',
        ui.ButtonSet.OK_CANCEL
      );
      if (response.getSelectedButton() !== ui.Button.OK) return;
      var name = response.getResponseText().trim().toUpperCase();
      if (!name) return;

      var prevChar = getPreviousCharacterName(paragraph);
      if (prevChar && prevChar.toUpperCase() === name && !name.includes("CONT'D")) {
        name = name + " (CONT'D)";
      }

      var charPara = body.insertParagraph(currentIndex, name);
      applyFormatToParagraph(charPara, 'CHARACTER');
      // paragraph shifted down by 1
      paragraph = body.getChild(currentIndex + 1).asParagraph();
    }

    if (!paragraph.getText().trim()) {
      paragraph.setText('Dialogo del personaje.');
    }

    applyFormatToParagraph(paragraph, 'DIALOGUE');

  } catch (error) {
    console.error('Error en controllerApplyDialogue:', error);
    showError('Error al aplicar dialogo: ' + error.message);
  }
}

/**
 * Abre el panel lateral del add-on.
 */
function controllerOpenSidebar() {
  try {
    var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Guion Pro')
      .setWidth(300);
    DocumentApp.getUi().showSidebar(html);
  } catch (error) {
    console.error('Error en controllerOpenSidebar:', error);
    showError('Error al abrir panel lateral: ' + error.message);
  }
}


/**
 * Muestra los atajos de teclado disponibles.
 */
function controllerShowKeyboardShortcuts() {
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
  showInfo(msg);
}

// ============================================================================
// CONTROLADORES DE HERRAMIENTAS
// ============================================================================

/**
 * Configura el documento con los estándares de guión.
 */
function controllerSetupDocument() {
  try {
    setupDocumentStandards();
    showSuccess('Documento configurado correctamente.');
  } catch (error) {
    console.error('Error en controllerSetupDocument:', error);
    showError('Error al configurar documento: ' + error.message);
  }
}

/**
 * Renumera todas las escenas del documento.
 */
function controllerRenumberScenes() {
  try {
    var count = renumberAllScenes();
    
    if (count > 0) {
      showSuccess('Se renumeraron ' + count + ' escenas.');
    } else {
      showInfo('No se encontraron escenas para renumerar.');
    }
  } catch (error) {
    console.error('Error en controllerRenumberScenes:', error);
    showError('Error al renumerar escenas: ' + error.message);
  }
}

// ============================================================================
// CONTROLADORES DE PERSONAJES
// ============================================================================

/**
 * Muestra la lista de personajes del documento.
 */
function controllerShowCharacterList() {
  try {
    var characters = extractCharacters();
    
    if (characters.length === 0) {
      showInfo('No se encontraron personajes en el documento.');
      return;
    }
    
    var message = '👥 PERSONAJES EN EL GUIÓN\n\n';
    message += 'Total: ' + characters.length + '\n\n';
    message += characters.join('\n');
    
    showInfo(message);
  } catch (error) {
    console.error('Error en controllerShowCharacterList:', error);
    showError('Error al obtener lista de personajes: ' + error.message);
  }
}

// ============================================================================
// CONTROLADORES DE PLANTILLAS
// ============================================================================

/**
 * Inserta una plantilla de portada.
 */
function controllerInsertTitlePage() {
  try {
    insertTitlePageTemplate();
    showSuccess('Portada insertada correctamente.');
  } catch (error) {
    console.error('Error en controllerInsertTitlePage:', error);
    showError('Error al insertar portada: ' + error.message);
  }
}

/**
 * Inserta una plantilla de escena estándar.
 */
function controllerInsertSceneTemplate() {
  try {
    insertSceneTemplateAtCursor();
    showSuccess('Escena estándar insertada correctamente.');
  } catch (error) {
    console.error('Error en controllerInsertSceneTemplate:', error);
    showError('Error al insertar escena: ' + error.message);
  }
}

// ============================================================================
// CONTROLADOR DE AYUDA
// ============================================================================

/**
 * Muestra información de ayuda del Add-on.
 */
function controllerShowHelp() {
  var message = '🎬 GUION MAKER - AYUDA\n\n';
  message += 'FORMATOS DISPONIBLES:\n';
  message += '• Encabezado de Escena: INT./EXT. LOCALIZACIÓN - MOMENTO\n';
  message += '• Acción: Descripción de acciones\n';
  message += '• Personaje: Nombre en mayúsculas\n';
  message += '• Diálogo: Texto del personaje\n';
  message += '• Parentético: (indicaciones entre diálogos)\n';
  message += '• Transición: CUT TO:, FADE TO:, etc.\n\n';
  message += 'Usa los formatos del menú para componer tu guion.';
  
  showInfo(message);
}

// ============================================================================
// UTILIDADES DE UI
// ============================================================================

/**
 * Muestra un mensaje de error al usuario.
 * 
 * @param {string} message - Mensaje de error
 */
function showError(message) {
  try {
    var ui = DocumentApp.getUi();
    ui.alert('❌ Error', message, ui.ButtonSet.OK);
  } catch (e) {
    console.error('No se pudo mostrar error:', message);
  }
}

/**
 * Muestra un mensaje de éxito al usuario.
 * 
 * @param {string} message - Mensaje de éxito
 */
function showSuccess(message) {
  try {
    var ui = DocumentApp.getUi();
    ui.alert('✅ Éxito', message, ui.ButtonSet.OK);
  } catch (e) {
    console.log('Éxito:', message);
  }
}

/**
 * Muestra un mensaje informativo al usuario.
 * 
 * @param {string} message - Mensaje informativo
 */
function showInfo(message) {
  try {
    var ui = DocumentApp.getUi();
    ui.alert('ℹ️ Información', message, ui.ButtonSet.OK);
  } catch (e) {
    console.log('Info:', message);
  }
}
