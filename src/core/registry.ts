/**
 * Registry of installable components and utilities
 * Maps component names to their source files and dependencies
 */

export type InstallableItem = {
  /** Display name for the item */
  name: string;
  /** Description of what this item does */
  description: string;
  /** Category: component, util, view, or tooling */
  category: 'component' | 'util' | 'view' | 'tooling';
  /** Relative path from templates/ (for tooling) or templates/src/Datacore/ (for others) */
  sourcePath: string;
  /** Target path in user project */
  targetPath: string;
  /** Dependencies (other items that must be installed first) */
  dependencies: string[];
};

export const REGISTRY: Record<string, InstallableItem> = {
  // Utilities
  classmerge: {
    name: 'classMerge',
    description: 'Utility to merge Tailwind CSS classes without conflicts',
    category: 'util',
    sourcePath: 'utils/classMerge.ts',
    targetPath: 'utils/classMerge.ts',
    dependencies: [],
  },
  classvariants: {
    name: 'classVariants',
    description: 'Utility for creating component variants with type safety',
    category: 'util',
    sourcePath: 'utils/classVariants.ts',
    targetPath: 'utils/classVariants.ts',
    dependencies: ['classmerge'],
  },
  markdown: {
    name: 'markdown',
    description: 'Utilities for working with markdown and frontmatter',
    category: 'util',
    sourcePath: 'utils/markdown.ts',
    targetPath: 'utils/markdown.ts',
    dependencies: [],
  },
  files: {
    name: 'files',
    description: 'Utilities for file and resource path operations',
    category: 'util',
    sourcePath: 'utils/files.ts',
    targetPath: 'utils/files.ts',
    dependencies: [],
  },
  time: {
    name: 'time',
    description: 'Utilities for date and time formatting',
    category: 'util',
    sourcePath: 'utils/time.ts',
    targetPath: 'utils/time.ts',
    dependencies: [],
  },

  // Components
  button: {
    name: 'button',
    description: 'Button component with variants and loading states',
    category: 'component',
    sourcePath: 'components/shared/button.tsx',
    targetPath: 'components/shared/button.tsx',
    dependencies: ['classmerge', 'classvariants'],
  },
  dialog: {
    name: 'dialog',
    description: 'Dialog/modal component with useDialog hook',
    category: 'component',
    sourcePath: 'components/shared/dialog.tsx',
    targetPath: 'components/shared/dialog.tsx',
    dependencies: ['classmerge', 'button'],
  },
  link: {
    name: 'link',
    description: 'Link component for navigating to vault notes tooltips',
    category: 'component',
    sourcePath: 'components/shared/link.tsx',
    targetPath: 'components/shared/link.tsx',
    dependencies: ['classmerge', 'files'],
  },

  // Views
  sample: {
    name: 'sample',
    description: 'Sample view component with usage examples',
    category: 'view',
    sourcePath: 'views/Sample.tsx',
    targetPath: 'views/Sample.tsx',
    dependencies: [],
  },

  // Tooling
  biome: {
    name: 'biome',
    description: 'Biome configuration for linting and formatting',
    category: 'tooling',
    sourcePath: 'config/biome.json',
    targetPath: 'biome.json',
    dependencies: [],
  },
  vscode: {
    name: 'vscode',
    description: 'VS Code settings for Tailwind IntelliSense',
    category: 'tooling',
    sourcePath: 'vscode/settings.json',
    targetPath: '.vscode/settings.json',
    dependencies: [],
  },
};

/**
 * Get an item from the registry
 */
export function getItem(name: string): InstallableItem | undefined {
  return REGISTRY[name.toLowerCase()];
}

/**
 * Get all items of a specific category
 */
export function getItemsByCategory(
  category: 'component' | 'util' | 'view'
): InstallableItem[] {
  return Object.values(REGISTRY).filter((item) => item.category === category);
}

/**
 * Resolve dependencies recursively
 * Returns array of items in installation order (dependencies first)
 */
export function resolveDependencies(itemName: string): InstallableItem[] {
  const item = getItem(itemName);
  if (!item) {
    return [];
  }

  const resolved: InstallableItem[] = [];
  const seen = new Set<string>();

  function resolve(name: string) {
    if (seen.has(name)) return;
    seen.add(name);

    const current = getItem(name);
    if (!current) return;

    // Resolve dependencies first
    for (const dep of current.dependencies) {
      resolve(dep);
    }

    resolved.push(current);
  }

  resolve(itemName);
  return resolved;
}

/**
 * List all available items
 */
export function listAll(): InstallableItem[] {
  return Object.values(REGISTRY);
}
