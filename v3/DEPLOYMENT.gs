/**
 * GUION MAKER - DEPLOYMENT GUIDE
 * Guía paso a paso para desplegar el Add-on
 * 
 * @version 3.0
 * @author Guion Maker
 */

// ============================================================================
// CHECKLIST DE VERIFICACIÓN PRE-DESPLIEGUE
// ============================================================================

/*
┌─────────────────────────────────────────────────────────────────┐
│  ✅ CHECKLIST DE VERIFICACIÓN                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📋 SEGURIDAD Y SCOPES                                          │
│  ☐ appsscript.json solo tiene documents.currentonly            │
│  ☐ NO hay referencias a DriveApp en ningún archivo             │
│  ☐ NO hay iteración de carpetas                                 │
│  ☐ Solo se usa DocumentApp.getActiveDocument()                 │
│                                                                  │
│  📋 TRIGGERS Y CICLO DE VIDA                                    │
│  ☐ onOpen(e) maneja authMode correctamente                     │
│  ☐ onInstall(e) llama a onOpen(e)                              │
│  ☐ onFileScopeGranted(e) está implementado                     │
│  ☐ Menú NO se crea en authMode NONE                            │
│                                                                  │
│  📋 ARQUITECTURA                                                │
│  ☐ Code.gs solo tiene triggers y menú                          │
│  ☐ Controller.gs orquesta sin lógica dura                      │
│  ☐ Logic.gs tiene toda la lógica de negocio                    │
│  ☐ Sin dependencias circulares                                  │
│                                                                  │
│  📋 TESTING                                                     │
│  ☐ Probado en modo previsualización (authMode NONE)            │
│  ☐ Probado después de instalación                              │
│  ☐ Probado en documento compartido                             │
│  ☐ Probado con otro usuario (sin permisos de edición)          │
│  ☐ Todos los formatos funcionan correctamente                  │
│  ☐ Fountain parser funciona                                     │
│  ☐ Renumeración funciona                                        │
│                                                                  │
│  📋 UI/UX                                                       │
│  ☐ Nombres de menú son intuitivos                              │
│  ☐ Mensajes de error son claros                                │
│  ☐ Feedback de éxito está presente                             │
│  ☐ No hay mensajes innecesarios                                │
│                                                                  │
│  📋 MARKETPLACE                                                 │
│  ☐ Metadata completo en appsscript.json                        │
│  ☐ Logo preparado (128x128 PNG)                                │
│  ☐ Screenshots preparados                                       │
│  ☐ Descripción en español e inglés                             │
│  ☐ Política de privacidad creada                               │
│  ☐ Términos de servicio creados                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
*/

// ============================================================================
// PASO 1: CONFIGURACIÓN INICIAL
// ============================================================================

/**
 * CREAR PROYECTO EN APPS SCRIPT
 * 
 * 1. Ir a https://script.google.com
 * 2. Nuevo proyecto → "Guion Maker"
 * 3. Copiar archivos de v3:
 *    - appsscript.json
 *    - Code.gs
 *    - Controller.gs
 *    - Logic.gs
 * 
 * 4. Guardar proyecto
 */

// ============================================================================
// PASO 2: CONFIGURACIÓN DE GOOGLE CLOUD PROJECT
// ============================================================================

/**
 * CREAR Y VINCULAR GCP PROJECT
 * 
 * 1. Ir a https://console.cloud.google.com
 * 2. Crear nuevo proyecto: "guion-maker-addon"
 * 3. En Apps Script:
 *    - Configuración del proyecto (⚙️)
 *    - Número de proyecto de Google Cloud Platform
 *    - Cambiar proyecto
 *    - Pegar ID del proyecto GCP
 * 
 * 4. Habilitar APIs necesarias:
 *    - Google Docs API
 *    - Google Drive API (solo metadata)
 * 
 * IMPORTANTE: Aunque habilitamos Drive API, NO la usamos en código.
 * Solo es necesaria para metadata del Marketplace.
 */

// ============================================================================
// PASO 3: OAUTH CONSENT SCREEN
// ============================================================================

/**
 * CONFIGURAR PANTALLA DE CONSENTIMIENTO
 * 
 * 1. En Google Cloud Console:
 *    - APIs & Services → OAuth consent screen
 * 
 * 2. Tipo: Externo (público)
 * 
 * 3. Información de la aplicación:
 *    - Nombre: "Guion Maker"
 *    - Email de soporte: tu-email@example.com
 *    - Logo: (128x128 PNG del logo)
 * 
 * 4. Dominios autorizados:
 *    - (ninguno necesario para Add-on)
 * 
 * 5. Scopes:
 *    - Añadir scope: https://www.googleapis.com/auth/documents.currentonly
 *    - NO añadir otros scopes
 * 
 * 6. Usuarios de prueba:
 *    - Añadir tus emails de prueba
 * 
 * 7. Guardar y continuar
 */

// ============================================================================
// PASO 4: PREPARAR ASSETS PARA MARKETPLACE
// ============================================================================

