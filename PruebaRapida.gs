/**
 * PRUEBA RÁPIDA E INDEPENDIENTE
 * Esta función NO depende de ningún otro archivo
 */

function pruebaRapida() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    
    // Limpiar documento
    body.clear();
    
    // Crear título
    body.appendParagraph('PRUEBA DE FORMATEO - ANTES Y DESPUÉS')
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
      .setBold(true);
    
    body.appendParagraph('');
    
    // ========== BLOQUE 1: SIN RESETEAR (MÉTODO ANTIGUO - INCORRECTO) ==========
    body.appendParagraph('1. MÉTODO ANTIGUO (puede fallar):').setBold(true);
    
    const p1 = body.appendParagraph('PERSONAJE');
    // Solo aplicar indentación sin resetear
    p1.setIndentStart(144);
    p1.setFontFamily('Courier New');
    p1.setFontSize(12);
    
    body.appendParagraph('Sangría aplicada: ' + p1.getIndentStart() + 'pt (esperado: 144pt)');
    body.appendParagraph('');
    
    // ========== BLOQUE 2: CON RESETEO (MÉTODO NUEVO - CORRECTO) ==========
    body.appendParagraph('2. MÉTODO NUEVO (con reseteo):').setBold(true);
    
    const p2 = body.appendParagraph('PERSONAJE');
    // RESETEAR primero (esto es lo que faltaba)
    p2.setIndentFirstLine(0);
    p2.setIndentStart(0);
    p2.setIndentEnd(0);
    p2.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
    // Ahora aplicar
    p2.setIndentStart(144);
    p2.setFontFamily('Courier New');
    p2.setFontSize(12);
    
    body.appendParagraph('Sangría aplicada: ' + p2.getIndentStart() + 'pt (esperado: 144pt)');
    body.appendParagraph('');
    
    // ========== BLOQUE 3: PÁRRAFO VACÍO (EL CASO CRÍTICO) ==========
    body.appendParagraph('3. PÁRRAFO VACÍO con formato:').setBold(true);
    
    const p3 = body.appendParagraph('');
    // Resetear
    p3.setIndentFirstLine(0);
    p3.setIndentStart(0);
    p3.setIndentEnd(0);
    p3.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
    // Aplicar
    p3.setIndentStart(144);
    p3.setFontFamily('Courier New');
    p3.setFontSize(12);
    // Forzar contenido mínimo
    p3.editAsText().setText('\u200B'); // Zero-width space
    
    body.appendParagraph('Sangría aplicada: ' + p3.getIndentStart() + 'pt (esperado: 144pt)');
    body.appendParagraph('¿Se ve el espacio vacío indentado? (debería estar a la derecha)');
    body.appendParagraph('');
    
    // ========== COMPARACIÓN VISUAL ==========
    body.appendParagraph('═══════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('COMPARACIÓN VISUAL').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setBold(true);
    body.appendParagraph('═══════════════════════════════════').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph('');
    
    // Crear varios bloques con diferentes sangrías
    crearBloqueEjemplo(body, 'Escena (0pt)', 0, 0);
    crearBloqueEjemplo(body, 'Acción (0pt)', 0, 0);
    crearBloqueEjemplo(body, 'Personaje (144pt)', 144, 0);
    crearBloqueEjemplo(body, 'Diálogo (108pt izq, 72pt der)', 108, 72);
    crearBloqueEjemplo(body, 'Parentético (126pt izq, 90pt der)', 126, 90);
    crearBloqueEjemplo(body, 'Transición (468pt)', 468, 0);
    
    // Mensaje final
    DocumentApp.getUi().alert(
      '✅ Prueba completada\n\n' +
      'Revisa el documento:\n' +
      '- Los bloques 1 y 2 deberían verse igual\n' +
      '- El bloque 3 (vacío) debería estar indentado\n' +
      '- Los bloques de comparación visual deberían tener diferentes sangrías\n\n' +
      'Si todos se ven en el margen izquierdo → el bug sigue\n' +
      'Si se ven indentados → la solución funciona'
    );
    
  } catch (error) {
    DocumentApp.getUi().alert('❌ ERROR: ' + error.message + '\n\nVer logs para más detalles.');
    Logger.log('Error completo: ' + error.stack);
  }
}

/**
 * Crea un bloque de ejemplo con sangría específica
 */
function crearBloqueEjemplo(body, etiqueta, sangriaIzq, sangriaDer) {
  const p = body.appendParagraph(etiqueta);
  
  // RESETEAR
  p.setIndentFirstLine(0);
  p.setIndentStart(0);
  p.setIndentEnd(0);
  p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  
  // APLICAR
  p.setIndentStart(sangriaIzq);
  p.setIndentEnd(sangriaDer);
  p.setFontFamily('Courier New');
  p.setFontSize(12);
  
  // Forzar recalculo
  const texto = p.getText();
  p.editAsText().setText(texto + '\u200B');
  p.editAsText().deleteText(texto.length, texto.length);
}

/**
 * Prueba super simple - solo un alert
 */
function pruebaMuySimple() {
  DocumentApp.getUi().alert('✅ El script está funcionando correctamente');
  Logger.log('Prueba muy simple ejecutada');
}

/**
 * Prueba de cursor y paragraph
 */
function pruebaGetParagraph() {
  const doc = DocumentApp.getActiveDocument();
  
  try {
    // Intentar obtener cursor
    const cursor = doc.getCursor();
    
    if (!cursor) {
      DocumentApp.getUi().alert('❌ No hay cursor. Haz clic en el documento primero.');
      return;
    }
    
    const elemento = cursor.getElement();
    const tipo = elemento.getType();
    
    Logger.log('Tipo de elemento: ' + tipo);
    
    // Intentar subir al paragraph
    let actual = elemento;
    let nivel = 0;
    let info = 'Navegación del cursor:\n';
    
    while (actual && nivel < 10) {
      const t = actual.getType();
      info += 'Nivel ' + nivel + ': ' + t + '\n';
      
      if (t === DocumentApp.ElementType.PARAGRAPH) {
        const p = actual.asParagraph();
        info += '\n✅ PARAGRAPH encontrado!\n';
        info += 'Texto: ' + p.getText() + '\n';
        info += 'Sangría actual: ' + p.getIndentStart() + 'pt';
        
        DocumentApp.getUi().alert(info);
        return;
      }
      
      actual = actual.getParent();
      nivel++;
    }
    
    DocumentApp.getUi().alert(info + '\n\n❌ No se encontró Paragraph');
    
  } catch (error) {
    DocumentApp.getUi().alert('❌ Error: ' + error.message);
    Logger.log('Error: ' + error.stack);
  }
}
