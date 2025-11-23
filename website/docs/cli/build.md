---
sidebar_position: 4
---

# papacore build

Build your project once without watching for changes.

## Usage

```bash
papacore build
```

Or via npm/pnpm scripts:

```bash
npm run build
# or
pnpm build
```

## What It Does

The `build` command:

1. **Reads** all files from `src/Datacore/`
2. **Transforms** TypeScript and JSX to JavaScript
3. **Converts** imports/exports to Datacore's `dc.require` format
4. **Processes** CSS through Tailwind
5. **Outputs** transformed files to `dist/`

## Build Process

### Component Transformation

**Input** (`src/Datacore/components/shared/button.tsx`):
```tsx
import { ComponentChildren } from 'preact';

export function Button({ children }: { children: ComponentChildren }) {
  return <button className="px-4 py-2">{children}</button>;
}
```

**Output** (`dist/components/shared/button.jsx`):
```js
const { ComponentChildren } = dc.api;

const Button = ({ children }) => {
  return dc.h('button', { className: 'px-4 py-2' }, children);
};

return { Button };
```

### View Transformation

**Input** (`src/Datacore/views/Sample.tsx`):
```tsx
import { Button } from '@/components/shared/button';

export default function Sample() {
  return <div><Button>Click me</Button></div>;
}
```

**Output** (`dist/views/Sample.jsx`):
```js
const { Button } = await dc.require('Datacore/components/shared/button');

return async () => {
  return dc.h('div', null, dc.h(Button, null, 'Click me'));
};
```

### CSS Processing

**Input** (`src/styles.css`):
```css
@import "tailwindcss";

.custom-class {
  @apply text-blue-500 font-bold;
}
```

**Output** (`dist/papacore.css`):
```css
/* Tailwind utilities + your custom classes */
.text-blue-500 { color: rgb(59 130 246); }
.font-bold { font-weight: 700; }
.custom-class { color: rgb(59 130 246); font-weight: 700; }
/* ... */
```

## Output Structure

After building, `dist/` mirrors your `src/Datacore/` structure:

```
dist/
├── components/
│   └── shared/
│       ├── button.jsx
│       ├── dialog.jsx
│       └── link.jsx
├── utils/
│   ├── classMerge.js
│   ├── classVariants.js
│   ├── files.js
│   ├── markdown.js
│   └── time.js
├── views/
│   └── Sample.jsx
└── papacore.css
```

## Build Options

The build command reads configuration from `papacore.json`:

```json
{
  "vaultPath": "/path/to/vault"
}
```

## When to Use

Use `build` instead of `dev` when:

- **Testing**: You want to verify the build output
- **CI/CD**: Running in a pipeline
- **Debugging**: Inspecting transformed code
- **One-off**: Not actively developing

Use `dev` for regular development work.

## Build Performance

Build time depends on:

- Number of components
- Size of CSS file
- Complexity of transformations

Typical build times:
- Small project (5-10 files): < 1 second
- Medium project (20-50 files): 1-3 seconds
- Large project (100+ files): 3-5 seconds

## After Building

After building, you can:

1. **Inspect output** in `dist/` directory
2. **Install to vault** with `papacore install`
3. **Test in Obsidian** by opening view files

## Troubleshooting

### Build Fails

Check for:
- TypeScript errors in your code
- Invalid JSX syntax
- Missing imports
- Incorrect file paths

### Output Incorrect

Verify:
- Babel config is correct
- File paths use correct separators
- Imports use proper aliases (`@/` for `src/Datacore/`)

### CSS Not Processing

Ensure:
- `styles.css` exists in `src/`
- Tailwind config is valid
- PostCSS config is present

## Related Commands

- [`papacore dev`](./dev.md) - Build + watch + install
