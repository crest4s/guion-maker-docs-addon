/**
 * FORMATEO SEGURO - Solución al bug de indentación en Google Docs
 * 
 * Este archivo contiene las funciones correctas para aplicar formato
 * de guion, resolviendo los problemas de layout y elementos no-paragraph.
 */

// ============================================================================
// FUNCIONES CORE DE FORMATEO SEGURO
// ============================================================================

/**
 * Obtiene el Paragraph activo de forma segura, navegando el árbol DOM.
 * 
 * PROBLEMA RESUELTO:
 * - getCursor() devuelve Text, no Paragraph
 * - getParent() puede devolver ListItem u otros contenedores
 * - Párrafos vacíos no existen hasta crearlos explícitamente
 * 
 * @return {Paragraph} Párrafo válido garantizado
 */
function getActiveParagraphSafe() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // 1. Intentar con cursor primero (más preciso)
  const cursor = doc.getCursor();
  if (cursor) {
    let elemento = cursor.getElement();
    
    // Subir por el árbol hasta encontrar un Paragraph
    let intentos = 0;
    while (elemento && intentos < 10) {
      const tipo = elemento.getType();
      
      if (tipo === DocumentApp.ElementType.PARAGRAPH) {
        return elemento.asParagraph();
      }
      
      if (tipo === DocumentApp.ElementType.LIST_ITEM) {
        // ListItem puede contener párrafos, tomar el primero
        const listItem = elemento.asListItem();
        if (listItem.getNumChildren() > 0) {
          const child = listItem.getChild(0);
          if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
            return child.asParagraph();
          }
        }
        // Si no hay children, el ListItem mismo actúa como párrafo
        // pero necesitamos crear un párrafo real
        break;
      }
      
      // Subir un nivel
      elemento = elemento.getParent();
      intentos++;
    }
  }
  
  // 2. Intentar con selección
  const selection = doc.getSelection();
  if (selection) {
    const elementos = selection.getRangeElements();
    if (elementos.length > 0) {
      let elemento = elementos[0].getElement();
      
      // Mismo proceso: subir hasta Paragraph
      let intentos = 0;
      while (elemento && intentos < 10) {
        if (elemento.getType() === DocumentApp.ElementType.PARAGRAPH) {
          return elemento.asParagraph();
        }
        elemento = elemento.getParent();
        intentos++;
      }
    }
  }
  
  // 3. Último recurso: crear nuevo párrafo al final del documento
  // Esto garantiza que SIEMPRE devolvemos un Paragraph válido
  const numChildren = body.getNumChildren();
  
  if (numChildren > 0) {
    const ultimoElemento = body.getChild(numChildren - 1);
    
    // Si el último elemento es un párrafo y está vacío, reutilizarlo
    if (ultimoElemento.getType() === DocumentApp.ElementType.PARAGRAPH) {
      const parrafo = ultimoElemento.asParagraph();
      if (parrafo.getText().trim() === '') {
        return parrafo;
      }
    }
  }
  
  // Crear nuevo párrafo al final
  const nuevoParrafo = body.appendParagraph('');
  
  // Mover cursor al nuevo párrafo
  const posicion = doc.newPosition(nuevoParrafo.editAsText(), 0);
  doc.setCursor(posicion);
  
  return nuevoParrafo;
}

/**
 * Aplica indentación y formato a un párrafo de forma segura.
 * 
 * SOLUCIÓN DEFINITIVA AL BUG DE INDENTACIÓN:
 * Esta función replica EXACTAMENTE la lógica probada de aplicarEstiloDirecto (Pruebas.gs).
 * El orden de operaciones es CRÍTICO:
 * 1. Borrar texto existente
 * 2. Resetear párrafo a cero
 * 3. Aplicar sangría al párrafo VACÍO (incluyendo setIndentFirstLine)
 * 4. Reinsertar texto
 * 
 * Este orden garantiza que el layout de Google Docs recalcula correctamente
 * la posición visual del texto (triángulo Y rectángulo de la regla).
 * 
 * @param {Paragraph} paragraph - Párrafo a formatear
 * @param {Object} config - Configuración de estilo (del objeto ESTILOS_GUION)
 */
