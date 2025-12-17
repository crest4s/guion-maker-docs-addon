/**
 * PRUEBAS DEL SISTEMA DE FORMATEO SEGURO
 * 
 * Ejecuta estas funciones desde el editor de scripts para verificar
 * que el bug de indentación está resuelto.
 */

// ============================================================================
// PRUEBAS BÁSICAS
// ============================================================================

/**
 * PRUEBA SIMPLE: Solo verificar que el código funciona
 */
function test_Simple() {
  try {
    DocumentApp.getUi().alert('✅ Las pruebas están funcionando correctamente.');
    Logger.log('Test simple ejecutado correctamente');
  } catch (error) {
    Logger.log('Error en test simple: ' + error.message);
  }
}

/**
 * PRUEBA 1: Párrafo vacío con formato de Personaje
 * 
 * ANTES: La sangría no se aplicaba visualmente
 * DESPUÉS: El cursor se mueve instantáneamente a 144pt del margen
 */
function test_ParrafoVacioPersonaje() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Crear párrafo vacío
  const parrafo = body.appendParagraph('');
  
  // Posicionar cursor
  const posicion = doc.newPosition(parrafo.editAsText(), 0);
  doc.setCursor(posicion);
  
  // Aplicar formato
  applyCharacter();
  
  // Verificar
  const sangriaReal = parrafo.getIndentStart();
  Logger.log('Test 1 - Sangría aplicada: ' + sangriaReal + 'pt (esperado: 144pt)');
  
  if (sangriaReal === 144) {
    DocumentApp.getUi().alert('✅ TEST 1 PASADO: Párrafo vacío formateado correctamente');
  } else {
    DocumentApp.getUi().alert('❌ TEST 1 FALLIDO: Sangría = ' + sangriaReal);
  }
}

/**
 * PRUEBA 2: Párrafo con texto existente
 * 
 * Verifica que el reseteo de estilos funcione
 */
function test_ParrafoConTextoExistente() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Crear párrafo con texto y formato incorrecto
  const parrafo = body.appendParagraph('John Smith');
  parrafo.setIndentStart(0); // Formato incorrecto inicial
  parrafo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  // Posicionar cursor
  const posicion = doc.newPosition(parrafo.editAsText(), 5);
  doc.setCursor(posicion);
  
  // Aplicar formato correcto
  applyCharacter();
  
  // Verificar
  const sangria = parrafo.getIndentStart();
  const alineacion = parrafo.getAlignment();
  const texto = parrafo.getText();
  
  Logger.log('Test 2 - Sangría: ' + sangria);
  Logger.log('Test 2 - Alineación: ' + alineacion);
  Logger.log('Test 2 - Texto: ' + texto);
  
  const pasado = (
    sangria === 144 &&
    alineacion === DocumentApp.HorizontalAlignment.LEFT &&
    texto === 'JOHN SMITH' // Debe estar en mayúsculas
  );
  
  if (pasado) {
    DocumentApp.getUi().alert('✅ TEST 2 PASADO: Reseteo y formato aplicado correctamente');
  } else {
    DocumentApp.getUi().alert('❌ TEST 2 FALLIDO: Verificar logs');
  }
}

/**
 * PRUEBA 3: Cursor en elemento Text (caso más común del bug)
 * 
 * ANTES: El cursor apuntaba a Text, no a Paragraph → No se aplicaba formato
 * DESPUÉS: La función sube por el árbol DOM y encuentra el Paragraph
 */
function test_CursorEnText() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Crear párrafo con texto
  const parrafo = body.appendParagraph('Este es un diálogo de prueba');
  
  // Posicionar cursor en MEDIO del texto (apunta a Text, no Paragraph)
  const textoElement = parrafo.editAsText();
  const posicion = doc.newPosition(textoElement, 10);
  doc.setCursor(posicion);
  
  // Verificar que el cursor está en Text
  const cursor = doc.getCursor();
  const tipoElemento = cursor.getElement().getType();
  Logger.log('Test 3 - Tipo de elemento del cursor: ' + tipoElemento);
  
  // Aplicar formato
  applyDialogue();
  
  // Verificar que se aplicó al Paragraph padre
  const sangriaIzq = parrafo.getIndentStart();
  const sangriaDer = parrafo.getIndentEnd();
  
  Logger.log('Test 3 - Sangría izq: ' + sangriaIzq + 'pt (esperado: 108pt)');
  Logger.log('Test 3 - Sangría der: ' + sangriaDer + 'pt (esperado: 72pt)');
  
  const pasado = (sangriaIzq === 108 && sangriaDer === 72);
  
  if (pasado) {
    DocumentApp.getUi().alert('✅ TEST 3 PASADO: Formato aplicado desde cursor en Text');
  } else {
    DocumentApp.getUi().alert('❌ TEST 3 FALLIDO: Sangrías incorrectas');
  }
}

/**
 * PRUEBA 4: Múltiples formatos consecutivos
 * 
 * Verifica que aplicar múltiples formatos no genere conflictos
 */
