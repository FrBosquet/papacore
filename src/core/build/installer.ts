import * as fs from 'node:fs';
import * as path from 'node:path';
import { copyRecursive, ensureDir, askConfirmation } from '../utils.js';

export interface InstallerOptions {
  distDir: string;
  targetVault: string;
  verbose?: boolean;
}

export class Installer {
  private distDir: string;
  private targetVault: string;
  private verbose: boolean;

  constructor(options: InstallerOptions) {
    this.distDir = options.distDir;
    this.targetVault = options.targetVault;
    this.verbose = options.verbose ?? true;
  }

  /**
   * Install (copy) files from dist to target vault
   */
  async install(skipConfirmation: boolean = false): Promise<void> {
    // Check if dist directory exists
    if (!fs.existsSync(this.distDir)) {
      console.error('Error: dist directory not found!');
      console.error('Please run build first.');
      throw new Error('dist directory not found');
    }

    // Ask for confirmation unless skipped
    if (!skipConfirmation) {
      const confirmed = await askConfirmation(this.targetVault, this.distDir);

      if (!confirmed) {
        console.log('\nInstallation cancelled.');
        return;
      }
    }

    // Create target directory if it doesn't exist
    ensureDir(this.targetVault);

    if (this.verbose) {
      console.log(`\nCopying files from ${this.distDir} to ${this.targetVault}...`);
    }

    // Copy all files from dist to target
    fs.readdirSync(this.distDir).forEach((item) => {
      const srcPath = path.join(this.distDir, item);
      const destPath = path.join(this.targetVault, item);

      copyRecursive(srcPath, destPath);

      if (this.verbose) {
        console.log(`Copied: ${item}`);
      }
    });

    if (this.verbose) {
      console.log('\nInstallation completed successfully!');
      console.log(`Files installed to: ${this.targetVault}`);
    }
  }
}
