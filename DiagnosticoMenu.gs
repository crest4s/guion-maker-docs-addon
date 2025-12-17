/**
 * PRUEBA DESDE EL MENÚ
 * Esta función simula exactamente lo que hace el menú
 */

function pruebaDesdeMenuDirecta() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    body.clear();
    
    // Crear un párrafo con texto como lo haría el usuario
    const p = body.appendParagraph('John Smith');
    
    // Simular que el usuario hace clic en el menú
    // Posicionar cursor en el párrafo
    doc.setCursor(doc.newPosition(p.editAsText(), 5));
    
    // Llamar a la función EXACTA que usa el menú
    aplicarEstiloASeleccion('PERSONAJE');
    
    // Verificar resultado
    const sangria = p.getIndentStart();
    const sangriaFirstLine = p.getIndentFirstLine();
    const texto = p.getText();
    
    const reporte = 
      'PRUEBA DESDE MENÚ\n' +
      '═══════════════════\n\n' +
      'Texto resultante: "' + texto + '"\n' +
      'IndentStart: ' + sangria + 'pt (esperado: 144pt)\n' +
      'IndentFirstLine: ' + sangriaFirstLine + 'pt (esperado: 144pt)\n' +
      'IndentEnd: ' + p.getIndentEnd() + 'pt (esperado: 0pt)\n\n' +
      '¿Se ve "' + texto + '" indentado?\n\n' +
      'Valores correctos: ' + (sangria === 144 && sangriaFirstLine === 144 ? 'SÍ ✓' : 'NO ✗');
    
    Logger.log(reporte);
    DocumentApp.getUi().alert(reporte);
    
  } catch (error) {
    DocumentApp.getUi().alert('ERROR: ' + error.message + '\n\n' + error.stack);
    Logger.log('Error: ' + error.stack);
  }
}

/**
 * Comparar el comportamiento de aplicarEstiloAParrafo vs aplicarEstiloDirecto
 */
function compararMetodos() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    body.clear();
    
    body.appendParagraph('COMPARACIÓN DE MÉTODOS').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
    body.appendParagraph('');
    
    // MÉTODO 1: aplicarEstiloAParrafo (del menú)
    body.appendParagraph('MÉTODO 1: aplicarEstiloAParrafo() [Formateo.gs]').setBold(true);
    const p1 = body.appendParagraph('John Smith - Método 1');
    aplicarEstiloAParrafo(p1, 'PERSONAJE');
    body.appendParagraph('IndentStart: ' + p1.getIndentStart() + 'pt | IndentFirstLine: ' + p1.getIndentFirstLine() + 'pt');
    body.appendParagraph('');
    
    // MÉTODO 2: aplicarEstiloDirecto (de pruebas)
    body.appendParagraph('MÉTODO 2: aplicarEstiloDirecto() [Pruebas.gs]').setBold(true);
    const p2 = body.appendParagraph('John Smith - Método 2');
    aplicarEstiloDirecto(p2, ESTILOS_GUION.PERSONAJE);
    body.appendParagraph('IndentStart: ' + p2.getIndentStart() + 'pt | IndentFirstLine: ' + p2.getIndentFirstLine() + 'pt');
    body.appendParagraph('');
    
    // Comparación visual
    body.appendParagraph('═══════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('COMPARACIÓN VISUAL').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
    body.appendParagraph('═══════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('');
    body.appendParagraph('¿Ambos "John Smith" se ven en la MISMA posición indentada?');
    body.appendParagraph('');
    body.appendParagraph('SÍ = El código es idéntico, problema puede ser de caché');
    body.appendParagraph('NO = Hay diferencia en la implementación');
    
    DocumentApp.getUi().alert(
      'Comparación completada.\n\n' +
      'Método 1 (menú):\n' +
      '  IndentStart: ' + p1.getIndentStart() + 'pt\n' +
      '  IndentFirstLine: ' + p1.getIndentFirstLine() + 'pt\n\n' +
      'Método 2 (pruebas):\n' +
      '  IndentStart: ' + p2.getIndentStart() + 'pt\n' +
      '  IndentFirstLine: ' + p2.getIndentFirstLine() + 'pt\n\n' +
      '¿Se ven AMBOS indentados visualmente?'
    );
    
  } catch (error) {
    DocumentApp.getUi().alert('ERROR: ' + error.message);
    Logger.log('Error: ' + error.stack);
  }
}

/**
 * Verificar valores de ESTILOS_GUION
 */
function verificarEstilosGuion() {
  const personaje = ESTILOS_GUION.PERSONAJE;
  
  const reporte = 
    'CONFIGURACIÓN PERSONAJE\n' +
    '═══════════════════════\n\n' +
    'sangriaIzq: ' + personaje.sangriaIzq + 'pt\n' +
    'sangriaDer: ' + personaje.sangriaDer + 'pt\n' +
    'alineacion: ' + personaje.alineacion + '\n' +
    'mayusculas: ' + personaje.mayusculas + '\n' +
    'fuenteFamilia: ' + personaje.fuenteFamilia + '\n' +
    'fuenteTamano: ' + personaje.fuenteTamano;
  
  Logger.log(reporte);
  DocumentApp.getUi().alert(reporte);
}
