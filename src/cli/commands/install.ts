import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDir } from '../../core/utils.js';
import {
  getItem,
  listAll,
  resolveDependencies,
  type InstallableItem,
} from '../../core/registry.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Install a component, utility, or view by name
 */
export async function installCommand(itemName?: string): Promise<void> {
  try {
    // If no item name provided, list available items
    if (!itemName) {
      listAvailableItems();
      return;
    }

    // Check if we're in a papacore project
    const projectRoot = process.cwd();
    const papacoreConfigPath = path.join(projectRoot, 'papacore.json');
    if (!fs.existsSync(papacoreConfigPath)) {
      logger.error(
        'Not in a Papacore project. Run this command from your project root.'
      );
      process.exit(1);
    }

    const item = getItem(itemName);
    if (!item) {
      logger.error(`Item "${itemName}" not found in registry`);
      console.log('');
      logger.info('Available items:');
      listAvailableItems();
      process.exit(1);
    }

    // Resolve all dependencies
    const itemsToInstall = resolveDependencies(itemName);

    logger.startSpinner(`Installing ${item.name}...`);

    // Get templates directory
    const templatesDir = path.join(__dirname, '../../../templates');
    const templateSrcDir = path.join(templatesDir, 'src/Datacore');

    // Install each item
    for (const itemToInstall of itemsToInstall) {
      await installItem(itemToInstall, templateSrcDir, projectRoot);
    }

    logger.succeedSpinner(`Successfully installed ${item.name}`);

    // Show what was installed
    if (itemsToInstall.length > 1) {
      console.log('');
      logger.info('Installed items:');
      for (const installed of itemsToInstall) {
        const isDep = installed.name !== item.name;
        console.log(
          `  ${isDep ? '└─' : '●'} ${installed.name} ${isDep ? '(dependency)' : ''}`
        );
      }
    }

    console.log('');
  } catch (error) {
    logger.failSpinner('Installation failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}

/**
 * Install a single item
 */
async function installItem(
  item: InstallableItem,
  templateSrcDir: string,
  projectRoot: string
): Promise<void> {
  const sourcePath = path.join(templateSrcDir, item.sourcePath);
  const targetPath = path.join(projectRoot, 'src/Datacore', item.targetPath);

  // Check if file already exists
  if (fs.existsSync(targetPath)) {
    logger.warn(`Skipping ${item.name}: already exists at ${item.targetPath}`);
    return;
  }

  // Ensure target directory exists
  const targetDir = path.dirname(targetPath);
  ensureDir(targetDir);

  // Copy the file
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Template file not found: ${sourcePath}`);
  }

  fs.copyFileSync(sourcePath, targetPath);
}

/**
 * List all available items grouped by category
 */
function listAvailableItems(): void {
  const items = listAll();

  const byCategory = {
    component: items.filter((i) => i.category === 'component'),
    util: items.filter((i) => i.category === 'util'),
    view: items.filter((i) => i.category === 'view'),
  };

  console.log('');
  logger.info('Available items to install:');
  console.log('');

  if (byCategory.component.length > 0) {
    logger.success('Components:');
    for (const item of byCategory.component) {
      console.log(`  ${item.name.padEnd(20)} - ${item.description}`);
    }
    console.log('');
  }

  if (byCategory.util.length > 0) {
    logger.success('Utilities:');
    for (const item of byCategory.util) {
      console.log(`  ${item.name.padEnd(20)} - ${item.description}`);
    }
    console.log('');
  }

  if (byCategory.view.length > 0) {
    logger.success('Views:');
    for (const item of byCategory.view) {
      console.log(`  ${item.name.padEnd(20)} - ${item.description}`);
    }
    console.log('');
  }

  logger.info('Usage: papacore install <item-name>');
  console.log('');
}
