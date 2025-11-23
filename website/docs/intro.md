---
sidebar_position: 1
---

# Getting Started

Welcome to **Papacore** - a framework that brings modern web development tooling to Obsidian's Datacore plugin.

## What is Papacore?

Papacore bridges the gap between modern web development and Obsidian's Datacore plugin. It transforms the experience of developing Datacore components from a frustrating process into something familiar and productive.

### The Problem

Datacore provides a powerful query engine and uses Preact for rendering. However, developing components for Datacore is challenging:

- Custom import/export notation (`dc.require`) instead of standard ESM/CJS
- No code intellisense or autocomplete
- No hot reloading
- No access to modern tooling (Tailwind, TypeScript, etc.)
- Manual file management

### The Solution

Papacore lets you write components for Datacore as if you were building a regular React app:

- ✅ **TypeScript + Preact**: Write type-safe components with full IDE support
- ✅ **Tailwind CSS v4**: Style your components with utility classes
- ✅ **Hot Reloading**: See changes instantly in Obsidian
- ✅ **Component Stories**: Preview components in isolation
- ✅ **Modern Tooling**: Code completion, linting, type checking
- ✅ **Automatic Transformation**: Papacore handles the conversion to Datacore's format

## Quick Start

Create a new Papacore project:

```bash
npm create papacore@latest my-datacore-project
# or
pnpm create papacore@latest my-datacore-project
```

Navigate to your project and start development:

```bash
cd my-datacore-project
npm run dev
# or
pnpm dev
```

This will:
1. Build your components
2. Transform them to Datacore format
3. Install them to your vault
4. Watch for changes and hot-reload

## What You Get

A Papacore project includes:

- **Starter Components**: Pre-built button, dialog, and link components
- **Utilities**: Helper functions for class merging, file operations, markdown processing, and time formatting
- **Example View**: A sample "Today" view to get you started
- **Full Config**: TypeScript, Tailwind, Babel, and Biome configured and ready
- **Type Definitions**: Full type safety for Datacore APIs

## Next Steps

- [Installation Guide](./installation.md) - Detailed installation instructions
- [Your First Component](./guides/first-component.md) - Create your first component
- [CLI Reference](./cli/overview.md) - Learn about all available commands
- [Component Reference](./components/button.md) - Explore included components
