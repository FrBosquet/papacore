import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { getProjectPaths } from '../../core/utils.js';
import { logger } from '../utils/logger.js';

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function configCommand(): Promise<void> {
  try {
    const cwd = process.cwd();
    const paths = getProjectPaths(cwd);

    logger.info('Configure Papacore');
    console.log('');

    // Check if config exists
    let currentConfig: any = {};
    if (fs.existsSync(paths.configPath)) {
      currentConfig = JSON.parse(fs.readFileSync(paths.configPath, 'utf-8'));
      logger.info(`Current vault path: ${currentConfig.targetVault || 'not set'}`);
      console.log('');
    }

    // Ask for vault path
    const vaultPath = await askQuestion(
      'Enter the absolute path to your vault (or press Enter to keep current): '
    );

    if (vaultPath) {
      // Validate path exists
      if (!fs.existsSync(vaultPath)) {
        const create = await askQuestion(
          `Path doesn't exist. Create it? (Y/N): `
        );

        if (create.toUpperCase() === 'Y' || create.toUpperCase() === 'YES') {
          fs.mkdirSync(vaultPath, { recursive: true });
          logger.success(`Created directory: ${vaultPath}`);
        } else {
          logger.error('Configuration cancelled - path does not exist');
          process.exit(1);
        }
      }

      // Save config
      const config = {
        ...currentConfig,
        targetVault: vaultPath,
      };

      fs.writeFileSync(paths.configPath, JSON.stringify(config, null, 2));
      logger.success('Configuration saved!');
      logger.info(`Vault path: ${vaultPath}`);
    } else if (!currentConfig.targetVault) {
      logger.error('No vault path provided');
      process.exit(1);
    } else {
      logger.info('Configuration unchanged');
    }
  } catch (error) {
    logger.error('Configuration failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}
