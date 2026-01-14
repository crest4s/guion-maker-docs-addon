/**
 * GUION MAKER - TESTS
 * Suite básica de tests para verificar funcionalidad
 * 
 * @file TESTS.gs
 * @description Tests manuales para ejecutar en Apps Script
 * @note NO incluir este archivo en el despliegue final
 */

// ============================================================================
// TESTS DE CONFIGURACIÓN
// ============================================================================

/**
 * Test 1: Verificar que el scope es correcto
 */
function test_verifyScope() {
  var scopes = ScriptApp.getOAuthToken(); // Esto fuerza verificación de scopes
  Logger.log('✅ TEST 1: Scopes verificados correctamente');
  Logger.log('Token OAuth generado (scopes están configurados)');
}

/**
 * Test 2: Verificar que NO se usa DriveApp
 */
function test_noDriveAppUsed() {
  try {
    // Buscar cualquier referencia a DriveApp en el código
    var codeFiles = [
      'Code.gs',
      'Controller.gs', 
      'Logic.gs'
    ];
    
    // Este test es manual - revisar visualmente
    Logger.log('⚠️  TEST 2: Revisar manualmente que NO hay referencias a DriveApp');
    Logger.log('Buscar "DriveApp" en todos los archivos');
    Logger.log('✅ Si no encontraste nada: TEST PASADO');
  } catch (error) {
    Logger.log('❌ TEST 2 FALLIDO: ' + error.message);
  }
}

// ============================================================================
// TESTS DE TRIGGERS
// ============================================================================

/**
 * Test 3: Simular onOpen con authMode NONE
 */
function test_onOpenWithAuthModeNone() {
  try {
    var mockEvent = {
      authMode: ScriptApp.AuthMode.NONE
    };
    
    onOpen(mockEvent);
    
    Logger.log('✅ TEST 3: onOpen con authMode NONE no genera error');
    Logger.log('El menú NO debe crearse en este modo');
  } catch (error) {
    Logger.log('❌ TEST 3 FALLIDO: ' + error.message);
  }
}

/**
 * Test 4: Simular onOpen con authMode FULL
 */
function test_onOpenWithAuthModeFull() {
  try {
    var mockEvent = {
      authMode: ScriptApp.AuthMode.FULL
    };
    
    onOpen(mockEvent);
    
    Logger.log('✅ TEST 4: onOpen con authMode FULL ejecutado');
    Logger.log('El menú DEBE crearse en este modo');
  } catch (error) {
    Logger.log('❌ TEST 4 FALLIDO: ' + error.message);
  }
}

/**
 * Test 5: Verificar que onInstall llama a onOpen
 */
function test_onInstall() {
  try {
    var mockEvent = {
      authMode: ScriptApp.AuthMode.FULL
    };
    
    onInstall(mockEvent);
    
    Logger.log('✅ TEST 5: onInstall ejecutado correctamente');
  } catch (error) {
    Logger.log('❌ TEST 5 FALLIDO: ' + error.message);
  }
}

// ============================================================================
// TESTS DE FORMATEO
// ============================================================================

/**
 * Test 6: Verificar configuración de formatos
 */
function test_formatConfig() {
  try {
    // Verificar que FORMAT_CONFIG existe y tiene los formatos correctos
    var requiredFormats = [
      'SCENE_HEADING',
      'ACTION',
      'CHARACTER',
      'DIALOGUE',
      'PARENTHETICAL',
      'TRANSITION',
      'ACT_BREAK',
      'SHOT'
    ];
    
    var allExist = requiredFormats.every(function(format) {
      return FORMAT_CONFIG[format] !== undefined;
    });
    
    if (allExist) {
      Logger.log('✅ TEST 6: Todos los formatos están configurados');
      Logger.log('Formatos encontrados: ' + requiredFormats.length);
    } else {
      Logger.log('❌ TEST 6 FALLIDO: Faltan formatos en FORMAT_CONFIG');
    }
  } catch (error) {
    Logger.log('❌ TEST 6 FALLIDO: ' + error.message);
  }
}

/**
 * Test 7: Verificar que los valores de indentación son numéricos
 */
function test_indentationValues() {
  try {
    var hasNonNumeric = false;
    
    for (var format in FORMAT_CONFIG) {
      var config = FORMAT_CONFIG[format];
      
      if (config.indentStart !== undefined && typeof config.indentStart !== 'number') {
        Logger.log('❌ indentStart no es número en ' + format);
        hasNonNumeric = true;
      }
      
      if (config.indentEnd !== undefined && typeof config.indentEnd !== 'number') {
        Logger.log('❌ indentEnd no es número en ' + format);
        hasNonNumeric = true;
      }
    }
    
    if (!hasNonNumeric) {
      Logger.log('✅ TEST 7: Todas las indentaciones son valores numéricos');
    } else {
      Logger.log('❌ TEST 7 FALLIDO: Hay valores no numéricos');
    }
  } catch (error) {
    Logger.log('❌ TEST 7 FALLIDO: ' + error.message);
  }
}

