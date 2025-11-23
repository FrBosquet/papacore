---
sidebar_position: 1
---

# CLI Overview

Papacore provides a command-line interface (CLI) to manage your development workflow.

## Installation

The Papacore CLI is installed automatically when you create a new project:

```bash
npm create papacore@latest
```

In your project, the CLI is available via npm/pnpm scripts:

```bash
npm run dev
npm run build
# etc.
```

## Available Commands

### Development Commands

- **[`papacore dev`](./dev.md)** - Start development mode with watching and hot-reload
- **[`papacore build`](./build.md)** - Build your project once
- **`papacore build-css`** - Build CSS only

### Project Setup Commands

- **[`papacore init`](./init.md)** - Initialize a new Papacore project
- **[`papacore config`](./config.md)** - Configure vault path and settings

### Utility Commands

- **`papacore scan`** - Scan vault for dependencies
- **`papacore install`** - Install built files to vault
- **`papacore copy`** - Copy utilities to your project
- **`papacore theme`** - Generate theme color definitions

### Code Generation Commands

- **`papacore view`** - Generate a new view component

## Getting Help

Get help for any command using the `--help` flag:

```bash
papacore --help
papacore dev --help
papacore build --help
```

## Version

Check your Papacore version:

```bash
papacore --version
```

## Common Workflows

### Starting a New Project

```bash
# Create project
npm create papacore@latest my-project

# Navigate to project
cd my-project

# Configure vault path
npm run config

# Start development
npm run dev
```

### Daily Development

```bash
# Start dev mode (build + watch + install + hot-reload)
npm run dev

# Make changes to your components in src/
# Changes automatically rebuild and sync to vault
# Obsidian hot-reloads automatically
```

### Building for Production

```bash
# Build once
npm run build

# Or build and install to vault
npm run build
```

## Next Steps

- Learn about [development workflow](./dev.md)
- Understand [project configuration](./config.md)
