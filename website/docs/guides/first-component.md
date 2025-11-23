---
sidebar_position: 1
---

# Your First Component

Learn how to create a custom component from scratch in Papacore.

## Prerequisites

Before starting, make sure you have:

- [Installed Papacore](../installation.md)
- [Configured your vault path](../cli/config.md)
- Started development mode (`npm run dev`)

## Creating a Simple Component

Let's create a `Card` component that displays content in a styled container.

### 1. Create the Component File

Create a new file: `src/Datacore/components/shared/card.tsx`

```tsx
import type { ComponentChildren } from 'preact';

export type CardProps = {
  title?: string;
  children: ComponentChildren;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={`border border-gray-300 rounded-lg p-4 ${className || ''}`}>
      {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
```

### 2. Save and Watch It Build

When you save the file, Papacore automatically:

1. Detects the new file
2. Transforms TypeScript → JavaScript
3. Converts imports/exports to Datacore format
4. Copies to your vault at `Datacore/components/shared/card.jsx`

Check your terminal for build confirmation:

```
✓ Built card.tsx → card.jsx
```

### 3. Use It in a View

Create or update a view file: `src/Datacore/views/MyView.tsx`

```tsx
import { Card } from '@/components/shared/card';

export default function MyView() {
  return (
    <div>
      <Card title="Hello Papacore">
        This is my first custom component!
      </Card>
    </div>
  );
}
```

### 4. Create a Markdown File

In your Obsidian vault, create a note to render your view:

````markdown
# My First View

```datacore-view
Datacore/views/MyView
```
````

### 5. See It in Obsidian

Open the note in Obsidian - you should see your Card component rendered!

## Adding Tailwind Styles

Let's improve our Card with better Tailwind styling:

```tsx
import type { ComponentChildren } from 'preact';
import { classMerge } from '@/utils/classMerge';

export type CardProps = {
  title?: string;
  children: ComponentChildren;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
  return (
    <div
      className={classMerge(
        'rounded-lg border border-gray-200',
        'bg-white shadow-sm',
        'p-6',
        'dark:bg-gray-800 dark:border-gray-700',
        className
      )}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}
```

Key improvements:

- **Dark mode support** with `dark:` variants
- **Shadow** for depth
- **Better spacing** with `p-6`, `mb-3`
- **classMerge** to safely combine classes

## Adding Variants with classVariants

Let's add visual variants using the `classVariants` utility:

```tsx
import type { ComponentChildren } from 'preact';
import { classMerge } from '@/utils/classMerge';
import { classVariants } from '@/utils/classVariants';

const cardVariants = classVariants({
  base: 'rounded-lg border p-6',
  variants: {
    default: 'bg-white border-gray-200 shadow-sm',
    primary: 'bg-blue-50 border-blue-300 shadow-md',
    warning: 'bg-yellow-50 border-yellow-300 shadow-md',
    danger: 'bg-red-50 border-red-300 shadow-md',
  },
});

export type CardProps = {
  title?: string;
  children: ComponentChildren;
  className?: string;
  variant?: 'default' | 'primary' | 'warning' | 'danger';
};

export function Card({ title, children, className, variant = 'default' }: CardProps) {
  return (
    <div className={classMerge(cardVariants(variant), className)}>
      {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
```

Now you can use different variants:

```tsx
<Card variant="primary" title="Info">Important information</Card>
<Card variant="warning" title="Warning">Be careful!</Card>
<Card variant="danger" title="Error">Something went wrong</Card>
```

## Creating a Story

Stories let you preview components in isolation. Create `src/Datacore/components/shared/card.stories.tsx`:

```tsx
import { Card } from './card';

export const Default = () => (
  <Card title="Default Card">
    This is a default card with some content.
  </Card>
);

export const Primary = () => (
  <Card title="Primary Card" variant="primary">
    This is a primary variant card.
  </Card>
);

export const Warning = () => (
  <Card title="Warning" variant="warning">
    This is a warning message.
  </Card>
);

export const NoTitle = () => (
  <Card>
    A card without a title.
  </Card>
);
```

Papacore automatically generates a markdown file in your vault at `Datacore/components/shared/card.stories.md` that shows all your stories.

## Adding Interactivity

Let's add a collapsible Card:

```tsx
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { classMerge } from '@/utils/classMerge';
import { Button } from './button';

export type CardProps = {
  title?: string;
  children: ComponentChildren;
  className?: string;
  collapsible?: boolean;
};

export function Card({ title, children, className, collapsible = false }: CardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={classMerge('rounded-lg border border-gray-200 bg-white p-6', className)}>
      {title && (
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          {collapsible && (
            <Button
              size="icon-xs"
              icon={isOpen ? 'chevron-up' : 'chevron-down'}
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </div>
      )}
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

Usage:

```tsx
<Card title="Collapsible Card" collapsible>
  This content can be hidden!
</Card>
```

## Next Steps

Now that you've created your first component:

- Explore [other included components](../components/button.md)
- Learn about [utilities](../utilities/class-merge.md)
- Read the [CLI reference](../cli/overview.md)
- Check out [Tailwind documentation](https://tailwindcss.com/docs) for styling