// ============================================================================
// TESTS DE LÓGICA DE NEGOCIO
// ============================================================================

/**
 * Test 8: Verificar detección de tipo Fountain
 */
function test_fountainDetection() {
  try {
    var tests = [
      { text: 'INT. CASA - DÍA', expected: 'SCENE_HEADING' },
      { text: 'EXT. CALLE - NOCHE', expected: 'SCENE_HEADING' },
      { text: 'CUT TO:', expected: 'TRANSITION' },
      { text: 'FADE OUT:', expected: 'TRANSITION' },
      { text: 'JUAN', expected: 'CHARACTER' },
      { text: 'MARÍA (V.O.)', expected: 'CHARACTER' },
      { text: '(susurrando)', expected: 'PARENTHETICAL' },
      { text: 'Texto normal de acción', expected: 'ACTION' }
    ];
    
    var allPassed = true;
    
    tests.forEach(function(test) {
      var detected = detectFountainBlockType(test.text, null);
      if (detected !== test.expected) {
        Logger.log('❌ Detección incorrecta: "' + test.text + '" → ' + detected + ' (esperado: ' + test.expected + ')');
        allPassed = false;
      }
    });
    
    if (allPassed) {
      Logger.log('✅ TEST 8: Detección Fountain funciona correctamente');
      Logger.log('Tests pasados: ' + tests.length);
    } else {
      Logger.log('❌ TEST 8 FALLIDO: Algunos tipos no se detectan correctamente');
    }
  } catch (error) {
    Logger.log('❌ TEST 8 FALLIDO: ' + error.message);
  }
}

/**
 * Test 9: Verificar traducción de transiciones
 */
function test_transitionTranslation() {
  try {
    var tests = [
      { input: 'CORTE A:', expected: 'CUT TO:' },
      { input: 'FUNDIDO A NEGRO:', expected: 'FADE OUT:' },
      { input: 'FUNDIDO A:', expected: 'FADE TO:' },
      { input: 'DISOLVENCIA A:', expected: 'DISSOLVE TO:' }
    ];
    
    var allPassed = true;
    
    tests.forEach(function(test) {
      var translated = convertTransitionToEnglish(test.input);
      if (translated !== test.expected) {
        Logger.log('❌ Traducción incorrecta: "' + test.input + '" → ' + translated + ' (esperado: ' + test.expected + ')');
        allPassed = false;
      }
    });
    
    if (allPassed) {
      Logger.log('✅ TEST 9: Traducción de transiciones funciona correctamente');
      Logger.log('Tests pasados: ' + tests.length);
    } else {
      Logger.log('❌ TEST 9 FALLIDO: Algunas traducciones son incorrectas');
    }
  } catch (error) {
    Logger.log('❌ TEST 9 FALLIDO: ' + error.message);
  }
}

// ============================================================================
// TESTS DE INTEGRACIÓN (Requieren documento activo)
// ============================================================================

/**
 * Test 10: Verificar que se puede obtener documento activo
 * NOTA: Este test requiere tener un documento abierto
 */
function test_getActiveDocument() {
  try {
    var doc = DocumentApp.getActiveDocument();
    
    if (doc) {
      Logger.log('✅ TEST 10: Documento activo obtenido correctamente');
      Logger.log('Nombre del documento: ' + doc.getName());
    } else {
      Logger.log('❌ TEST 10 FALLIDO: No se pudo obtener documento activo');
    }
  } catch (error) {
    Logger.log('⚠️  TEST 10: Requiere documento abierto');
    Logger.log('Error: ' + error.message);
  }
}

/**
 * Test 11: Verificar configuración de documento
 * NOTA: Este test MODIFICA el documento activo
 */
function test_setupDocument() {
  try {
    setupDocumentStandards();
    
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    
    // Verificar márgenes
    var marginLeft = body.getMarginLeft();
    var expectedMarginLeft = 108; // 1.5 in
    
    if (Math.abs(marginLeft - expectedMarginLeft) <= 2) {
      Logger.log('✅ TEST 11: Configuración de documento aplicada correctamente');
      Logger.log('Margen izquierdo: ' + marginLeft + 'pt (esperado: ' + expectedMarginLeft + 'pt)');
    } else {
      Logger.log('❌ TEST 11 FALLIDO: Márgenes incorrectos');
      Logger.log('Margen izquierdo: ' + marginLeft + 'pt (esperado: ' + expectedMarginLeft + 'pt)');
    }
  } catch (error) {
    Logger.log('❌ TEST 11 FALLIDO: ' + error.message);
  }
}

