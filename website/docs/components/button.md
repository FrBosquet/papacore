---
sidebar_position: 1
---

# Button

A flexible button component with variants, sizes, icons, and loading states.

## Basic Usage

```tsx
import { Button } from '@/components/shared/button';

export default function MyView() {
  return <Button>Click me</Button>;
}
```

## Variants

The Button component supports three visual variants:

### Default (Primary)

```tsx
<Button variant="default">Primary Button</Button>
```

Styled with the accent theme color, suitable for primary actions.

### Secondary

```tsx
<Button variant="secondary">Secondary Button</Button>
```

Styled with the contrast theme color, suitable for secondary actions.

### Warning

```tsx
<Button variant="warning">Delete</Button>
```

Styled in red, suitable for destructive or warning actions.

## Sizes

Control button size with the `size` prop:

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">⚙</Button>
<Button size="icon-xs">⚙</Button>
```

- **sm**: Compact button for tight spaces
- **default**: Standard button size
- **lg**: Larger button for emphasis
- **icon**: Square button for single icons
- **icon-xs**: Extra small square button

## Icons

Add icons before or after the button text:

```tsx
<Button icon="plus">Add Item</Button>
<Button iconRight="arrow-right">Next</Button>
<Button icon="trash" iconRight="arrow-right">Delete & Continue</Button>
```

Icons use Datacore's icon system.

## Loading State

Show a loading spinner while async actions complete:

```tsx
function MyView() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await someAsyncOperation();
    setLoading(false);
  };

  return (
    <Button isLoading={loading} onClick={handleClick}>
      Save
    </Button>
  );
}
```

When `isLoading` is true:
- Button becomes disabled
- Loading spinner appears
- Original content fades out

## Disabled State

Disable user interaction:

```tsx
<Button disabled>Cannot Click</Button>
```

Disabled buttons:
- Have reduced opacity
- Show not-allowed cursor
- Don't respond to clicks

## Click Handler

Handle button clicks:

```tsx
<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>
```

## Custom Styling

Add custom classes with `className`:

```tsx
<Button className="w-full mt-4">Full Width Button</Button>
```

Custom classes are merged with variant classes using `classMerge`, preventing Tailwind conflicts.

## Accessibility

### Tooltips

Add accessible labels:

```tsx
<Button size="icon" icon="settings" tooltip="Open settings" />
```

Sets the `aria-label` attribute for screen readers.

### Button Types

Specify HTML button types:

```tsx
<Button type="submit">Submit Form</Button>
<Button type="reset">Reset</Button>
<Button type="button">Regular Button</Button> {/* default */}
```

## Complete Example

```tsx
import { Button } from '@/components/shared/button';
import { useState } from 'preact/hooks';

export default function CompleteExample() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        icon="save"
        onClick={handleSave}
        isLoading={loading}
      >
        Save Changes
      </Button>

      <Button variant="secondary">
        Cancel
      </Button>

      <Button
        variant="warning"
        icon="trash"
        disabled={loading}
      >
        Delete
      </Button>
    </div>
  );
}
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ComponentChildren` | - | Button content |
| `variant` | `'default' \| 'secondary' \| 'warning'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'default' \| 'lg' \| 'icon' \| 'icon-xs'` | `'default'` | Button size |
| `icon` | `IconName` | - | Icon before text |
| `iconRight` | `IconName` | - | Icon after text |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disable interaction |
| `isLoading` | `boolean` | `false` | Show loading state |
| `tooltip` | `string` | - | Accessible label |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `label` | `string \| null` | - | Alternative to children |

## Theming

The Button component uses CSS variables from your theme:

- `--theme-accent` - Primary button background
- `--theme-accent-hover` - Primary button hover
- `--theme-accent-disabled` - Primary button disabled
- `--theme-contrast` - Secondary button background
- `--theme-contrast-hover` - Secondary button hover
- `--theme-contrast-disabled` - Secondary button disabled

Customize these in your `styles.css` or use the `papacore theme` command to generate them from your Obsidian theme.
