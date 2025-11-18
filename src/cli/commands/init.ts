import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyRecursive, ensureDir } from '../../core/utils.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initCommand(projectName?: string): Promise<void> {
  try {
    const name = projectName || 'papacore-project';
    const targetDir = path.join(process.cwd(), name);

    // Check if directory already exists
    if (fs.existsSync(targetDir)) {
      logger.error(`Directory "${name}" already exists`);
      process.exit(1);
    }

    logger.startSpinner(`Creating new Papacore project: ${name}`);

    // Create target directory
    ensureDir(targetDir);

    // Get templates directory (go up from dist/cli/commands/ to templates/)
    const templatesDir = path.join(__dirname, '../../../templates');

    // Create minimal source structure
    const targetSrcDir = path.join(targetDir, 'src');
    ensureDir(targetSrcDir);
    ensureDir(path.join(targetSrcDir, 'Datacore'));
    ensureDir(path.join(targetSrcDir, 'Datacore/components'));
    ensureDir(path.join(targetSrcDir, 'Datacore/components/shared'));
    ensureDir(path.join(targetSrcDir, 'Datacore/utils'));
    ensureDir(path.join(targetSrcDir, 'Datacore/views'));

    // Copy basic files: dc.d.ts and styles.css
    const srcTemplateDir = path.join(templatesDir, 'src');
    const basicFiles = ['dc.d.ts', 'styles.css'];
    for (const file of basicFiles) {
      const src = path.join(srcTemplateDir, file);
      const dest = path.join(targetSrcDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }

    // Copy one basic view (Today)
    const todaySrc = path.join(srcTemplateDir, 'Datacore/views/Today.tsx');
    const todayDest = path.join(targetSrcDir, 'Datacore/views/Today.tsx');
    if (fs.existsSync(todaySrc)) {
      fs.copyFileSync(todaySrc, todayDest);
    }

    // Copy config files
    const configFiles = [
      'babel.config.js',
      'tailwind.config.js',
      'tsconfig.json',
      'biome.json',
      'postcss.config.js',
    ];

    const configTemplateDir = path.join(templatesDir, 'config');
    for (const file of configFiles) {
      const src = path.join(configTemplateDir, file);
      const dest = path.join(targetDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }

    // Copy .vscode settings
    const vscodeTemplateDir = path.join(templatesDir, 'vscode');
    const targetVscodeDir = path.join(targetDir, '.vscode');
    if (fs.existsSync(vscodeTemplateDir)) {
      copyRecursive(vscodeTemplateDir, targetVscodeDir);
    }

    // Create package.json from template
    const packageTemplatePath = path.join(templatesDir, 'package.json.template');
    if (fs.existsSync(packageTemplatePath)) {
      const packageTemplate = fs.readFileSync(packageTemplatePath, 'utf-8');
      const packageJson = packageTemplate.replace(/\{\{PROJECT_NAME\}\}/g, name);
      fs.writeFileSync(path.join(targetDir, 'package.json'), packageJson);
    }

    // Create .gitignore from template
    const gitignoreTemplatePath = path.join(templatesDir, 'gitignore.template');
    if (fs.existsSync(gitignoreTemplatePath)) {
      const gitignore = fs.readFileSync(gitignoreTemplatePath, 'utf-8');
      fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignore);
    }

    // Create initial papacore.json
    const papacoreConfig = {
      targetVault: '',
    };
    fs.writeFileSync(
      path.join(targetDir, 'papacore.json'),
      JSON.stringify(papacoreConfig, null, 2)
    );

    // Create README
    const readme = `# ${name}

A Datacore component library built with Papacore.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Configure your vault path:
   \`\`\`bash
   pnpm run config
   \`\`\`

3. Install components as needed:
   \`\`\`bash
   papacore install button
   papacore install classMerge
   \`\`\`

   Run \`papacore install\` to see all available components and utilities.

4. Start development mode:
   \`\`\`bash
   pnpm run dev
   \`\`\`

## Available Commands

- \`papacore install [item]\` - Install components, utilities, or views
- \`pnpm run dev\` - Build, watch, and auto-install to vault
- \`pnpm run build\` - Build once
- \`pnpm run config\` - Configure vault path
- \`pnpm run scan\` - Scan vault for dependencies
- \`pnpm run lint\` - Lint code with Biome
- \`pnpm run format\` - Format code with Biome

## Project Structure

- \`src/Datacore/components/shared/\` - Reusable components
- \`src/Datacore/utils/\` - Utility functions
- \`src/Datacore/views/\` - View components for your vault
- \`src/styles.css\` - Global styles with Tailwind

## Learn More

- [Papacore Documentation](https://github.com/FrBosquet/papacore)
- [Datacore Plugin](https://github.com/blacksmithgu/datacore)
`;

    fs.writeFileSync(path.join(targetDir, 'README.md'), readme);

    logger.succeedSpinner('Project created successfully!');

    // Show next steps
    console.log('');
    logger.success('Next steps:');
    console.log(`  1. cd ${name}`);
    console.log('  2. pnpm install');
    console.log('  3. pnpm run config');
    console.log('  4. papacore install <component>  (optional - see available items)');
    console.log('  5. pnpm run dev');
    console.log('');
    logger.info('Tip: Run "papacore install" to see all available components and utilities');
    console.log('');
  } catch (error) {
    logger.failSpinner('Project creation failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}
