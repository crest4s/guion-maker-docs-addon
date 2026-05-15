/**
 * GUION MAKER - GOOGLE WORKSPACE ADD-ON
 * Sistema de formateo profesional de guiones cinematograficos
 * Version: 3.0
 *
 * @file Code.gs — Triggers del add-on, menú y bridges a Controller.gs
 */

// ============================================================================
// TRIGGERS DE CICLO DE VIDA
// ============================================================================

function onOpen(e) {
  try {
    if (!e || e.authMode === ScriptApp.AuthMode.NONE) return;
    createAddonMenu();
  } catch (error) {
    console.error('Error en onOpen:', error);
  }
}

function onInstall(e) {
  try { onOpen(e); } catch (error) { console.error('Error en onInstall:', error); }
}

function onFileScopeGranted(e) {
  try { onOpen(e); } catch (error) { console.error('Error en onFileScopeGranted:', error); }
}

// ============================================================================
// CREACIÓN DE MENÚ
// ============================================================================

function createAddonMenu() {
  var ui = DocumentApp.getUi();

  ui.createAddonMenu()
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
      .addItem('Insertar portada',         'insertTitlePage')
      .addItem('Insertar escena estandar', 'insertSceneTemplate'))
    .addSeparator()
    .addSubMenu(ui.createMenu('Herramientas')
      .addItem('Configurar documento',   'setupDocument')
      .addItem('Validar formato',        'validateFormat')
      .addItem('Limpiar formato',        'cleanFormat'))
    .addSubMenu(ui.createMenu('Personajes')
      .addItem('Lista de personajes', 'showCharacterList')
      .addItem('Buscar personaje',    'searchCharacter'))
    .addSeparator()
    .addItem('Abrir panel lateral', 'openSidebar')
    .addItem('Atajos de teclado',  'showKeyboardShortcuts')
    .addToUi();
}

// ============================================================================
// BRIDGES DE FORMATO
// Asignables como macros via Herramientas > Macros > Administrar macros
// ============================================================================

/** Macro: Ctrl+Alt+1 */ function applySceneHeading() { controllerApplyFormat('SCENE_HEADING'); }
/** Macro: Ctrl+Alt+2 */ function applyAction()        { controllerApplyFormat('ACTION');        }
/** Macro: Ctrl+Alt+3 */ function applyCharacter()     { controllerApplyCharacter();             }
/** Macro: Ctrl+Alt+4 */ function applyDialogue()      { controllerApplyDialogue();              }
/** Macro: Ctrl+Alt+5 */ function applyParenthetical() { controllerApplyFormat('PARENTHETICAL'); }
/** Macro: Ctrl+Alt+6 */ function applyTransition()    { controllerApplyFormat('TRANSITION');    }
                         function applyActBreak()       { controllerApplyFormat('ACT_BREAK');     }
                         function applyShot()           { controllerApplyFormat('SHOT');          }

// ============================================================================
// BRIDGES DE HERRAMIENTAS
// ============================================================================

function renumberScenes()        { controllerRenumberScenes();      }
function setupDocument()         { controllerSetupDocument();       }
function validateFormat()        { controllerValidateFormat();      }
function cleanFormat()           { controllerCleanFormat();         }
function showCharacterList()     { controllerShowCharacterList();   }
function searchCharacter()       { controllerSearchCharacter();     }
function insertTitlePage()       { controllerInsertTitlePage();     }
function insertSceneTemplate()   { controllerInsertSceneTemplate(); }
function openSidebar()           { controllerOpenSidebar();         }
function showKeyboardShortcuts() { controllerShowKeyboardShortcuts(); }
