---
sidebar_position: 2
---

# papacore dev

Start development mode with file watching, automatic building, and hot-reload.

## Usage

```bash
papacore dev
```

Or via npm/pnpm scripts:

```bash
npm run dev
# or
pnpm dev
```

## What It Does

The `dev` command runs three processes simultaneously:

1. **Build**: Transforms your TypeScript/Preact components to Datacore format
2. **Watch**: Monitors your `src/` directory for file changes
3. **Install**: Copies built files to your vault
4. **Hot-Reload**: Updates timestamps to trigger Obsidian reload

## Features

### Automatic Rebuilding

When you save any file in `src/`, Papacore:
- Detects the change instantly
- Rebuilds only the affected files
- Transforms imports/exports to Datacore format
- Copies the updated files to your vault

### Hot Reloading

For view files (`.tsx` files in `src/Datacore/views/`):
- Papacore updates a timestamp in the markdown file
- Obsidian detects the change and reloads the view
- You see your changes immediately without manual refresh

### CSS Processing

Changes to `src/styles.css`:
- Processes through Tailwind CSS v4
- Generates utility classes for all Tailwind usage
- Updates `papacore.css` in your vault
- Applies styles immediately in Obsidian

### Story Files

Component story files (`.stories.tsx`):
- Generate markdown preview files
- Create isolated component showcases
- Update automatically when stories change

## Workflow

1. Start dev mode:
   ```bash
   npm run dev
   ```

2. Open Obsidian and navigate to your views

3. Edit components in your IDE:
   ```tsx
   // src/Datacore/components/shared/button.tsx
   export function Button({ children }) {
     return <button className="px-4 py-2 bg-blue-500">{children}</button>
   }
   ```

4. Save the file - changes appear in Obsidian instantly

5. Press `Ctrl+C` to stop dev mode

## File Watching

### Watched Directories

- `src/Datacore/components/` - Component files
- `src/Datacore/views/` - View files
- `src/Datacore/utils/` - Utility files
- `src/styles.css` - Stylesheet

### Ignored Files

- `dist/` - Build output
- `node_modules/` - Dependencies
- `.git/` - Git metadata
- Files starting with `.`

## Performance

Dev mode is optimized for speed:

- Only rebuilds changed files
- Uses incremental compilation
- Minimal transformation overhead
- Fast file watching with Chokidar

## Troubleshooting

### Changes Not Appearing

If changes don't appear in Obsidian:

1. Check the terminal for build errors
2. Verify `papacore.json` has correct `vaultPath`
3. Make sure the CSS snippet is enabled in Obsidian
4. Try reloading Obsidian manually

### Build Errors

If you see build errors:

1. Check your TypeScript syntax
2. Verify all imports are correct
3. Make sure you're using Preact (not React)
4. Check the error message for details

### Performance Issues

If dev mode is slow:

1. Reduce the number of files being watched
2. Close other resource-intensive applications
3. Check your disk space
4. Restart dev mode

## Related Commands

- [`papacore build`](./build.md) - Build once without watching
