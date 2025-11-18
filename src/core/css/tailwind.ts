import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ensureDir } from '../utils.js';

export interface CSSBuilderOptions {
  projectRoot: string;
  distDir: string;
  targetVault?: string;
  verbose?: boolean;
}

export class CSSBuilder {
  private projectRoot: string;
  private distDir: string;
  private targetVault?: string;
  private verbose: boolean;

  constructor(options: CSSBuilderOptions) {
    this.projectRoot = options.projectRoot;
    this.distDir = options.distDir;
    this.targetVault = options.targetVault;
    this.verbose = options.verbose ?? true;
  }

  /**
   * Build Tailwind CSS
   */
  build(): void {
    if (this.verbose) {
      console.log('Building CSS...');
    }

    try {
      execSync('pnpm run build:css', { stdio: 'inherit', cwd: this.projectRoot });

      if (this.verbose) {
        console.log('CSS built successfully!');
      }

      // Copy CSS to vault .obsidian/snippets if target vault is set
      if (this.targetVault) {
        this.copyToVault();
      }
    } catch (error) {
      console.error('Error building CSS:', (error as Error).message);
    }
  }

  /**
   * Copy CSS to vault snippets directory
   */
  private copyToVault(): void {
    if (!this.targetVault) return;

    const cssPath = path.join(this.distDir, 'styles.css');
    if (fs.existsSync(cssPath)) {
      const snippetsDir = path.join(this.targetVault, '.obsidian', 'snippets');
      ensureDir(snippetsDir);
      const targetPath = path.join(snippetsDir, 'papacore.css');
      fs.copyFileSync(cssPath, targetPath);

      if (this.verbose) {
        console.log('CSS copied to .obsidian/snippets/papacore.css');
      }
    }
  }
}