/**
 * ASSETS NECESARIOS
 * 
 * 1. LOGO (128x128 PNG):
 *    - Fondo transparente
 *    - Icono de claqueta o guión
 *    - Colores: #4285f4 (azul) y #34a853 (verde)
 * 
 * 2. SCREENSHOTS (1280x800 PNG):
 *    - Screenshot 1: Menú del Add-on abierto
 *    - Screenshot 2: Ejemplo de guión formateado
 *    - Screenshot 3: Lista de personajes
 *    - Screenshot 4: Formateo Fountain en acción
 * 
 * 3. DESCRIPCIÓN (Español):
 *    Título: "Guion Maker - Formateo Profesional de Guiones"
 *    
 *    Descripción corta:
 *    "Formatea guiones cinematográficos con estándares de Hollywood 
 *    directamente en Google Docs."
 *    
 *    Descripción larga:
 *    "Guion Maker transforma Google Docs en un editor profesional de 
 *    guiones cinematográficos. Aplica formatos estándar de Hollywood 
 *    con un clic: encabezados de escena, diálogos, personajes, 
 *    transiciones y más.
 *    
 *    CARACTERÍSTICAS:
 *    ✅ Formatos profesionales (Final Draft compatible)
 *    ✅ Soporte de sintaxis Fountain
 *    ✅ Renumeración automática de escenas
 *    ✅ Auto-detección de personajes repetidos (CONT'D)
 *    ✅ Lista de personajes y estadísticas
 *    ✅ Plantillas predefinidas
 *    
 *    SEGURIDAD Y PRIVACIDAD:
 *    🔒 Solo accede al documento actual (no a Drive)
 *    🔒 Verificación rápida de Google
 *    🔒 100% GRATIS
 *    
 *    COMPATIBLE CON:
 *    - Sintaxis Fountain (fountain.io)
 *    - Estándares de Hollywood
 *    - Exportación a PDF lista para producción"
 * 
 * 4. DESCRIPCIÓN (Inglés):
 *    Title: "Script Maker - Professional Screenplay Formatting"
 *    
 *    Short description:
 *    "Format screenplays with Hollywood standards directly in Google Docs."
 *    
 *    Long description:
 *    "Script Maker transforms Google Docs into a professional screenplay 
 *    editor. Apply Hollywood-standard formatting with one click: scene 
 *    headings, dialogue, characters, transitions, and more.
 *    
 *    FEATURES:
 *    ✅ Professional formats (Final Draft compatible)
 *    ✅ Fountain syntax support
 *    ✅ Automatic scene numbering
 *    ✅ Auto-detection of repeated characters (CONT'D)
 *    ✅ Character list and statistics
 *    ✅ Pre-defined templates
 *    
 *    SECURITY & PRIVACY:
 *    🔒 Only accesses current document (not Drive)
 *    🔒 Fast Google verification
 *    🔒 100% FREE
 *    
 *    COMPATIBLE WITH:
 *    - Fountain syntax (fountain.io)
 *    - Hollywood standards
 *    - PDF export ready for production"
 * 
 * 5. POLÍTICA DE PRIVACIDAD:
 *    Crear página en tu dominio:
 *    https://tu-dominio.com/guion-maker/privacy
 *    
 *    Contenido mínimo:
 *    - Qué datos recopila: NINGUNO
 *    - Qué permisos usa: documents.currentonly
 *    - Cómo protege datos: No almacena nada
 *    - Contacto: email de soporte
 * 
 * 6. TÉRMINOS DE SERVICIO:
 *    Crear página en tu dominio:
 *    https://tu-dominio.com/guion-maker/terms
 *    
 *    Contenido mínimo:
 *    - Uso permitido
 *    - Limitación de responsabilidad
 *    - Soporte
 *    - Contacto
 */

// ============================================================================
// PASO 5: DESPLEGAR COMO ADDON
// ============================================================================

/**
 * DESPLEGAR VERSIÓN
 * 
 * 1. En Apps Script Editor:
 *    - Desplegar → Nueva implementación
 * 
 * 2. Tipo de implementación:
 *    - Seleccionar "Complemento"
 * 
 * 3. Configuración:
 *    - Versión: 1.0.0
 *    - Descripción: "Primera versión pública"
 * 
 * 4. Crear implementación
 * 
 * 5. Copiar ID de implementación (lo necesitarás para Marketplace)
 */

// ============================================================================
// PASO 6: PUBLICAR EN MARKETPLACE
// ============================================================================

/**
 * ENVIAR A GOOGLE WORKSPACE MARKETPLACE
 * 
 * 1. Ir a Google Workspace Marketplace SDK:
 *    https://console.cloud.google.com/marketplace
 * 
 * 2. Habilitar Google Workspace Marketplace SDK
 * 
 * 3. Crear listado:
 *    - Categoría: Productivity
 *    - Tipo: Google Docs Add-on
 * 
 * 4. Información del listado:
 *    - Nombre: "Guion Maker"
 *    - Descripción corta/larga: (del paso 4)
 *    - Logo: (128x128 PNG)
 *    - Screenshots: (4 imágenes)
 *    - Categorías: Productivity, Education
 *    - Idiomas: Español, Inglés
 * 
 * 5. Configuración técnica:
 *    - Script ID: (copiar de Apps Script)
 *    - Version: 1.0.0
 *    - OAuth Scopes: documents.currentonly
 * 
 * 6. Soporte:
 *    - Email: tu-email@example.com
 *    - URL de soporte: https://tu-dominio.com/support
 *    - Política de privacidad: https://tu-dominio.com/privacy
 *    - Términos de servicio: https://tu-dominio.com/terms
 * 
 * 7. Precios:
 *    - Modelo: GRATIS
 * 
 * 8. Guardar borrador
 */

