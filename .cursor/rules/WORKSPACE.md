## Workspace rules – `papacore` package

These rules apply to the `papacore/` package when it lives as its own repo.

### Purpose

- Provide a **single public Papacore package** that:
  - Exposes the CLI to scaffold and run Papacore projects.
  - Contains the build system that transforms TS/JSX into Datacore components and installs them into a vault.
  - Ships the templates and config files that new projects are created from.

### General principles

- **Keep it simple, don’t overcomplicate**:
  - Prefer straightforward implementations over deep abstractions.
  - Favour readability and maintainability over cleverness.
- **Ask when unsure** about desired UX/DX or architectural direction.
- **Don’t cut corners** that would make the CLI or build pipeline fragile for users.

### Architecture expectations

- **CLI layer** (`src/cli/**`):
  - Commands are thin: parse args/options, call into core classes, and report status via shared logger/spinner utilities.
  - Follow existing patterns (e.g. `src/cli/commands/dev.ts`) for structure, error handling, and output.
- **Core layer** (`src/core/**`):
  - `build/`: builder, watcher, installer – all derived from earlier scripts but refactored into testable classes.
  - `babel/`: Datacore‑specific Babel plugins.
  - `css/`: Tailwind/CSS pipeline that outputs `papacore.css`.
  - `deps/`: dependency scanning.
- **Templates** (`src/templates/**`):
  - Represent what an idiomatic Papacore project should look like.
  - When improving the “default” experience, update templates first.

### Separation from example projects

- This package **must not depend on any particular example vault** at runtime.
  - Code that originally lived in a sample project should be copied/ported here under `src/core/**` and adapted.
- Example projects created with `papacore init` should be thin consumers of this package, not the other way around.

