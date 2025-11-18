import * as path from 'node:path';
import { Installer } from '../../core/build/installer.js';
import { loadConfig } from '../../core/utils.js';
import { logger } from '../utils/logger.js';

export async function copyCommand(options?: { skipConfirmation?: boolean }): Promise<void> {
  try {
    const projectRoot = process.cwd();
    const distDir = path.join(projectRoot, 'dist');

    // Load config
    const config = loadConfig(projectRoot);

    if (!config.targetVault) {
      logger.error('No target vault configured');
      logger.info('Run "papacore config" to set your vault path');
      process.exit(1);
    }

    logger.startSpinner('Copying files to vault...');

    // Create installer and copy files
    const installer = new Installer({
      distDir,
      targetVault: config.targetVault,
      verbose: false,
    });

    await installer.install(options?.skipConfirmation ?? false);

    logger.succeedSpinner('Files copied successfully!');
    logger.info(`Installed to: ${config.targetVault}`);
  } catch (error) {
    logger.failSpinner('Copy failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}
