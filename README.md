# Guion Maker — Screenplay Formatter for Google Docs

Herramientas para formatear guiones cinematográficos profesionales en Google Docs, siguiendo las convenciones estándar de la industria.

---

## Estructura

```
guion-maker-docs-addon/
├── add-on/         ← Google Workspace Marketplace Add-on (v3.0)
├── apps-script/    ← Script vinculado a documento (v2.1)
└── docs/
    ├── add-on/     ← README, guía de uso, deployment, requisitos
    └── apps-script/← README, guía de uso
```

---

## `add-on/` — Google Workspace Add-on (v3.0)

Add-on publicable en Google Workspace Marketplace. Se instala una vez y queda disponible en todos los Google Docs del usuario o dominio institucional.

| Archivo | Responsabilidad |
|---------|----------------|
| `appsscript.json` | Manifest: scopes OAuth, triggers, metadatos |
| `Code.gs` | Triggers (`onOpen`, `onInstall`, `onFileScopeGranted`), menú, bridges a Controller |
| `Controller.gs` | Coordinación de UI (alertas, prompts, sidebar) y manejo de errores |
| `Logic.gs` | Lógica pura de formateo y manipulación de párrafos |
| `Sidebar.html` | Panel lateral con acceso rápido a todas las funciones |

**Documentación:** [`docs/add-on/`](docs/add-on/)

---

## `apps-script/` — Script vinculado (v2.1)

Script que se instala directamente en un Google Doc concreto. Incluye funcionalidades adicionales como Fountain import/export y estadísticas.

| Archivo | Responsabilidad |
|---------|----------------|
| `Code.gs` | Triggers, menú, configuración, plantillas, personajes |
| `Formatting.gs` | Aplicación interactiva de formatos + `TRANSITION_MAP` |
| `FountainParser.gs` | Parser completo del formato Fountain |
| `Utilities.gs` | Helpers, detección de tipos, `aplicarEstiloAParrafo` |
| `Sidebar.html` | Panel lateral |

**Documentación:** [`docs/apps-script/`](docs/apps-script/)

---

## Referencia rápida de formatos

| Elemento | Sangría inicio | Sangría fin | Atajo |
|----------|---------------|-------------|-------|
| Scene Heading | 0 pt | 0 pt | Ctrl+Alt+1 |
| Action | 0 pt | 0 pt | Ctrl+Alt+2 |
| Character | 144 pt | 0 pt | Ctrl+Alt+3 |
| Dialogue | 108 pt | 72 pt | Ctrl+Alt+4 |
| Parenthetical | 126 pt | 90 pt | Ctrl+Alt+5 |
| Transition | 376 pt | 0 pt | Ctrl+Alt+6 |
| Act Break | 0 pt (centrado) | — | — |
| Shot | 0 pt | — | — |

Fuente: **Courier New 12pt**. Página: **A4**. Márgenes: 72pt/72pt/108pt/72pt (T/B/L/R).
