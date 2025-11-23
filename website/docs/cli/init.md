---
sidebar_position: 3
---

# papacore init

Initialize a new Papacore project with all necessary files and configuration.

## Usage

```bash
npm create papacore@latest [project-name]
# or
pnpm create papacore@latest [project-name]
```

If you don't provide a project name, you'll be prompted to enter one.

## What It Creates

The `init` command scaffolds a complete Papacore project:

```
my-project/
├── src/
│   ├── Datacore/
│   │   ├── components/shared/
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── button.stories.tsx   # Button stories
│   │   │   ├── dialog.tsx           # Dialog component
│   │   │   ├── dialog.stories.tsx   # Dialog stories
│   │   │   ├── link.tsx             # Link component
│   │   │   └── link.stories.tsx     # Link stories
│   │   ├── utils/
│   │   │   ├── classMerge.ts        # Class merging utility
│   │   │   ├── classVariants.ts     # CVA-like variants
│   │   │   ├── files.ts             # File operations
│   │   │   ├── markdown.ts          # Markdown helpers
│   │   │   └── time.ts              # Time formatting
│   │   └── views/
│   │       └── Sample.tsx           # Example view
│   ├── dc.d.ts                      # Datacore types
│   └── styles.css                   # Tailwind styles
├── .vscode/
│   └── settings.json                # VS Code config
├── babel.config.js                  # Babel config
├── tailwind.config.js               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── biome.json                       # Biome config
├── postcss.config.js                # PostCSS config
├── .gitignore
└── package.json
```

## Installed Dependencies

### Dependencies

None - Papacore projects are self-contained

### Dev Dependencies

- `papacore` - The Papacore build system
- `typescript` - TypeScript compiler
- `@preact/signals` - Reactive state management

## Configuration Files

### babel.config.js

Configures Babel to transform your code:
- Transform imports/exports to Datacore format
- Transform React hooks to Preact hooks
- Handle JSX syntax

### tailwind.config.js

Configures Tailwind CSS v4:
- Sets up content paths
- Defines custom theme colors
- Configures CSS variables

### tsconfig.json

TypeScript configuration:
- JSX: Preact
- Module: ESNext
- Target: ES2022
- Strict type checking enabled

### biome.json

Biome linter and formatter configuration:
- Consistent code style
- Catches common errors
- Integrates with VS Code

## Next Steps

After initializing a project:

1. **Install dependencies**:
   ```bash
   cd my-project
   npm install
   ```

2. **Configure vault path**:
   ```bash
   npm run config
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Enable CSS snippet** in Obsidian Settings → Appearance

## Customization

After initialization, you can:

- Add more components to `src/Datacore/components/`
- Create new views in `src/Datacore/views/`
- Customize Tailwind theme in `tailwind.config.js`
- Add utilities to `src/Datacore/utils/`
- Modify the build process in `babel.config.js`

## Related Commands

- [`papacore config`](./config.md) - Configure vault path
- [`papacore dev`](./dev.md) - Start development
