#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCommand } from './commands/build.js';
import { buildCssCommand } from './commands/build-css.js';
import { configCommand } from './commands/config.js';
import { copyCommand } from './commands/copy.js';
import { devCommand } from './commands/dev.js';
import { initCommand } from './commands/init.js';
import { installCommand } from './commands/install.js';
import { scanCommand } from './commands/scan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('papacore')
  .description('A framework for developing Datacore components with modern tooling')
  .version(packageJson.version);

// Init command
program
  .command('init [project-name]')
  .description('Create a new Papacore project')
  .option('--no-tooling', 'Skip installing biome and vscode settings')
  .action((projectName, options) => initCommand(projectName, options));

// Install command
program
  .command('install [item]')
  .description('Install a component, utility, or view')
  .action(installCommand);

// Dev command
program
  .command('dev')
  .description('Build, watch, and install components to vault')
  .action(devCommand);

// Build command
program
  .command('build')
  .description('Build components once')
  .action(buildCommand);

// Copy command
program
  .command('copy')
  .description('Copy built files to vault')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action((options) => copyCommand({ skipConfirmation: options.yes }));

// Config command
program
  .command('config')
  .description('Configure vault path and other settings')
  .action(configCommand);

// Scan command
program
  .command('scan')
  .description('Scan vault for dependencies')
  .action(scanCommand);

// Generate icons - not yet implemented
program
  .command('generate-icons')
  .description('Generate icon type definitions')
  .action(() => {
    console.log('Generating icons...');
    console.log('(Command not yet implemented)');
  });

// Build CSS command
program
  .command('build-css')
  .description('Build CSS only')
  .action(buildCssCommand);

program.parse(process.argv);
