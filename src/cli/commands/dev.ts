import * as path from 'node:path';
import { Builder } from '../../core/build/builder.js';
import { Watcher } from '../../core/build/watcher.js';
import { getProjectPaths, loadConfig, askConfirmation } from '../../core/utils.js';
import { isObsidianCliAvailable, reloadDatacorePlugin } from '../../core/obsidian/cli.js';
import { logger } from '../utils/logger.js';

export async function devCommand(): Promise<void> {
  try {
    const cwd = process.cwd();
    const paths = getProjectPaths(cwd);

    // Load config for target vault
    const config = loadConfig(paths.configPath);
    const targetVault = config.targetVault;

    // Check if we're in a papacore project
    const babelConfigPath = path.join(cwd, 'babel.config.js');

    // Ensure Obsidian CLI is available before starting dev mode
    if (!isObsidianCliAvailable()) {
      logger.error("Obsidian CLI ('obsidian') not found on PATH.");
      logger.error('Dev mode requires the Obsidian CLI to reload the Datacore plugin.');
      process.exit(1);
    }

    // Ask for confirmation before starting
    logger.warn('Development mode will rebuild your project, copy dist files to your vault, and reload the Datacore plugin via the Obsidian CLI.');
    const confirmed = await askConfirmation(
      targetVault,
      paths.distDir,
      [
        `Files will be automatically copied from ${paths.distDir} to ${targetVault}.`,
        'Existing vault files with the same paths will be overwritten, but markdown files that require Datacore views will NOT be modified.',
        'Papacore will also call obsidian plugin reload id=datacore on changes.',
      ].join('\n')
    );

    if (!confirmed) {
      logger.info('Dev mode cancelled');
      process.exit(0);
    }

    // Create builder in dev mode – copies dist files to the vault,
    // but will not modify existing markdown files or use deps.json.
    const builder = new Builder({
      projectRoot: paths.projectRoot,
      srcDir: paths.srcDir,
      distDir: paths.distDir,
      babelConfigPath,
      targetVault,
      verbose: true,
      devMode: true,
    });

    // Create watcher with reload callback
    const watcher = new Watcher({
      builder,
      srcDir: paths.srcDir,
      onAfterCompile: () => {
        const ok = reloadDatacorePlugin();
        if (!ok) {
          logger.warn('Failed to reload Datacore plugin via Obsidian CLI.');
        }
      },
    });

    logger.success('Starting development mode...');
    logger.info('Press Ctrl+C to stop');

    // Start watching
    watcher.watch();
  } catch (error) {
    logger.error('Dev mode failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}