/**
 * Test 12: Verificar aplicación de formato SCENE_HEADING
 * NOTA: Este test MODIFICA el documento activo
 */
function test_applySceneHeadingFormat() {
  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    
    // Crear párrafo de prueba
    var testPara = body.appendParagraph('INT. PRUEBA - DÍA');
    
    // Aplicar formato
    applyFormatToParagraph(testPara, 'SCENE_HEADING');
    
    // Verificar indentación
    var indent = testPara.getIndentStart();
    var expectedIndent = 0;
    
    // Verificar texto en mayúsculas
    var text = testPara.getText();
    var isUpperCase = text === text.toUpperCase();
    
    if (Math.abs(indent - expectedIndent) <= 2 && isUpperCase) {
      Logger.log('✅ TEST 12: Formato SCENE_HEADING aplicado correctamente');
      Logger.log('Indentación: ' + indent + 'pt, Mayúsculas: ' + isUpperCase);
      
      // Limpiar
      testPara.removeFromParent();
    } else {
      Logger.log('❌ TEST 12 FALLIDO: Formato incorrecto');
      Logger.log('Indentación: ' + indent + 'pt (esperado: ' + expectedIndent + 'pt)');
      Logger.log('Mayúsculas: ' + isUpperCase);
    }
  } catch (error) {
    Logger.log('❌ TEST 12 FALLIDO: ' + error.message);
  }
}

// ============================================================================
// TEST RUNNER - EJECUTAR TODOS LOS TESTS
// ============================================================================

/**
 * Ejecuta todos los tests básicos (sin documento)
 */
function runBasicTests() {
  Logger.log('🧪 EJECUTANDO TESTS BÁSICOS...\n');
  
  test_verifyScope();
  test_noDriveAppUsed();
  test_onOpenWithAuthModeNone();
  test_onOpenWithAuthModeFull();
  test_onInstall();
  test_formatConfig();
  test_indentationValues();
  test_fountainDetection();
  test_transitionTranslation();
  
  Logger.log('\n✅ TESTS BÁSICOS COMPLETADOS');
  Logger.log('Revisa los logs para ver resultados individuales');
}

/**
 * Ejecuta tests que requieren documento activo
 * ADVERTENCIA: Estos tests MODIFICAN el documento
 */
function runDocumentTests() {
  Logger.log('🧪 EJECUTANDO TESTS DE DOCUMENTO...\n');
  Logger.log('⚠️  ADVERTENCIA: Estos tests modificarán el documento activo\n');
  
  test_getActiveDocument();
  test_setupDocument();
  test_applySceneHeadingFormat();
  
  Logger.log('\n✅ TESTS DE DOCUMENTO COMPLETADOS');
  Logger.log('Revisa los logs para ver resultados individuales');
}

/**
 * Ejecuta TODOS los tests
 */
function runAllTests() {
  Logger.log('🧪 EJECUTANDO SUITE COMPLETA DE TESTS...\n');
  Logger.log('════════════════════════════════════════════\n');
  
  runBasicTests();
  
  Logger.log('\n════════════════════════════════════════════\n');
  
  runDocumentTests();
  
  Logger.log('\n════════════════════════════════════════════');
  Logger.log('🎉 SUITE COMPLETA DE TESTS FINALIZADA');
  Logger.log('════════════════════════════════════════════');
}

// ============================================================================
// INSTRUCCIONES DE USO
// ============================================================================

/**
 * CÓMO USAR ESTOS TESTS:
 * 
 * 1. Tests básicos (sin documento):
 *    - Ejecutar: runBasicTests()
 *    - No modifican nada
 *    - Verifican configuración y lógica
 * 
 * 2. Tests de documento (requieren documento activo):
 *    - Abrir un documento de Google Docs
 *    - Vincular este script al documento
 *    - Ejecutar: runDocumentTests()
 *    - ADVERTENCIA: Modificarán el documento
 * 
 * 3. Suite completa:
 *    - Ejecutar: runAllTests()
 *    - Combina todos los tests anteriores
 * 
 * 4. Ver resultados:
 *    - Ver → Registros de ejecución (en Apps Script)
 *    - Buscar ✅ (pasados) y ❌ (fallidos)
 */

Logger.log('📝 Tests cargados. Ejecuta runBasicTests(), runDocumentTests() o runAllTests()');
