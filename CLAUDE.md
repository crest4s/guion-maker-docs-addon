# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**Guion Maker** — a professional screenplay formatter for Google Docs. It exists in two flavors:

| Variant | Directory | Version | Use case |
|---------|-----------|---------|----------|
| Google Workspace Add-on | `add-on/` | v3.0 | Installable from the Marketplace; works in any Google Doc |
| Document-bound script | `apps-script/` | v2.1 | Installed directly in one specific Google Doc; includes Fountain import/export |

## No local build or test commands

All code runs exclusively inside Google Apps Script (V8 runtime). There is no local build system, no package manager, no test runner. Development workflow:

1. Edit `.gs` / `.html` files locally in this repo.
2. Copy-paste changed files into the [Apps Script editor](https://script.google.com).
3. Test using **Deploy → Test deployments** inside the Apps Script editor.
4. Use the manual test plan in [`docs/add-on/DEPLOYMENT.md`](docs/add-on/DEPLOYMENT.md) — section "Plan de pruebas mínimo" — to verify each feature.

## Architecture — `add-on/` (the primary variant)

Three-layer separation:

```
Code.gs        ← lifecycle triggers (onOpen/onInstall/onFileScopeGranted),
                 menu construction, thin bridge functions callable as macros
Controller.gs  ← UI orchestration: shows alerts/prompts/sidebar, handles errors,
                 calls Logic.gs functions
Logic.gs       ← pure business logic: FORMAT_CONFIG, applyFormatToParagraph(),
                 all document manipulation; no UI calls
Sidebar.html   ← HTML/JS sidebar panel
appsscript.json← OAuth scopes, add-on metadata, manifest
```

**Call direction:** `Code.gs → Controller.gs → Logic.gs`. Never call upward.

## Key constants in Logic.gs

- `FORMAT_CONFIG` — defines all 8 screenplay element types (indentation in pts, spacing, uppercase flag, alignment). This is the single source of truth for formatting specs.
- `FONT` — `{family: 'Courier New', size: 12}`
- `PAGE_CONFIG` — A4 dimensions + margins in points
- `TRANSITION_MAP` — Spanish→English transition text mapping

## Screenplay format reference

Block type detection relies exclusively on `indentStart` values (±2pt tolerance):

| Element | indentStart | indentEnd |
|---------|-------------|-----------|
| CHARACTER | 144 pt | 0 |
| DIALOGUE | 108 pt | 72 pt |
| PARENTHETICAL | 126 pt | 90 pt |
| TRANSITION | 376 pt | 0 |
| SCENE_HEADING | 0 pt | 0 (+ must start with INT./EXT.) |
| ACTION | 0 pt | 0 (default) |
| ACT_BREAK | 0 pt | 0 (centered) |

`applyFormatToParagraph()` in Logic.gs does a **full reset** of all paragraph properties before re-applying the target format. This is intentional — Google Docs inherits styles aggressively.

After calling `setupDocumentStandards()` (which changes page margins), `recalculateAllIndentations()` must be called immediately because Google Docs adds margin values on top of indentation values, causing visual misalignment.

## Deploying to Google Workspace Marketplace

See [`docs/add-on/DEPLOYMENT.md`](docs/add-on/DEPLOYMENT.md) for the full step-by-step. Key points:

- The `logoUrl` in `appsscript.json` is currently a placeholder — replace before publishing.
- OAuth scopes used (`documents.currentonly`, `script.container.ui`) are non-sensitive, so Marketplace review takes 3–7 business days (not the extended 4–6 week flow).
- Keyboard shortcuts (Ctrl+Alt+1–6) must be manually assigned by the user via **Tools → Macros → Manage macros** — they cannot be set programmatically.