function applyIndentationSafe(paragraph, config) {
  if (!paragraph || !config) {
    throw new Error('Parámetros inválidos para applyIndentationSafe');
  }
  
  const texto = paragraph.editAsText();
  const contenidoOriginal = texto.getText();
  
  // PASO 1: GUARDAR y BORRAR el texto existente
  const backup = contenidoOriginal;
  if (backup.length > 0) {
    texto.deleteText(0, backup.length - 1);
  }
  
  // PASO 2: RESETEAR el párrafo (ahora vacío)
  paragraph.setIndentFirstLine(0);
  paragraph.setIndentStart(0);
  paragraph.setIndentEnd(0);
  paragraph.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  paragraph.setSpacingBefore(0);
  paragraph.setSpacingAfter(0);
  paragraph.setLineSpacing(1.0);
  
  // PASO 3: APLICAR indentación al párrafo VACÍO
  paragraph.setAlignment(config.alineacion);
  paragraph.setIndentStart(config.sangriaIzq);
  paragraph.setIndentEnd(config.sangriaDer);
  paragraph.setIndentFirstLine(config.sangriaIzq); // CRÍTICO: La primera línea también debe moverse
  paragraph.setSpacingBefore(config.espacioAntes);
  paragraph.setSpacingAfter(config.espacioDespues);
  paragraph.setLineSpacing(config.interlineado);
  
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

/**
 * EJEMPLO: Aplica formato de PERSONAJE de forma segura.
 * 
 * Esta función reemplaza la lógica anterior que no funcionaba.
 * Usa las funciones seguras getActiveParagraphSafe() y applyIndentationSafe().
 */
function applyCharacter() {
  try {
    // 1. Obtener el párrafo activo de forma SEGURA
    const paragraph = getActiveParagraphSafe();
    
    // 2. Obtener la configuración de estilo
    const config = ESTILOS_GUION.PERSONAJE;
    
    // 3. Aplicar formato SEGURO
    applyIndentationSafe(paragraph, config);
    
    // 4. Opcional: feedback al usuario
    // DocumentApp.getUi().showToast('Formato PERSONAJE aplicado');
    
  } catch (error) {
    console.error('Error en applyCharacter:', error);
    DocumentApp.getUi().alert('Error al aplicar formato: ' + error.message);
  }
}

/**
 * EJEMPLO: Aplica formato de DIÁLOGO de forma segura.
 */
function applyDialogue() {
  try {
    const paragraph = getActiveParagraphSafe();
    const config = ESTILOS_GUION.DIALOGO;
    applyIndentationSafe(paragraph, config);
  } catch (error) {
    console.error('Error en applyDialogue:', error);
    DocumentApp.getUi().alert('Error al aplicar formato: ' + error.message);
  }
}

/**
 * EJEMPLO: Aplica formato de ESCENA de forma segura.
 */
function applyScene() {
  try {
    const paragraph = getActiveParagraphSafe();
    const config = ESTILOS_GUION.ESCENA;
    applyIndentationSafe(paragraph, config);
  } catch (error) {
    console.error('Error en applyScene:', error);
    DocumentApp.getUi().alert('Error al aplicar formato: ' + error.message);
  }
}

/**
 * EJEMPLO: Aplica formato de ACCIÓN de forma segura.
 */
function applyAction() {
  try {
    const paragraph = getActiveParagraphSafe();
    const config = ESTILOS_GUION.ACCION;
    applyIndentationSafe(paragraph, config);
  } catch (error) {
    console.error('Error en applyAction:', error);
    DocumentApp.getUi().alert('Error al aplicar formato: ' + error.message);
  }
}

/**
 * EJEMPLO: Aplica formato de PARENTÉTICO de forma segura.
 */
function applyParenthetical() {
  try {
    const paragraph = getActiveParagraphSafe();
    const config = ESTILOS_GUION.PARENTETICO;
    applyIndentationSafe(paragraph, config);
  } catch (error) {
    console.error('Error en applyParenthetical:', error);
    DocumentApp.getUi().alert('Error al aplicar formato: ' + error.message);
  }
}

/**
 * EJEMPLO: Aplica formato de TRANSICIÓN de forma segura.
 */
function applyTransition() {
  try {
    const paragraph = getActiveParagraphSafe();
    const config = ESTILOS_GUION.TRANSICION;
    applyIndentationSafe(paragraph, config);
  } catch (error) {
    console.error('Error en applyTransition:', error);
    DocumentApp.getUi().alert('Error al aplicar formato: ' + error.message);
  }
}

// ============================================================================
// FUNCIONES DE MIGRACIÓN - Reemplaza las antiguas funciones
// ============================================================================

/**
 * Versión SEGURA de convertirAPersonaje().
 * Reemplaza la función antigua en Code.gs
 */
function convertirAPersonaje() {
  applyCharacter();
}

/**
 * Versión SEGURA de convertirADialogo().
 */
function convertirADialogo() {
  applyDialogue();
}

/**
 * Versión SEGURA de convertirAEscena().
 */
function convertirAEscena() {
  applyScene();
}

/**
 * Versión SEGURA de convertirAAccion().
 */
function convertirAAccion() {
  applyAction();
}

/**
 * Versión SEGURA de convertirAParentetico().
 */
function convertirAParentetico() {
  applyParenthetical();
}

/**
 * Versión SEGURA de convertirATransicion().
 */
function convertirATransicion() {
  applyTransition();
}