// ============================================================================
// PASO 7: SOLICITAR VERIFICACIÓN
// ============================================================================

/**
 * VERIFICACIÓN DE GOOGLE
 * 
 * 1. En Google Cloud Console:
 *    - OAuth consent screen
 *    - Solicitar verificación
 * 
 * 2. Formulario de verificación:
 *    - Explicar qué hace tu Add-on
 *    - Por qué necesitas el scope documents.currentonly
 *    - Demo en video (opcional pero recomendado)
 *    - Link a política de privacidad
 * 
 * 3. Tiempo de espera:
 *    - Con scope restrictivo: 1-2 semanas
 *    - Con scopes sensibles: 4-6 semanas
 * 
 * VENTAJA: Como solo usamos documents.currentonly,
 * la verificación es RÁPIDA y SIMPLE.
 */

// ============================================================================
// PASO 8: PUBLICAR
// ============================================================================

/**
 * PUBLICACIÓN FINAL
 * 
 * 1. Después de la verificación:
 *    - Volver a Marketplace SDK
 *    - Revisar listado
 *    - Publicar
 * 
 * 2. Esperar aprobación final (24-48 horas)
 * 
 * 3. ¡PUBLICADO!
 *    - Tu Add-on aparecerá en Google Workspace Marketplace
 *    - Los usuarios pueden instalarlo con un clic
 */

// ============================================================================
// MANTENIMIENTO POST-PUBLICACIÓN
// ============================================================================

/**
 * ACTUALIZACIONES
 * 
 * Para actualizar el Add-on:
 * 
 * 1. Hacer cambios en el código
 * 2. Probar exhaustivamente
 * 3. Desplegar nueva versión (ej: 1.1.0)
 * 4. Actualizar listado en Marketplace
 * 5. Publicar actualización
 * 
 * IMPORTANTE:
 * - NO cambiar scopes sin verificación previa
 * - Mantener compatibilidad hacia atrás
 * - Documentar cambios en release notes
 */

/**
 * MONITOREO
 * 
 * Herramientas para monitorear tu Add-on:
 * 
 * 1. Google Cloud Console:
 *    - Ver logs de ejecución
 *    - Analizar errores
 *    - Métricas de uso
 * 
 * 2. Apps Script Dashboard:
 *    - Ver ejecuciones
 *    - Detectar fallos
 *    - Optimizar rendimiento
 * 
 * 3. Marketplace Console:
 *    - Ver instalaciones
 *    - Leer reviews
 *    - Responder a usuarios
 */

// ============================================================================
// TROUBLESHOOTING COMÚN
// ============================================================================

/**
 * PROBLEMAS COMUNES Y SOLUCIONES
 * 
 * 1. "El menú no aparece después de instalar"
 *    Solución: Verificar que onInstall() llama a onOpen()
 * 
 * 2. "Error de permisos al formatear"
 *    Solución: Verificar authMode en onOpen()
 * 
 * 3. "Verificación de Google rechazada"
 *    Solución: Asegurar que NO usas scopes adicionales
 * 
 * 4. "El Add-on no funciona en modo previsualización"
 *    Solución: Normal - authMode NONE no permite crear menús
 * 
 * 5. "Los formatos no se aplican correctamente"
 *    Solución: Verificar que FORMAT_CONFIG tiene valores numéricos
 * 
 * 6. "CONT'D no se añade automáticamente"
 *    Solución: Verificar getPreviousCharacterName()
 * 
 * 7. "Fountain parser no detecta tipos"
 *    Solución: Revisar regex en detectFountainBlockType()
 */

// ============================================================================
// RECURSOS ADICIONALES
// ============================================================================

/**
 * ENLACES ÚTILES
 * 
 * Documentación oficial:
 * - Apps Script Docs: https://developers.google.com/apps-script
 * - Add-ons Guide: https://developers.google.com/workspace/add-ons
 * - Marketplace: https://developers.google.com/workspace/marketplace
 * 
 * Fountain:
 * - Especificación: https://fountain.io/syntax
 * - Ejemplos: https://fountain.io/examples
 * 
 * Estándares de guión:
 * - Industry Standard: https://www.writersstore.com/screenplay-format/
 * - Final Draft specs: https://www.finaldraft.com
 * 
 * Comunidad:
 * - Stack Overflow: [google-apps-script]
 * - Reddit: r/googleappsscript
 */

// ============================================================================
// FIN DE LA GUÍA DE DESPLIEGUE
// ============================================================================

console.log('🎬 Guion Maker v3 - Listo para desplegar!');
