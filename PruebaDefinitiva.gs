/**
 * PRUEBA DEFINITIVA: Usa las funciones de FormateoSeguro.gs
 * Esta prueba DEBE mostrar el texto indentado visualmente
 */

function pruebaDefinitivaConFormateoSeguro() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    body.clear();
    
    // Título
    body.appendParagraph('PRUEBA DEFINITIVA CON FORMATEO SEGURO')
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
      .setBold(true);
    body.appendParagraph('');
    
    // ========== PRUEBA 1: Aplicar formato a párrafo con getActiveParagraphSafe ==========
    body.appendParagraph('1. Usando getActiveParagraphSafe() + applyIndentationSafe():').setBold(true);
    
    // Crear párrafo vacío
    const p1 = body.appendParagraph('');
    
    // Mover cursor ahí
    doc.setCursor(doc.newPosition(p1.editAsText(), 0));
    
    // Aplicar formato usando la función SEGURA
    const paragraph1 = getActiveParagraphSafe();
    applyIndentationSafe(paragraph1, ESTILOS_GUION.PERSONAJE);
    paragraph1.editAsText().setText('JOHN (con función segura)');
    
    body.appendParagraph('Sangría: ' + paragraph1.getIndentStart() + 'pt (esperado: 144pt)');
    body.appendParagraph('');
    
    // ========== PRUEBA 2: Múltiples bloques con formato seguro ==========
    body.appendParagraph('2. Secuencia completa de guion:').setBold(true);
    body.appendParagraph('');
    
    // Escena
    const escena = body.appendParagraph('INT. CAFETERÍA - DÍA');
    aplicarFormatoSeguroDirecto(escena, ESTILOS_GUION.ESCENA);
    
    // Acción
    const accion = body.appendParagraph('María entra y busca una mesa libre.');
    aplicarFormatoSeguroDirecto(accion, ESTILOS_GUION.ACCION);
    
    // Personaje
    const personaje = body.appendParagraph('MARÍA');
    aplicarFormatoSeguroDirecto(personaje, ESTILOS_GUION.PERSONAJE);
    
    // Diálogo
    const dialogo = body.appendParagraph('Hola, ¿está libre esta mesa?');
    aplicarFormatoSeguroDirecto(dialogo, ESTILOS_GUION.DIALOGO);
    
    // Parentético
    const parentetico = body.appendParagraph('(sonriendo)');
    aplicarFormatoSeguroDirecto(parentetico, ESTILOS_GUION.PARENTETICO);
    
    // Diálogo continuo
    const dialogo2 = body.appendParagraph('Me gustaría sentarme aquí.');
    aplicarFormatoSeguroDirecto(dialogo2, ESTILOS_GUION.DIALOGO);
    
    // Transición
    const transicion = body.appendParagraph('CORTE A:');
    aplicarFormatoSeguroDirecto(transicion, ESTILOS_GUION.TRANSICION);
    
    // ========== VERIFICACIÓN ==========
    body.appendParagraph('');
    body.appendParagraph('═══════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('VERIFICACIÓN VISUAL').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
    body.appendParagraph('═══════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('');
    
    body.appendParagraph('Deberías ver:');
    body.appendParagraph('✓ Escena y Acción: pegadas al margen izquierdo');
    body.appendParagraph('✓ MARÍA (Personaje): indentado ~2 pulgadas (144pt)');
    body.appendParagraph('✓ Diálogos: indentados ~1.5 pulgadas (108pt)');
    body.appendParagraph('✓ (sonriendo): más indentado que el diálogo');
    body.appendParagraph('✓ CORTE A:: casi en el margen derecho (~6.5 pulgadas)');
    
    DocumentApp.getUi().alert(
      '✅ Prueba completada.\n\n' +
      'Revisa el documento:\n\n' +
      '¿Se ven los bloques VISUALMENTE indentados?\n\n' +
      'SÍ = ✅ La solución funciona\n' +
      'NO = ❌ Necesitamos más ajustes'
    );
    
  } catch (error) {
    DocumentApp.getUi().alert('❌ ERROR: ' + error.message + '\n\nStack: ' + error.stack);
    Logger.log('Error: ' + error.stack);
  }
}