function test_MultiplesFormatos() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Crear escena, personaje, diálogo
  const p1 = body.appendParagraph('');
  const p2 = body.appendParagraph('');
  const p3 = body.appendParagraph('');
  
  // Formatear escena
  doc.setCursor(doc.newPosition(p1.editAsText(), 0));
  p1.editAsText().setText('INT. CAFETERÍA - DÍA');
  applyScene();
  
  // Formatear personaje
  doc.setCursor(doc.newPosition(p2.editAsText(), 0));
  p2.editAsText().setText('JOHN');
  applyCharacter();
  
  // Formatear diálogo
  doc.setCursor(doc.newPosition(p3.editAsText(), 0));
  p3.editAsText().setText('Hola, ¿cómo estás?');
  applyDialogue();
  
  // Verificar
  const s1 = p1.getIndentStart();
  const s2 = p2.getIndentStart();
  const s3 = p3.getIndentStart();
  
  Logger.log('Test 4 - Escena sangría: ' + s1 + ' (esperado: 0)');
  Logger.log('Test 4 - Personaje sangría: ' + s2 + ' (esperado: 144)');
  Logger.log('Test 4 - Diálogo sangría: ' + s3 + ' (esperado: 108)');
  
  const pasado = (s1 === 0 && s2 === 144 && s3 === 108);
  
  if (pasado) {
    DocumentApp.getUi().alert('✅ TEST 4 PASADO: Múltiples formatos aplicados correctamente');
  } else {
    DocumentApp.getUi().alert('❌ TEST 4 FALLIDO: Verificar logs');
  }
}

/**
 * PRUEBA 5: Layout se recalcula inmediatamente
 * 
 * Verifica que el zero-width space y el dirty flag funcionen
 */
function test_LayoutRecalculoInmediato() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Crear párrafo COMPLETAMENTE vacío
  const parrafo = body.appendParagraph('');
  doc.setCursor(doc.newPosition(parrafo.editAsText(), 0));
  
  // Verificar que está vacío
  const textoAntes = parrafo.getText();
  Logger.log('Test 5 - Texto antes: "' + textoAntes + '" (length: ' + textoAntes.length + ')');
  
  // Aplicar formato
  applyTransition();
  
  // Verificar que ahora tiene contenido (zero-width space o texto)
  const textoDespues = parrafo.getText();
  Logger.log('Test 5 - Texto después: "' + textoDespues + '" (length: ' + textoDespues.length + ')');
  
  // Verificar sangría
  const sangria = parrafo.getIndentStart();
  Logger.log('Test 5 - Sangría: ' + sangria + 'pt (esperado: 468pt)');
  
  const pasado = (textoDespues.length > 0 && sangria === 468);
  
  if (pasado) {
    DocumentApp.getUi().alert('✅ TEST 5 PASADO: Layout recalculado inmediatamente');
  } else {
    DocumentApp.getUi().alert('❌ TEST 5 FALLIDO: Layout no actualizado');
  }
}

// ============================================================================
// SUITE COMPLETA DE PRUEBAS
// ============================================================================

/**
 * Ejecuta todas las pruebas en secuencia.
 * 
 * CÓMO USAR:
 * 1. Abre un Google Doc vacío
 * 2. Abre el editor de scripts (Extensiones → Apps Script)
 * 3. Ejecuta esta función
 * 4. Verifica que todas las pruebas pasan
 */
