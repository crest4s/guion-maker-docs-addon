# Guion Maker — Google Docs Screenplay Formatter

Tools for formatting professional screenplays in Google Docs, following industry-standard conventions.

---

## Structure

```
guion-docs-apps-scripts/
├── apps-script/    ← Linked script (current production version)
└── add-on/         ← Google Workspace Marketplace add-on (WIP)
```

### `apps-script/` — Linked Script

A Google Apps Script linked directly to a Google Doc. This is the active, production-ready version.

**Files:**
- `Code.gs` — Entry point: `onOpen` trigger, menu creation, keyboard shortcut handlers
- `Formatting.gs` — Core formatting logic for screenplay elements (scene headings, action, dialogue, etc.)
- `FountainParser.gs` — Parser for Fountain plain-text screenplay format
- `Navigation.gs` — Scene navigation and document structure utilities
- `Utilities.gs` — Shared helpers (text manipulation, UI alerts, etc.)
- `Autocomplete.gs` — Character name autocomplete from document history
- `Sidebar.html` — Sidebar UI panel (loaded via `HtmlService`)

**How to use:** Open the linked Google Doc. The "Guion Maker" menu appears automatically on `onOpen`. Use `Ctrl+Alt+1–6` for quick formatting shortcuts.

---

### `add-on/` — Marketplace Add-on (WIP)

A standalone Apps Script structured as a Google Workspace Marketplace add-on. Not yet published.

**Files:**
- `appsscript.json` — Manifest with OAuth scopes, add-on triggers, and runtime config
- `Code.gs` — Lifecycle triggers (`onOpen`, `onInstall`, `onHomepage`) and menu bridge
- `Controller.gs` — Orchestration layer: connects menu actions to business logic
- `Logic.gs` — Core screenplay formatting logic (equivalent to `apps-script/Formatting.gs`)
- `Tests.gs` — Manual test suite for development

**How to use:** Deploy via [clasp](https://github.com/google/clasp) or copy files into the Apps Script editor linked to the target document.

---

## Screenplay Format Reference

| Element | Shortcut |
|---|---|
| Scene Heading | `Ctrl+Alt+1` |
| Action | `Ctrl+Alt+2` |
| Character | `Ctrl+Alt+3` |
| Dialogue | `Ctrl+Alt+4` |
| Parenthetical | `Ctrl+Alt+5` |
| Transition | `Ctrl+Alt+6` |