/**
 * Aplica formato seguro directamente (versión inline para pruebas)
 * Esta es una copia de applyIndentationSafe() para evitar problemas de scope
 */
function aplicarFormatoSeguroDirecto(paragraph, config) {
  const texto = paragraph.editAsText();
  let contenido = texto.getText();
  
  const estabaVacio = contenido.trim() === '';
  if (estabaVacio && contenido.length === 0) {
    texto.setText('\u200B');
    contenido = '\u200B';
  }
  
  // RESETEAR
  paragraph.setIndentFirstLine(0);
  paragraph.setIndentStart(0);
  paragraph.setIndentEnd(0);
  paragraph.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  paragraph.setSpacingBefore(0);
  paragraph.setSpacingAfter(0);
  paragraph.setLineSpacing(1.0);
  
  // Aplicar mayúsculas
  if (config.mayusculas && contenido && contenido !== '\u200B') {
    contenido = contenido.toUpperCase();
    texto.setText(contenido);
  }
  
  // Formato de texto
  texto.setFontFamily(config.fuenteFamilia || 'Courier New');
  texto.setFontSize(config.fuenteTamano || 12);
  texto.setBold(config.negrita || false);
  texto.setItalic(config.italica || false);
  texto.setForegroundColor(config.color || '#000000');
  
  // APLICAR INDENTACIÓN
  paragraph.setAlignment(config.alineacion || DocumentApp.HorizontalAlignment.LEFT);
  paragraph.setIndentStart(config.sangriaIzq || 0);
  paragraph.setIndentEnd(config.sangriaDer || 0);
  paragraph.setSpacingBefore(config.espacioAntes || 0);
  paragraph.setSpacingAfter(config.espacioDespues || 0);
  paragraph.setLineSpacing(config.interlineado || 1.0);
  
  // FORZAR RECALCULO VISUAL
  const contenidoFinal = texto.getText();
  if (contenidoFinal.length > 0) {
    // Insertar y eliminar espacio
    texto.appendText(' ');
    const len = texto.getText().length;
    texto.deleteText(len - 1, len - 1);
    
    // Cambiar y restaurar color (fuerza recalculo más profundo)
    const colorActual = texto.getForegroundColor(0) || '#000000';
    texto.setForegroundColor('#000001');
    texto.setForegroundColor(colorActual);
  }
}

/**
 * Prueba aplicando el formato directamente desde el menú
 */
function pruebaDesdeMenu() {
  // Esta función simula lo que hace el usuario desde el menú
  try {
    // El usuario escribe algo y luego aplica formato
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    
    body.clear();
    body.appendParagraph('PRUEBA DESDE MENÚ').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
    body.appendParagraph('');
    
    // Crear párrafo como lo haría el usuario
    const p = body.appendParagraph('John Smith');
    
    // Posicionar cursor (simula que el usuario hace clic)
    doc.setCursor(doc.newPosition(p.editAsText(), 5));
    
    // Ahora aplicar formato usando la función del menú
    convertirAPersonaje();
    
    // Verificar
    const sangria = p.getIndentStart();
    
    body.appendParagraph('');
    body.appendParagraph('Sangría aplicada: ' + sangria + 'pt (esperado: 144pt)');
    body.appendParagraph('¿Se ve "JOHN SMITH" indentado?');
    
    DocumentApp.getUi().alert(
      'Formato aplicado desde menú.\n\n' +
      'Sangría: ' + sangria + 'pt\n\n' +
      '¿Ves "JOHN SMITH" más a la derecha?'
    );
    
  } catch (error) {
    DocumentApp.getUi().alert('❌ ERROR: ' + error.message);
    Logger.log('Error: ' + error.stack);
  }
}
