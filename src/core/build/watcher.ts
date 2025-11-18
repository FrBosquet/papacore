import * as fs from 'node:fs';
import * as path from 'node:path';
import { Builder } from './builder.js';

export interface WatcherOptions {
  builder: Builder;
  srcDir: string;
  onUpdate?: () => void;
}

export class Watcher {
  private builder: Builder;
  private srcDir: string;
  private compiledFiles: Set<string>;
  private onUpdate?: () => void;

  constructor(options: WatcherOptions) {
    this.builder = options.builder;
    this.srcDir = options.srcDir;
    this.compiledFiles = new Set();
    this.onUpdate = options.onUpdate;
  }

  /**
   * Start watching for file changes
   */
  watch(): void {
    console.log('Building initial files...');
    this.builder.build();

    // Keep track of previously compiled files
    this.compiledFiles = new Set(this.builder.getAllFiles(this.srcDir));

    console.log(`\nWatching for changes in ${this.srcDir}...`);

    fs.watch(this.srcDir, { recursive: true }, (_eventType, filename) => {
      if (!filename) return;

      const filePath = path.join(this.srcDir, filename);

      // Only recompile .ts and .tsx files (exclude .d.ts files)
      if (/\.(ts|tsx)$/.test(filePath) && !/\.d\.ts$/.test(filePath) && fs.existsSync(filePath)) {
        console.log(`\nFile changed: ${filename}`);

        // Rescan directory to find any new files
        const currentFiles = new Set(this.builder.getAllFiles(this.srcDir));
        const newFiles = [...currentFiles].filter((f) => !this.compiledFiles.has(f));

        // Compile the changed file
        this.builder.compileFile(filePath);

        // Compile any newly discovered files
        if (newFiles.length > 0) {
          console.log(`\nFound ${newFiles.length} new file(s):`);
          newFiles.forEach((newFile) => {
            const relPath = path.relative(this.srcDir, newFile);
            console.log(`  - ${relPath}`);
            this.builder.compileFile(newFile);
          });
        }

        // Update the compiled files set
        this.compiledFiles = currentFiles;

        // Rebuild CSS since Tailwind classes might have changed
        this.builder.buildCSS();

        // Call optional update callback
        if (this.onUpdate) {
          this.onUpdate();
        }
      }

      // Rebuild CSS if styles.css changes
      if (filename === 'styles.css') {
        console.log('\nCSS file changed');
        this.builder.buildCSS();
      }
    });
  }
}
