/**
 * GUION MAKER - GOOGLE DOCS ADD-ON
 * Sistema de formateo profesional de guiones cinematográficos
 * 
 * ARQUITECTURA: Standalone Script - Add-on
 * PERMISOS: documents.currentonly (sin DriveApp)
 * VERSION: 3.0
 * 
 * @file Code.gs
 * @description Triggers del Add-on (onOpen, onInstall) y creación de menú
 * @author Guion Maker
 */

// ============================================================================
// TRIGGERS DE CICLO DE VIDA
// ============================================================================

/**
 * Trigger ejecutado al abrir el documento.
 * Gestiona correctamente el authMode para evitar errores en previsualización.
 * 
 * @param {Object} e - Event object con información de contexto
 */
function onOpen(e) {
  try {
    // Si se ejecuta manualmente desde el editor (sin evento)
    if (!e) {
      console.log('onOpen ejecutado manualmente. Creando menú...');
      createAddonMenu();
      return;
    }
    
    // Verificar si tenemos acceso a la UI
    // En modo NONE (previsualización), no podemos crear menús
    if (e.authMode === ScriptApp.AuthMode.NONE) {
      console.log('authMode NONE - No se puede crear menú en previsualización');
      return;
    }
    
    createAddonMenu();
    
  } catch (error) {
    console.error('Error en onOpen:', error);
    // En caso de error, fallar silenciosamente
    // (no podemos mostrar alerts si no hay permisos)
  }
}

/**
 * Trigger ejecutado al instalar el Add-on.
 * Llama a onOpen inmediatamente para que el usuario vea el menú.
 * 
 * @param {Object} e - Event object con información de instalación
 */
function onInstall(e) {
  try {
    onOpen(e);
  } catch (error) {
    console.error('Error en onInstall:', error);
  }
}

/**
 * Trigger para homepage del Add-on (opcional).
 * Se ejecuta cuando el Add-on se abre desde el marketplace.
 */
function onHomepage(e) {
  // Por ahora, retornar un mensaje simple
  // En el futuro podría retornar una Card UI
  return null;
}

/**
 * Trigger ejecutado cuando se conceden permisos de archivo.
 * Útil para inicializar el documento tras conceder permisos.
 * 
 * @param {Object} e - Event object
 */
function onFileScopeGranted(e) {
  try {
    onOpen(e);
  } catch (error) {
    console.error('Error en onFileScopeGranted:', error);
  }
}

// ============================================================================
// CREACIÓN DE MENÚ
// ============================================================================

/**
 * Crea el menú del Add-on en Google Docs.
 * Replica exactamente la estructura de v2.
 */
function createAddonMenu() {
  try {
    var ui = DocumentApp.getUi();
    
    ui.createAddonMenu()
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
    
    console.log('✅ Menú creado correctamente');
  } catch (error) {
    console.error('❌ Error al crear menú:', error);
    throw error;
  }
}

// ============================================================================
// HANDLERS DE MENÚ (Bridge a Controller)
// ============================================================================
// Todas las funciones de menú simplemente llaman al Controller

function applySceneHeading() {
  controllerApplyFormat('SCENE_HEADING');
}

function applyAction() {
  controllerApplyFormat('ACTION');
}

function applyCharacter() {
  controllerApplyFormat('CHARACTER');
}

function applyDialogue() {
  controllerApplyFormat('DIALOGUE');
}

function applyParenthetical() {
  controllerApplyFormat('PARENTHETICAL');
}

function applyTransition() {
  controllerApplyFormat('TRANSITION');
}

function applyActBreak() {
  controllerApplyFormat('ACT_BREAK');
}

function applyShot() {
  controllerApplyFormat('SHOT');
}

function setupDocument() {
  controllerSetupDocument();
}

function renumberScenes() {
  controllerRenumberScenes();
}

function validateFormat() {
  controllerValidateFormat();
}

function cleanFormat() {
  controllerCleanFormat();
}

function showCharacterList() {
  controllerShowCharacterList();
}

function countDialoguesByCharacter() {
  controllerCountDialogues();
}

function searchCharacter() {
  controllerSearchCharacter();
}

function insertTitlePage() {
  controllerInsertTitlePage();
}

function insertSceneTemplate() {
  controllerInsertSceneTemplate();
}

function openSidebar() {
  controllerOpenSidebar();
}

function showKeyboardShortcuts() {
  controllerShowKeyboardShortcuts();
}

// Función adicional para compatibilidad con Fountain
function applyFountainFormat() {
  controllerFormatFountain();
}

// ============================================================================
// FUNCIÓN DE PRUEBA (Solo para desarrollo)
// ============================================================================

/**
 * Función de prueba para crear el menú manualmente.
 * Ejecuta esta función desde el editor de Apps Script.
 */
function testCreateMenu() {
  try {
    console.log('🧪 Iniciando prueba de creación de menú...');
    createAddonMenu();
    console.log('✅ Menú creado. Ve al documento y recarga (F5) para verlo.');
  } catch (error) {
    console.error('❌ Error al crear menú:', error);
    console.log('💡 Asegúrate de que el documento esté abierto y tengas permisos.');
  }
}
