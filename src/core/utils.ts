import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

export interface PapacoreConfig {
  targetVault: string;
}

/**
 * Get project directories based on a project root path
 */
export function getProjectPaths(projectRoot: string) {
  return {
    projectRoot,
    srcDir: path.join(projectRoot, 'src'),
    distDir: path.join(projectRoot, 'dist'),
    configPath: path.join(projectRoot, 'papacore.json'),
  };
}

/**
 * Load and validate the papacore.json configuration
 */
export function loadConfig(configPath: string): PapacoreConfig {
  if (!fs.existsSync(configPath)) {
    console.error('Error: papacore.json not found!');
    console.error('Please create a papacore.json file with a "targetVault" property.');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (!config.targetVault) {
    console.error('Error: "targetVault" not specified in papacore.json');
    process.exit(1);
  }

  return config;
}

/**
 * Ask user for confirmation before overwriting files
 */
export function askConfirmation(
  targetVault: string,
  distDir: string,
  message?: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('\n\x1b[31m⚠️  WARNING ⚠️\x1b[0m');
    if (message) {
      console.log(message);
    } else {
      console.log(`This will copy files from ${distDir} to ${targetVault}`);
      console.log('Any matching files in the target directory will be OVERWRITTEN.');
    }
    console.log('This action CANNOT be undone.');
    console.log('');

    rl.question('Do you want to continue? (Y/N): ', (answer) => {
      rl.close();
      const normalized = answer.trim().toUpperCase();
      if (normalized === 'Y' || normalized === 'YES') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * Copy files/directories recursively
 */
export function copyRecursive(src: string, dest: string): void {
  if (!fs.existsSync(src)) {
    return;
  }

  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * Ensure a directory exists, creating it if necessary
 */
export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
