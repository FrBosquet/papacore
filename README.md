# Papacore

A framework to assist in the development of components for the Datacore platform in Obsidian.

## Status

🚧 **Work in Progress** - This package is currently under active development.

## What is Papacore?

Papacore bridges the gap between modern web development and Obsidian's Datacore plugin. It allows you to write Datacore components using familiar tools and workflows:

- **TypeScript + Preact**: Write type-safe components with full IDE support
- **Tailwind CSS**: Style your components with utility classes
- **Hot Reloading**: See changes instantly in Obsidian
- **Component Stories**: Preview components in isolation
- **Modern Tooling**: Code completion, linting, type checking

## Installation

```bash
npm create papacore@latest
# or
pnpm create papacore@latest
```

## CLI Commands

```bash
papacore init [project-name]   # Initialize a new project
papacore dev                    # Build + watch + install to vault
papacore build                  # Build once
papacore config                 # Configure vault path
papacore scan                   # Scan vault for dependencies
papacore generate-icons         # Generate icon definitions
papacore build-css              # Build CSS only
```

## Development

This package is built with TypeScript and uses:

- **Commander.js** for CLI
- **Babel** for code transformations
- **Chokidar** for file watching
- **Tailwind CSS** for styling

### Building

```bash
pnpm install
pnpm run build
```

### Testing locally

```bash
node bin/papacore.js --help
```

## License

MIT
