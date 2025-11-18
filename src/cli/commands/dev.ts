import * as fs from 'node:fs';
import * as path from 'node:path';
import { Builder } from '../../core/build/builder.js';
import { Watcher } from '../../core/build/watcher.js';
import { Scanner } from '../../core/deps/scanner.js';
import { getProjectPaths, loadConfig, askConfirmation } from '../../core/utils.js';
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

    // Ask for confirmation before starting
    logger.warn('Development mode will automatically copy files to your vault');
    const confirmed = await askConfirmation(targetVault, paths.distDir);

    if (!confirmed) {
      logger.info('Dev mode cancelled');
      process.exit(0);
    }

    // Create target vault directory if it doesn't exist
    if (!fs.existsSync(targetVault)) {
      logger.info(`Creating target directory: ${targetVault}`);
      fs.mkdirSync(targetVault, { recursive: true });
    }

    // Create builder with vault target
    const builder = new Builder({
      projectRoot: paths.projectRoot,
      srcDir: paths.srcDir,
      distDir: paths.distDir,
      babelConfigPath,
      targetVault,
      verbose: true,
    });

    // Create scanner for dependency updates
    const scanner = new Scanner({
      srcDir: paths.srcDir,
      distDir: paths.distDir,
      verbose: false,
    });

    // Create watcher with update callback
    const watcher = new Watcher({
      builder,
      srcDir: paths.srcDir,
      onUpdate: () => {
        // Update deps.json after each build
        const deps = scanner.updateDepsJson(targetVault);
        if (deps) {
          const depsPath = path.join(cwd, 'deps.json');
          fs.writeFileSync(depsPath, JSON.stringify(deps, null, 2));
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
