---
sidebar_position: 2
---

# Installation

Learn how to create and set up a new Papacore project.

## Prerequisites

Before you start, make sure you have:

- **Node.js**: Version 18.0 or higher ([Download here](https://nodejs.org/))
- **Package Manager**: npm (comes with Node.js) or pnpm
- **Obsidian**: With the Datacore plugin installed
- **Code Editor**: VS Code recommended for best experience

## Creating a New Project

The easiest way to create a Papacore project is using the `create` command:

```bash
npm create papacore@latest my-project
```

Or with pnpm:

```bash
pnpm create papacore@latest my-project
```

This will:

1. Create a new directory called `my-project`
2. Set up the project structure
3. Install dependencies
4. Create example components and views
5. Set up configuration files

## Project Structure

After initialization, your project will look like this:

```
my-project/
├── src/
│   ├── Datacore/
│   │   ├── components/
│   │   │   └── shared/          # Reusable components
│   │   │       ├── button.tsx
│   │   │       ├── dialog.tsx
│   │   │       └── link.tsx
│   │   ├── utils/               # Utility functions
│   │   │   ├── classMerge.ts
│   │   │   ├── classVariants.ts
│   │   │   ├── files.ts
│   │   │   ├── markdown.ts
│   │   │   └── time.ts
│   │   └── views/               # Datacore views
│   │       └── Sample.tsx
│   ├── dc.d.ts                  # Datacore type definitions
│   └── styles.css               # Tailwind CSS
├── dist/                        # Built output (git-ignored)
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
├── biome.json
└── package.json
```

## Configuration

### Configure Vault Path

After creating your project, configure where your Obsidian vault is located:

```bash
cd my-project
npm run config
# or
pnpm config
```

This will:
- Prompt you for your vault path
- Save the configuration to `papacore.json`
- Remember this for all future builds

Alternatively, you can manually create `papacore.json`:

```json
{
  "vaultPath": "/path/to/your/obsidian/vault"
}
```

### Install Papacore CSS Snippet

Papacore generates a CSS file that needs to be enabled in Obsidian:

1. The CSS file is located at: `[your-vault]/Datacore/papacore.css`
2. In Obsidian, go to **Settings → Appearance → CSS Snippets**
3. Click the refresh icon
4. Enable the `papacore` snippet

## Development Workflow

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

This will:
- Build your components from `src/` to `dist/`
- Transform them to Datacore format
- Copy them to your vault
- Watch for file changes
- Hot-reload in Obsidian when you save

## Building for Production

To build your project once without watching:

```bash
npm run build
# or
pnpm build
```

## Next Steps

Now that you have Papacore installed:

- [Create Your First Component](./guides/first-component.md)
- [Learn about the CLI](./cli/overview.md)
- [Explore the Components](./components/button.md)
- [Use the Utilities](./utilities/class-merge.md)
