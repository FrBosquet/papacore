---
sidebar_position: 1
---

# classMerge

Safely merge Tailwind CSS classes without conflicts.

## Overview

`classMerge` is a utility function that intelligently combines CSS class names, preventing Tailwind class conflicts. When multiple classes affect the same property, the last one wins.

## Usage

```tsx
import { classMerge } from '@/utils/classMerge';

const className = classMerge('text-red-500', 'text-blue-500');
// Result: 'text-blue-500' (blue wins)
```

## Why It's Needed

Without `classMerge`, conflicting Tailwind classes can cause unpredictable styling:

```tsx
// Wrong - both classes applied, order matters
<div className="bg-red-500 bg-blue-500">...</div>

// Right - classMerge resolves the conflict
<div className={classMerge('bg-red-500', 'bg-blue-500')}>...</div>
```

## Common Use Cases

### Component with Custom Styles

```tsx
type ButtonProps = {
  className?: string;
  variant?: 'primary' | 'secondary';
};

function Button({ className, variant = 'primary' }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-semibold';
  const variantClasses = variant === 'primary'
    ? 'bg-blue-500 text-white'
    : 'bg-gray-200 text-gray-800';

  return (
    <button className={classMerge(baseClasses, variantClasses, className)}>
      Click me
    </button>
  );
}

// Usage - custom className can override defaults
<Button className="bg-green-500" />
// Result: green background instead of blue
```

### Conditional Styling

```tsx
function Alert({ type, className }: { type: 'info' | 'error', className?: string }) {
  return (
    <div className={classMerge(
      'p-4 rounded border',
      type === 'error' ? 'bg-red-100 border-red-500' : 'bg-blue-100 border-blue-500',
      className
    )}>
      Alert content
    </div>
  );
}
```

### Combining Multiple Sources

```tsx
function Card({
  size = 'default',
  highlighted = false,
  className
}: CardProps) {
  return (
    <div className={classMerge(
      'border rounded',
      size === 'large' ? 'p-6' : 'p-4',
      highlighted && 'ring-2 ring-blue-500',
      className
    )}>
      Content
    </div>
  );
}
```

## How It Works

`classMerge` uses intelligent parsing to:

1. **Detect conflicts**: Identifies when multiple classes affect the same property
2. **Resolve priority**: Later classes override earlier ones
3. **Preserve uniqueness**: Removes duplicate classes
4. **Handle modifiers**: Respects responsive/state modifiers (hover:, dark:, etc.)

## Examples

### Basic Conflicts

```tsx
classMerge('text-sm', 'text-lg')
// Result: 'text-lg'

classMerge('p-4', 'p-8')
// Result: 'p-8'

classMerge('bg-red-500', 'bg-blue-500', 'bg-green-500')
// Result: 'bg-green-500'
```

### No Conflicts

```tsx
classMerge('text-red-500', 'font-bold', 'underline')
// Result: 'text-red-500 font-bold underline'
```

### Responsive Modifiers

```tsx
classMerge('text-sm', 'md:text-lg', 'lg:text-xl')
// Result: 'text-sm md:text-lg lg:text-xl' (no conflict, different breakpoints)
```

### State Modifiers

```tsx
classMerge('bg-blue-500', 'hover:bg-blue-600', 'active:bg-blue-700')
// Result: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
```

### Falsy Values

```tsx
classMerge('text-lg', false, null, undefined, 'font-bold')
// Result: 'text-lg font-bold' (falsy values ignored)
```

## With classVariants

`classMerge` works perfectly with `classVariants`:

```tsx
import { classMerge } from '@/utils/classMerge';
import { classVariants } from '@/utils/classVariants';

const buttonVariants = classVariants({
  base: 'px-4 py-2 rounded',
  variants: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  },
});

function Button({ variant, className }) {
  return (
    <button className={classMerge(buttonVariants(variant), className)}>
      Click me
    </button>
  );
}
```

## Implementation

The function is based on [tailwind-merge](https://github.com/dcastil/tailwind-merge), a battle-tested solution for Tailwind class merging.

## Related

- [Button Component](../components/button.md) - Uses classMerge extensively
