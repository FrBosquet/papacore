import { transformFileSync } from '@babel/core';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import { ensureDir } from '../utils.js';

const require = createRequire(import.meta.url);

export interface BuilderOptions {
  projectRoot: string;
  srcDir: string;
  distDir: string;
  babelConfigPath: string;
  targetVault?: string;
  verbose?: boolean;
  /**
   * When true, the builder runs in development mode and will not
   * modify existing markdown files or perform dependency-based reloads.
   */
  devMode?: boolean;
}

export class Builder {
  private projectRoot: string;
  private srcDir: string;
  private distDir: string;
  // Babel config shape is not strictly typed; use unknown to avoid any.
  private babelConfig: unknown;
  private targetVault?: string;
  private verbose: boolean;
   private devMode: boolean;

  constructor(options: BuilderOptions) {
    this.projectRoot = options.projectRoot;
    this.srcDir = options.srcDir;
    this.distDir = options.distDir;
    this.targetVault = options.targetVault;
    this.verbose = options.verbose ?? true;
    this.devMode = options.devMode ?? false;

    // Load babel config
    this.babelConfig = require(options.babelConfigPath);
  }

  /**
   * Get all TypeScript/TSX files in a directory recursively
   */
  getAllFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.getAllFiles(filePath, fileList);
      } else if (/\.(ts|tsx)$/.test(file) && !/\.d\.ts$/.test(file)) {
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  /**
   * Copy a single file to the vault
   */
  copyToVault(distFilePath: string): void {
    if (!this.targetVault) return;

    const relativePath = path.relative(this.distDir, distFilePath);
    const targetPath = path.join(this.targetVault, relativePath);

    // Ensure target directory exists
    ensureDir(path.dirname(targetPath));

    // Copy the file
    fs.copyFileSync(distFilePath, targetPath);
  }

  /**
   * Recursively find all views that depend on a given file
   */
  findAffectedViews(
    filePath: string,
    graph: Record<string, string[]>,
    visited: Set<string> = new Set()
  ): Set<string> {
    const affectedViews = new Set<string>();

    // Prevent infinite loops
    if (visited.has(filePath)) return affectedViews;
    visited.add(filePath);

    // If this is a view, add it
    if (filePath.startsWith('Datacore/views/')) {
      affectedViews.add(filePath);
    }

    // Find all files that depend on this file
    const dependents = graph[filePath] || [];

    // Recursively check each dependent
    for (const dependent of dependents) {
      const childViews = this.findAffectedViews(dependent, graph, visited);
      for (const view of childViews) {
        affectedViews.add(view);
      }
    }

    return affectedViews;
  }

  /**
   * Touch dependent vault files to trigger Obsidian reload
   */
  touchDependentFiles(_outPath: string): void {
    // Deprecated: Obsidian reload is now handled via the Obsidian CLI.
    // We intentionally no longer mutate markdown files or update timestamps.
    return;
  }

  /**
   * Build Tailwind CSS
   */
  buildCSS(): void {
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
    } catch (error) {
      console.error('Error building CSS:', (error as Error).message);
    }
  }

  /**
   * Compile a single file.
   *
   * Returns true on success, false on failure.
   */
  compileFile(filePath: string): boolean {
    const relativePath = path.relative(this.srcDir, filePath);
    const ext = path.extname(filePath);

    // Check if this is a .stories.tsx file
    const isStoryFile = filePath.includes('.stories.tsx');

    // Determine output extension
    let outExt: string;
    if (ext === '.tsx') {
      outExt = '.jsx';
    } else if (ext === '.ts') {
      outExt = '.js';
    } else {
      return true; // Skip other files
    }

    const outPath = path.join(this.distDir, relativePath.replace(/\.(ts|tsx)$/, outExt));

    // Ensure output directory exists
    ensureDir(path.dirname(outPath));

    try {
      // Transform the file
      const result = transformFileSync(
        filePath,
        Object.assign({}, this.babelConfig as Record<string, unknown>, {
          filename: filePath,
        })
      );

      if (!result || !result.code) {
        throw new Error('Babel transformation returned no code');
      }

      // Write output
      fs.writeFileSync(outPath, result.code);

      if (this.verbose) {
        console.log(`Compiled: ${relativePath}`);
      }

      // If this is a story file, create a corresponding .md file
      if (isStoryFile) {
        const mdPath = outPath.replace(/\.jsx$/, '.md');

        // Extract the export name from the compiled file
        const exportMatch = result.code.match(/return\s*\{\s*(\w+)\s*\}/);
        const exportName = exportMatch ? exportMatch[1] : 'default';

        // Get the relative path from dist root for the import
        const importPath = path.relative(this.distDir, outPath).replace(/\\/g, '/');

        // Generate the markdown content with datacorejsx code block
        const mdContent = `

\`\`\`datacorejsx
const { ${exportName} } = await dc.require('${importPath}');

return <${exportName} />
\`\`\`
`;
        fs.writeFileSync(mdPath, mdContent);

        if (this.verbose) {
          console.log(`Created story markdown: ${path.relative(this.distDir, mdPath)}`);
        }

        // Copy markdown to vault if target vault is set
        if (this.targetVault) {
          this.copyToVault(mdPath);
        }
      }

      // Copy to vault if target vault is set; in dev mode we still copy,
      // but we do not touch dependent markdown files.
      if (this.targetVault) {
        this.copyToVault(outPath);

        if (this.verbose) {
          console.log(`Installed: ${relativePath}`);
        }

        // Touch dependent vault files to trigger Obsidian reload
        this.touchDependentFiles(outPath);
      }
      return true;
    } catch (error) {
      console.error(`Error compiling ${relativePath}:`, (error as Error).message);
      return false;
    }
  }

  /**
   * Build all files
   */
  build(): void {
    // Clean dist directory
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true });
    }
    ensureDir(this.distDir);

    // Get all source files
    const files = this.getAllFiles(this.srcDir);

    console.log(`Building ${files.length} file(s)...\n`);

    // Suppress per-file verbose logs during the initial batch build to keep
    // output focused on the checklist UI.
    const previousVerbose = this.verbose;
    this.verbose = false;

    try {
      for (const file of files) {
        const relPath = path.relative(this.srcDir, file);

        // Show pending state
        process.stdout.write(`[ ] ${relPath}\r`);

        const ok = this.compileFile(file);

        // Overwrite line with final status
        const mark = ok ? 'x' : '!';
        process.stdout.write(`\r[${mark}] ${relPath}\n`);
      }
    } finally {
      this.verbose = previousVerbose;
    }

    // Build CSS
    this.buildCSS();

    console.log('\nBuild completed successfully!');
  }
}
