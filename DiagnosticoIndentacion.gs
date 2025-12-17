/**
 * DIAGNÓSTICO: Averiguar por qué setIndentStart() no funciona
 */

function diagnosticoIndentacion() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.clear();
  
  let reporte = 'DIAGNÓSTICO DE INDENTACIÓN\n';
  reporte += '═══════════════════════════════════\n\n';
  
  // TEST 1: Párrafo simple con texto
  const p1 = body.appendParagraph('Test 1: Párrafo con texto');
  p1.setIndentStart(144);
  const sangria1 = p1.getIndentStart();
  reporte += 'Test 1 - Párrafo con texto:\n';
  reporte += '  setIndentStart(144)\n';
  reporte += '  getIndentStart() = ' + sangria1 + '\n';
  reporte += '  ✓ = ' + (sangria1 === 144 ? 'SÍ' : 'NO') + '\n\n';
  
  // TEST 2: Párrafo vacío
  const p2 = body.appendParagraph('');
  p2.setIndentStart(144);
  const sangria2 = p2.getIndentStart();
  reporte += 'Test 2 - Párrafo vacío:\n';
  reporte += '  setIndentStart(144)\n';
  reporte += '  getIndentStart() = ' + sangria2 + '\n';
  reporte += '  ✓ = ' + (sangria2 === 144 ? 'SÍ' : 'NO') + '\n\n';
  
  // TEST 3: Aplicar texto DESPUÉS de indentación
  const p3 = body.appendParagraph('');
  p3.setIndentStart(144);
  p3.editAsText().setText('Test 3: Texto después de indent');
  const sangria3 = p3.getIndentStart();
  reporte += 'Test 3 - Texto después de setIndentStart:\n';
  reporte += '  setIndentStart(144) → setText()\n';
  reporte += '  getIndentStart() = ' + sangria3 + '\n';
  reporte += '  ✓ = ' + (sangria3 === 144 ? 'SÍ' : 'NO') + '\n\n';
  
  // TEST 4: Con setAttributes()
  const p4 = body.appendParagraph('Test 4: Con setAttributes');
  const attrs = {};
  attrs[DocumentApp.Attribute.INDENT_START] = 144;
  p4.setAttributes(attrs);
  const sangria4 = p4.getIndentStart();
  reporte += 'Test 4 - Usando setAttributes:\n';
  reporte += '  setAttributes({INDENT_START: 144})\n';
  reporte += '  getIndentStart() = ' + sangria4 + '\n';
  reporte += '  ✓ = ' + (sangria4 === 144 ? 'SÍ' : 'NO') + '\n\n';
  
  // TEST 5: Verificar atributos del párrafo
  const p5 = body.appendParagraph('Test 5: Verificar atributos');
  p5.setIndentStart(144);
  const attrs5 = p5.getAttributes();
  reporte += 'Test 5 - Atributos del párrafo:\n';
  reporte += '  INDENT_START = ' + attrs5[DocumentApp.Attribute.INDENT_START] + '\n';
  reporte += '  INDENT_END = ' + attrs5[DocumentApp.Attribute.INDENT_END] + '\n';
  reporte += '  INDENT_FIRST_LINE = ' + attrs5[DocumentApp.Attribute.INDENT_FIRST_LINE] + '\n\n';
  
  // TEST 6: Márgenes del documento
  reporte += 'Test 6 - Márgenes del documento:\n';
  reporte += '  Margen izquierdo = ' + body.getMarginLeft() + 'pt\n';
  reporte += '  Margen derecho = ' + body.getMarginRight() + 'pt\n';
  reporte += '  Ancho página = ' + body.getPageWidth() + 'pt\n\n';
  
  // TEST 7: Comparación visual
  body.appendParagraph('\n═══════════════════════════════════');
  body.appendParagraph('COMPARACIÓN VISUAL').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph('═══════════════════════════════════\n');
  
  const v1 = body.appendParagraph('0pt - Margen izquierdo');
  v1.setIndentStart(0);
  
  const v2 = body.appendParagraph('72pt - 1 pulgada');
  v2.setIndentStart(72);
  
  const v3 = body.appendParagraph('144pt - 2 pulgadas (PERSONAJE)');
  v3.setIndentStart(144);
  
  const v4 = body.appendParagraph('216pt - 3 pulgadas');
  v4.setIndentStart(216);
  
  const v5 = body.appendParagraph('288pt - 4 pulgadas');
  v5.setIndentStart(288);
  
  // Mostrar reporte
  Logger.log(reporte);
  DocumentApp.getUi().alert(reporte + '\n\n📋 Revisa el documento para ver si hay diferencias visuales entre los bloques.');
}

/**
 * Prueba aplicando formato COMPLETO como lo haría el sistema real
 */
function diagnosticoFormatoCompleto() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.clear();
  
  body.appendParagraph('PRUEBA DE FORMATO COMPLETO').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
  body.appendParagraph('');
  
  // Crear un párrafo y aplicar TODO el formato de PERSONAJE
  const parrafo = body.appendParagraph('JOHN SMITH');
  
  // Formato de texto
  const texto = parrafo.editAsText();
  texto.setFontFamily('Courier New');
  texto.setFontSize(12);
  texto.setBold(false);
  texto.setForegroundColor('#000000');
  
  // Formato de párrafo (PERSONAJE según ESTILOS_GUION)
  parrafo.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  parrafo.setIndentFirstLine(0);
  parrafo.setIndentStart(144);  // 2.0 pulgadas
  parrafo.setIndentEnd(0);
  parrafo.setSpacingBefore(6);
  parrafo.setSpacingAfter(0);
  parrafo.setLineSpacing(1.0);
  
  // Verificar
  const sangriaFinal = parrafo.getIndentStart();
  
  body.appendParagraph('');
  body.appendParagraph('Sangría aplicada: ' + sangriaFinal + 'pt (esperado: 144pt)');
  body.appendParagraph('Alineación: ' + parrafo.getAlignment());
  body.appendParagraph('');
  body.appendParagraph('¿Se ve "JOHN SMITH" indentado a la derecha?');
  
  // Crear segundo párrafo SIN formato para comparar
  body.appendParagraph('');
  const p2 = body.appendParagraph('COMPARACIÓN sin formato (debería estar al margen izquierdo)');
  
  DocumentApp.getUi().alert(
    'Formato aplicado.\n\n' +
    'Sangría reportada: ' + sangriaFinal + 'pt\n\n' +
    '¿Ves "JOHN SMITH" más a la derecha que "COMPARACIÓN"?\n\n' +
    'SÍ = La indentación funciona\n' +
    'NO = Hay un problema de visualización'
  );
}
