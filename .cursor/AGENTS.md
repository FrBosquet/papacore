## Papacore package – Cursor agents

This repo (or package folder) is the **Papacore npm package and CLI**.

Papacore lets users write Datacore components with a familiar TypeScript + Preact + Tailwind workflow, then transforms and installs them into an Obsidian vault with live development and hot‑reload.

### What lives here

- The **CLI**: commands like `papacore init`, `papacore dev`, `papacore build`, `papacore config`, `papacore scan`, `papacore build-css` (and future commands such as `generate-icons`).
- The **core build system**:
  - Builder, watcher, installer, dependency scanner, CSS/Tailwind pipeline.
  - Babel plugins implementing Datacore‑specific import/export and hooks handling.
- The **templates**:
  - Starter components, utils, views, typings.
  - Config files (Babel, Tailwind, TS, Biome, PostCSS, etc.).
  - VS Code settings and package template.

### How to behave in this package

- **Keep it simple** and avoid over‑engineering; prefer small, clear APIs.
- Treat this folder as the **source of truth** for behaviour that all Papacore projects should share.
- **Do not depend on any example vault repo at runtime**; logic that originated there must be copied/ported, not imported.
- When unsure about CLI UX, logging style, or architecture, prefer following existing patterns rather than inventing new ones.

For more detail, see `.cursor/rules/WORKSPACE.md` in this package.

