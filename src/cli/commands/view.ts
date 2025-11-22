import { spawn } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { logger } from '../utils/logger.js';

/**
 * Get all view files from dist/Datacore/views directory
 */
function getViews(): string[] {
  const viewsDir = join(process.cwd(), 'dist', 'Datacore', 'views');

  if (!existsSync(viewsDir)) {
    return [];
  }

  const files = readdirSync(viewsDir);
  return files
    .filter((file) => file.endsWith('.jsx'))
    .map((file) => file.replace('.jsx', ''));
}

/**
 * Generate datacorejsx markdown snippet
 */
function generateSnippet(viewName: string): string {
  return `\`\`\`datacorejsx
const { ${viewName} } = await dc.require("Datacore/views/${viewName}.jsx");

return <${viewName} />;
\`\`\``;
}

/**
 * Copy text to clipboard using pbcopy
 */
async function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const pbcopy = spawn('pbcopy');

    pbcopy.stdin.write(text);
    pbcopy.stdin.end();

    pbcopy.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`pbcopy exited with code ${code}`));
      }
    });

    pbcopy.on('error', (err) => {
      reject(new Error(`Failed to run pbcopy: ${err.message}`));
    });
  });
}

/**
 * Generate a basic view template
 */
function generateViewTemplate(viewName: string): string {
  return `export const ${viewName} = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${viewName}</h1>
      <p>Your view content here</p>
    </div>
  );
};
`;
}

/**
 * List all views
 */
export async function listViewsCommand(): Promise<void> {
  try {
    const views = getViews();

    if (views.length === 0) {
      logger.info('No views found in dist/Datacore/views/');
      logger.info('Create a view with: papacore view add <name>');
      return;
    }

    logger.info('Available views:');
    console.log('');
    views.forEach((view) => {
      console.log(`  • ${view}`);
    });
    console.log('');
  } catch (err) {
    logger.error(
      `Failed to list views: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}

/**
 * Add a new view
 */
export async function addViewCommand(viewName: string): Promise<void> {
  try {
    if (!viewName) {
      logger.error('View name is required');
      logger.info('Usage: papacore view add <name>');
      process.exit(1);
    }

    // Validate view name (PascalCase convention)
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(viewName)) {
      logger.error('View name must be in PascalCase (e.g., MyView, Dashboard)');
      process.exit(1);
    }

    const srcViewsDir = join(process.cwd(), 'src', 'Datacore', 'views');
    const viewPath = join(srcViewsDir, `${viewName}.tsx`);

    // Check if view already exists
    if (existsSync(viewPath)) {
      logger.error(`View "${viewName}" already exists at ${viewPath}`);
      process.exit(1);
    }

    // Generate view template
    const template = generateViewTemplate(viewName);
    writeFileSync(viewPath, template, 'utf-8');

    logger.success(`Created view: ${viewName}`);
    logger.info(`Location: src/Datacore/views/${viewName}.tsx`);
    logger.info('Build your project to use it: papacore build');
  } catch (err) {
    logger.error(
      `Failed to add view: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}

/**
 * Copy a view snippet - interactive selection
 */
export async function copyViewCommand(): Promise<void> {
  try {
    const views = getViews();

    if (views.length === 0) {
      logger.error('No views found in dist/Datacore/views/');
      logger.info('Build your project first with: papacore build');
      process.exit(1);
    }

    // Show available views
    logger.info('Available views:');
    console.log('');
    views.forEach((view, index) => {
      console.log(`  ${index + 1}. ${view}`);
    });
    console.log('');

    // Prompt for selection
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question('Select a view (number or name): ');
    rl.close();

    let selectedView: string | undefined;

    // Try to parse as number
    const num = Number.parseInt(answer.trim(), 10);
    if (!Number.isNaN(num) && num > 0 && num <= views.length) {
      selectedView = views[num - 1];
    } else {
      // Try to match by name
      selectedView = views.find((v) => v.toLowerCase() === answer.trim().toLowerCase());
    }

    if (!selectedView) {
      logger.error('Invalid selection');
      process.exit(1);
    }

    // Generate snippet
    const snippet = generateSnippet(selectedView);

    // Copy to clipboard
    await copyToClipboard(snippet);

    logger.success(`Snippet for "${selectedView}" copied to clipboard!`);
    console.log('');
    console.log(snippet);
  } catch (err) {
    logger.error(
      `Failed to copy snippet: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}