function ejecutarTodasLasPruebas() {
  const ui = DocumentApp.getUi();
  
  const respuesta = ui.alert(
    'Ejecutar Suite de Pruebas',
    'Esto creará varios párrafos de prueba en el documento.\n\n¿Continuar?',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (respuesta !== ui.Button.OK) {
    return;
  }
  
  // Limpiar documento
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.clear();
  
  body.appendParagraph('═══════════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph('SUITE DE PRUEBAS - FORMATEO SEGURO').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph('═══════════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph('');
  
  // Ejecutar pruebas
  try {
    body.appendParagraph('TEST 1: Párrafo vacío con formato de Personaje').setBold(true);
    test_ParrafoVacioPersonaje();
    Utilities.sleep(500);
    
    body.appendParagraph('').appendParagraph('TEST 2: Párrafo con texto existente').setBold(true);
    test_ParrafoConTextoExistente();
    Utilities.sleep(500);
    
    body.appendParagraph('').appendParagraph('TEST 3: Cursor en elemento Text').setBold(true);
    test_CursorEnText();
    Utilities.sleep(500);
    
    body.appendParagraph('').appendParagraph('TEST 4: Múltiples formatos consecutivos').setBold(true);
    test_MultiplesFormatos();
    Utilities.sleep(500);
    
    body.appendParagraph('').appendParagraph('TEST 5: Layout recalculo inmediato').setBold(true);
    test_LayoutRecalculoInmediato();
    
    // Resumen
    body.appendParagraph('');
    body.appendParagraph('═══════════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('PRUEBAS COMPLETADAS').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('Verifica los resultados en los diálogos').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('═══════════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    
    ui.alert('✅ Suite de pruebas completada. Verifica los resultados anteriores.');
    
  } catch (error) {
    ui.alert('❌ Error en las pruebas: ' + error.message);
    Logger.log('Error: ' + error.stack);
  }
}

// ============================================================================
// PRUEBAS VISUALES
// ============================================================================

/**
 * Crea un documento de ejemplo con todos los tipos de bloque.
 * Útil para verificar visualmente que las sangrías son correctas.
 * VERSIÓN SIMPLIFICADA SIN DEPENDENCIAS EXTERNAS
 */
function crearDocumentoEjemplo() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    body.clear();
    
    // Título
    const titulo = body.appendParagraph('EJEMPLO DE FORMATEO CORRECTO');
    titulo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    titulo.setBold(true);
    titulo.setSpacingAfter(24);
    
    body.appendParagraph('');
    
    // Escena
    const escena = body.appendParagraph('INT. CAFETERÍA - DÍA');
    aplicarEstiloDirecto(escena, ESTILOS_GUION.ESCENA);
    
    // Acción
    const accion = body.appendParagraph('John entra en la cafetería y busca una mesa.');
    aplicarEstiloDirecto(accion, ESTILOS_GUION.ACCION);
    
    // Personaje
    const personaje = body.appendParagraph('JOHN');
    aplicarEstiloDirecto(personaje, ESTILOS_GUION.PERSONAJE);
    
    // Diálogo
    const dialogo = body.appendParagraph('Hola, quisiera un café con leche, por favor.');
    aplicarEstiloDirecto(dialogo, ESTILOS_GUION.DIALOGO);
    
    // Parentético
    const parentetico = body.appendParagraph('(sonriendo)');
    aplicarEstiloDirecto(parentetico, ESTILOS_GUION.PARENTETICO);
    
    // Diálogo continuo
    const dialogo2 = body.appendParagraph('Y una galleta de chocolate.');
    aplicarEstiloDirecto(dialogo2, ESTILOS_GUION.DIALOGO);
    
    // Transición
    const transicion = body.appendParagraph('CORTE A:');
    aplicarEstiloDirecto(transicion, ESTILOS_GUION.TRANSICION);
    
    DocumentApp.getUi().alert(
      '✅ Documento de ejemplo creado.\n\n' +
      'Verifica visualmente que:\n' +
      '- Escena: margen izquierdo (0pt)\n' +
      '- Acción: margen izquierdo (0pt)\n' +
      '- Personaje: sangría 144pt (~2.0")\n' +
      '- Diálogo: sangría 108pt izq + 72pt der\n' +
      '- Parentético: sangría 126pt izq + 90pt der\n' +
      '- Transición: sangría 468pt (~6.5")'
    );
  } catch (error) {
    Logger.log('Error: ' + error.message);
    DocumentApp.getUi().alert('Error: ' + error.message);
  }
}

/**
 * Función auxiliar para aplicar estilo directamente sin usar FormateoSeguro.gs
 * SOLUCIÓN REAL: Borrar texto, aplicar indentación, reescribir texto
 */
function aplicarEstiloDirecto(parrafo, config) {
  const texto = parrafo.editAsText();
  const contenidoOriginal = texto.getText();
  
  // PASO 1: GUARDAR y BORRAR el texto existente
  const backup = contenidoOriginal;
  if (backup.length > 0) {
    texto.deleteText(0, backup.length - 1);
  }
  
  // PASO 2: RESETEAR el párrafo (ahora vacío)
  parrafo.setIndentFirstLine(0);
  parrafo.setIndentStart(0);
  parrafo.setIndentEnd(0);
  parrafo.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  parrafo.setSpacingBefore(0);
  parrafo.setSpacingAfter(0);
  parrafo.setLineSpacing(1.0);
  
  // PASO 3: APLICAR indentación al párrafo VACÍO
  parrafo.setAlignment(config.alineacion);
  parrafo.setIndentStart(config.sangriaIzq);
  parrafo.setIndentEnd(config.sangriaDer);
  parrafo.setIndentFirstLine(config.sangriaIzq); // CRÍTICO: La primera línea también debe moverse
  parrafo.setSpacingBefore(config.espacioAntes);
  parrafo.setSpacingAfter(config.espacioDespues);
  parrafo.setLineSpacing(config.interlineado);
  
  // PASO 4: REESCRIBIR el texto (ahora se renderiza en la posición correcta)
  let contenidoFinal = backup;
  if (config.mayusculas && contenidoFinal.length > 0) {
    contenidoFinal = contenidoFinal.toUpperCase();
  }
  texto.setText(contenidoFinal);
  
  // PASO 5: Aplicar formato de texto
  texto.setFontFamily(config.fuenteFamilia);
  texto.setFontSize(config.fuenteTamano);
  texto.setBold(config.negrita || false);
  texto.setItalic(config.italica || false);
  
  if (config.color) {
    texto.setForegroundColor(config.color);
  }
}
