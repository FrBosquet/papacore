import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Detect which package manager is managing the global papacore installation
 */
function detectPackageManager(): string | null {
  try {
    // Get the path to papacore binary
    const papacorePath = execSync('which papacore', { encoding: 'utf-8' }).trim();

    if (!papacorePath) {
      return null;
    }

    // Check for each package manager's global installation path patterns
    if (papacorePath.includes('/.npm/') || papacorePath.includes('/npm/')) {
      return 'npm';
    }

    if (papacorePath.includes('/.pnpm/') || papacorePath.includes('/pnpm/')) {
      return 'pnpm';
    }

    if (papacorePath.includes('/.yarn/') || papacorePath.includes('/yarn/')) {
      return 'yarn';
    }

    // Fallback: try to determine from parent directory structure
    if (papacorePath.includes('/node_modules/')) {
      // Default to npm if we can't determine
      return 'npm';
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Get the install command for a package manager
 */
function getInstallCommand(packageManager: string): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install -g papacore';
    case 'pnpm':
      return 'pnpm add -g papacore';
    case 'yarn':
      return 'yarn global add papacore';
    default:
      return 'npm install -g papacore';
  }
}

/**
 * Get current version from package.json
 */
function getCurrentVersion(): string {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, '../../../package.json'), 'utf-8')
    );
    return packageJson.version;
  } catch (err) {
    return 'unknown';
  }
}

/**
 * Get installed version after update
 */
function getInstalledVersion(): string {
  try {
    const version = execSync('papacore --version', { encoding: 'utf-8' }).trim();
    return version;
  } catch (err) {
    return 'unknown';
  }
}

/**
 * Update the globally installed papacore CLI
 */
export async function updateCliCommand(): Promise<void> {
  try {
    // Get current version before updating
    const currentVersion = getCurrentVersion();
    logger.info(`Current version: ${currentVersion}`);

    logger.info('Detecting package manager...');

    const packageManager = detectPackageManager();

    if (!packageManager) {
      logger.warn('Could not detect package manager automatically');
      logger.info('Please update manually with one of:');
      console.log('  npm install -g papacore');
      console.log('  pnpm add -g papacore');
      console.log('  yarn global add papacore');
      process.exit(1);
    }

    logger.info(`Detected package manager: ${packageManager}`);

    const command = getInstallCommand(packageManager);
    logger.info(`Running: ${command}`);
    console.log('');

    // Run the update command
    execSync(command, { stdio: 'inherit' });

    // Get new version after update
    const newVersion = getInstalledVersion();

    console.log('');
    logger.success(`Updated from v${currentVersion} to v${newVersion}!`);
  } catch (err) {
    logger.error(
      `Failed to update CLI: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}
