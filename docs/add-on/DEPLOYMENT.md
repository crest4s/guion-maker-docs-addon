# DEPLOYMENT.md — Guion Maker Add-on v3.0

Guía completa para desplegar Guion Maker como Google Workspace Add-on en Google Workspace Marketplace.

---

## Índice

1. [Tipo de cuenta recomendado](#1-tipo-de-cuenta-recomendado)
2. [Preparar los assets](#2-preparar-los-assets)
3. [Crear el proyecto en Apps Script](#3-crear-el-proyecto-en-apps-script)
4. [Crear y vincular el proyecto en Google Cloud](#4-crear-y-vincular-el-proyecto-en-google-cloud)
5. [Configurar la pantalla de consentimiento OAuth](#5-configurar-la-pantalla-de-consentimiento-oauth)
6. [Crear el deployment](#6-crear-el-deployment)
7. [Configurar el Marketplace SDK](#7-configurar-el-marketplace-sdk)
8. [Probar el add-on antes de publicar](#8-probar-el-add-on-antes-de-publicar)
9. [Publicar en el Marketplace](#9-publicar-en-el-marketplace)
10. [Distribución privada para instituciones](#10-distribución-privada-para-instituciones)
11. [Actualizaciones futuras](#11-actualizaciones-futuras)
12. [Checklist de publicación](#12-checklist-de-publicación)

---

## 1. Tipo de cuenta recomendado

| Escenario | Cuenta necesaria |
|-----------|-----------------|
| Publicación en Marketplace público (cualquier usuario) | **Cuenta Google personal** |
| Distribución privada a tu propia organización | **Cuenta Google Workspace** con rol de administrador |
| Ventas a universidades (ellas instalan desde su Admin Console) | **Cuenta personal** para publicar; la universidad usa su propia cuenta Workspace para instalar |

**Conclusión práctica:** Una cuenta personal de Google es suficiente para publicar en el Marketplace. No necesitas Workspace para publicar; solo la necesitarías si quisieras desplegar el add-on de forma privada en tu propio dominio institucional.

---

## 2. Preparar los assets

Antes de empezar, ten listos:

| Asset | Especificación | Obligatorio |
|-------|---------------|-------------|
| Logo del add-on | PNG o JPG, 128×128 px, fondo no transparente | Sí |
| Pantallas de uso (screenshots) | PNG o JPG, 1280×800 px mínimo | Mínimo 1 (recomendado 3-5) |
| URL de política de privacidad | Página web pública accesible | Sí (para listing público) |
| URL de términos de servicio | Página web pública accesible | Opcional pero recomendado |
| Descripción corta | Máx. 80 caracteres | Sí |
| Descripción larga | Markdown, máx. 4000 caracteres | Sí |

**Logo**: Sube el logo a Google Drive u otro hosting público, obtén la URL directa y ponla en `appsscript.json` → `addOns.common.logoUrl`. La URL debe ser accesible sin autenticación.

---

## 3. Crear el proyecto en Apps Script

1. Ve a [script.google.com](https://script.google.com) e inicia sesión con tu cuenta Google.
2. Haz clic en **Nuevo proyecto**.
3. Renombra el proyecto: **Guion Maker**.
4. Crea los siguientes archivos (menú **+** → **Script file** o **HTML file**):

| Archivo | Tipo |
|---------|------|
| `Code` | Script |
| `Controller` | Script |
| `Logic` | Script |
| `License` | Script |
| `Sidebar` | HTML |

5. Copia el contenido de cada archivo `.gs` / `.html` de este repositorio al proyecto de Apps Script.
6. Ve a **Configuración del proyecto** (rueda dentada) → activa **"Mostrar el archivo de manifiesto `appsscript.json` en el editor"**.
7. Abre el archivo `appsscript.json` en el editor y sustituye su contenido por el del `appsscript.json` de este repositorio, **sustituyendo el valor de `logoUrl` por la URL real de tu logo**.

El `appsscript.json` listo para producción es:

```json
{
  "timeZone": "Europe/Madrid",
  "oauthScopes": [
    "https://www.googleapis.com/auth/documents.currentonly",
    "https://www.googleapis.com/auth/script.container.ui"
  ],
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Guion Maker",
      "logoUrl": "https://TU-DOMINIO.COM/logo-128x128.png",
      "layoutProperties": {
        "primaryColor": "#4285f4",
        "secondaryColor": "#34a853"
      }
    },
    "docs": {
      "onFileScopeGrantedTrigger": {
        "runFunction": "onFileScopeGranted"
      }
    }
  }
}
```

---

## 4. Crear y vincular el proyecto en Google Cloud

1. Ve a [console.cloud.google.com](https://console.cloud.google.com) con la misma cuenta Google.
2. Crea un **nuevo proyecto** → nombre: `Guion Maker`.
3. Anota el **Project number** (no el ID) — lo necesitarás en el paso siguiente.
4. En **APIs & Services → Library**, habilita:
   - **Google Docs API**
   - **Google Workspace Marketplace SDK**
5. Vuelve al editor de Apps Script → **Configuración del proyecto** → **Proyecto de Google Cloud Platform** → introduce el Project number de GCP → **Establecer proyecto**.

---

## 5. Configurar la pantalla de consentimiento OAuth

En GCP → **APIs & Services → Pantalla de consentimiento de OAuth**:

| Campo | Valor |
|-------|-------|
| User type | External |
| App name | Guion Maker |
| User support email | tu@email.com |
| App logo | Sube el logo (120×120 px) |
| Application home page | URL de tu web o repositorio |
| Privacy policy URL | URL de tu política de privacidad |
| Authorized domains | tu-dominio.com (donde alojas la política) |

En **Scopes**, añade manualmente:
```
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
```

> **Importante**: Estos dos scopes no son considerados "sensibles" por Google. Esto significa que el add-on **no requiere verificación OAuth extendida** (el proceso largo de 4-6 semanas). La revisión del Marketplace será el proceso estándar (3-7 días).

Guarda en **borrador**. No es necesario publicarla de forma independiente; el Marketplace SDK la gestiona.

---

## 6. Crear el deployment

1. En el editor de Apps Script → **Implementar → Nueva implementación**.
2. Configuración:
   - **Tipo**: Add-on
   - **Descripción**: `v3.0 — Sistema profesional de guiones cinematográficos`
   - **Acceso**: Anyone (para Marketplace público)
3. Haz clic en **Implementar**.
4. **Copia el Deployment ID** — lo necesitarás para el Marketplace SDK.

Para futuras actualizaciones, usa **Implementar → Administrar implementaciones → Editar** (los usuarios existentes reciben la actualización automáticamente, sin necesidad de reinstalar).

---

## 7. Configurar el Marketplace SDK

En GCP → **APIs & Services → Google Workspace Marketplace SDK → Configuración de la aplicación**:

### Pestaña App Configuration

| Campo | Valor |
|-------|-------|
| App name | Guion Maker |
| Short description | Formato profesional de guiones cinematográficos en Google Docs |
| Long description | *(ver abajo)* |
| App icons (128×128) | Sube tu logo |
| Category | Productivity |
| Regions | Selecciona los mercados objetivo |
| Post install tip | Ve a Extensiones > Guion Maker para empezar. Usa "Configurar documento" en Herramientas para aplicar los márgenes estándar de guion. |

**Sugerencia de descripción larga:**
```
Guion Maker es un add-on de Google Docs que aplica automáticamente el formato estándar de la industria cinematográfica (basado en las convenciones de Final Draft y Fountain) directamente en tu documento.

Funcionalidades:
• 8 tipos de párrafo profesionales: Encabezado de escena, Acción, Personaje, Diálogo, Paréntético, Transición, Act Break y Plano.
• Aplicación con un clic o atajo de teclado (Ctrl+Alt+1 al 6).
• Detección automática de CONT'D cuando un personaje repite intervención.
• Renumeración automática de escenas.
• Plantillas: portada y escena estándar completa.
• Lista de personajes y búsqueda por nombre.
• Panel lateral para acceso rápido sin abrir el menú.
• Validación y limpieza de formato.

Ideal para estudiantes de comunicación audiovisual, guionistas y profesores. Una instalación por el administrador IT activa el add-on para todo el dominio de Google Workspace, sin que cada usuario tenga que configurar nada.

El add-on solo accede al documento activo. No lee otros documentos, no accede a Drive ni a correo.
```

### Pestaña Store Listing

- Añade las capturas de pantalla (1280×800 px, formato PNG/JPG).
- Añade URL de política de privacidad.

### Pestaña OAuth Scopes

Verifica que los scopes coincidan exactamente con los del manifest:
```
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
```

---

## 8. Probar el add-on antes de publicar

Antes de enviar a revisión, prueba exhaustivamente:

1. En Apps Script → **Implementar → Probar implementaciones**.
2. Selecciona el deployment creado → **Instalar** en un Google Doc de prueba.
3. Verifica cada función del menú con el [plan de pruebas](#plan-de-pruebas-mínimo).

### Plan de pruebas mínimo

| Función | Pasos | Resultado esperado |
|---------|-------|--------------------|
| Configurar documento | Herramientas > Configurar documento | Márgenes y fuente Courier New 12pt aplicados |
| Encabezado de escena | Escribe texto, Ctrl+Alt+1 | Mayúsculas, sangría 0, espacio 12pt antes |
| Personaje | Párrafo vacío, Ctrl+Alt+3, introduce nombre | Nombre en mayúsculas, sangría 144pt, crea línea de diálogo vacía |
| CONT'D automático | Aplica mismo personaje dos veces seguidas | Segunda aparición incluye `(CONT'D)` |
| Diálogo sin personaje previo | Ctrl+Alt+4 en párrafo sin personaje arriba | Solicita nombre, inserta personaje y aplica diálogo |
| Transición ES→EN | Escribe "FUNDIDO A:", aplica Transición | Resultado: `FADE TO:` |
| Renumerar escenas | Documento con 3 escenas, Renumerar | Escenas numeradas `1.`, `2.`, `3.` |
| Insertar portada | Plantillas > Insertar portada | Página con título, autor y salto de página |
| Insertar escena estándar | Plantillas > Insertar escena estándar | Bloque completo con todos los tipos |
| Lista de personajes | Personajes > Lista de personajes | Lista alfabética de personajes detectados |
| Buscar personaje | Personajes > Buscar personaje | Cursor salta a primera aparición |
| Validar formato | Herramientas > Validar formato | Reporta problemas de fuente/tamaño |
| Limpiar formato | Herramientas > Limpiar formato | Normaliza fuente, elimina estilos |
| Panel lateral | Abrir panel lateral | Sidebar visible con todos los botones funcionales |

---

## 9. Publicar en el Marketplace

1. En GCP → Marketplace SDK → **Publish → Publicar aplicación**.
2. Google enviará el add-on a revisión.

### Tiempos de revisión estimados

| Tipo de add-on | Tiempo |
|----------------|--------|
| Sin scopes sensibles (como este) | **3-7 días hábiles** |
| Con scopes sensibles | 2-6 semanas |
| Actualización de versión existente | 1-3 días |

### Modalidades de publicación

| Modalidad | Visibilidad | Cuándo usar |
|-----------|-------------|-------------|
| **Pública** | Cualquier usuario Google | Distribución general / venta |
| **No listada (unlisted)** | Solo con URL directa | Pruebas, clientes específicos |
| **Dominio privado** | Solo usuarios del dominio GW del publisher | Uso interno propio |

> Para vender a universidades: publica en modalidad **pública** o **no listada**. Cada universidad instala el add-on desde su propia Admin Console de Google Workspace. No necesitas ser admin de su dominio.

---

## 10. Distribución privada para instituciones

Si una institución quiere instalar el add-on para todos sus usuarios:

1. El administrador de Google Workspace va a `admin.google.com`.
2. **Aplicaciones → Apps de Google Workspace Marketplace → Añadir aplicación**.
3. Busca "Guion Maker" o introduce el Deployment ID / URL de instalación.
4. Selecciona la unidad organizativa (todo el dominio o facultades concretas).
5. Elige **Instalar para todos los usuarios** o **Permitir instalación por usuario**.

Una vez activado, el add-on aparece automáticamente en **Extensiones** para todos los usuarios seleccionados.

---

## 11. Actualizaciones futuras

1. Modifica el código en el editor de Apps Script.
2. **Implementar → Administrar implementaciones → Editar** el deployment existente → **Nueva versión**.
3. Actualiza la descripción de versión.
4. Los usuarios existentes reciben la actualización automáticamente en su próxima sesión.

> No es necesario que los usuarios reinstalen el add-on para recibir actualizaciones.

---

## 12. Checklist de publicación

### Código y manifest

- [ ] Todos los archivos `.gs` y `.html` subidos al proyecto de Apps Script
- [ ] `appsscript.json` con solo los scopes necesarios (`documents.currentonly`, `script.container.ui`)
- [ ] `logoUrl` en `appsscript.json` actualizado con URL real del logo (no placeholder)
- [ ] `homepageTrigger` eliminado del manifest (este add-on es menu-driven)

### Assets

- [ ] Logo 128×128 px preparado y alojado en URL pública
- [ ] Mínimo 1 captura de pantalla (1280×800 px)
- [ ] Política de privacidad publicada en URL pública
- [ ] Descripción corta (≤ 80 caracteres) redactada
- [ ] Descripción larga redactada

### Google Cloud

- [ ] Proyecto GCP creado y vinculado al script
- [ ] Google Docs API habilitada
- [ ] Google Workspace Marketplace SDK habilitado
- [ ] Pantalla de consentimiento OAuth configurada con scopes correctos

### Deployment y Marketplace

- [ ] Deployment de tipo "Add-on" creado
- [ ] Deployment ID copiado
- [ ] Store listing completo en Marketplace SDK (nombre, descripciones, categoría, capturas)
- [ ] Scopes en Marketplace SDK coinciden con manifest
- [ ] Add-on probado con "Probar implementaciones" (plan de pruebas completo)
- [ ] Enviado a revisión de Google
