import * as fs from 'node:fs';
import { CSSBuilder } from '../../core/css/tailwind.js';
import { getProjectPaths, loadConfig } from '../../core/utils.js';
import { logger } from '../utils/logger.js';

export async function buildCssCommand(): Promise<void> {
  try {
    const cwd = process.cwd();
    const paths = getProjectPaths(cwd);

    // Try to load config for target vault (optional for CSS-only build)
    let targetVault: string | undefined;
    if (fs.existsSync(paths.configPath)) {
      const config = loadConfig(paths.configPath);
      targetVault = config.targetVault;
    }

    logger.startSpinner('Building CSS...');

    const cssBuilder = new CSSBuilder({
      projectRoot: paths.projectRoot,
      distDir: paths.distDir,
      targetVault,
      verbose: false,
    });

    cssBuilder.build();

    logger.succeedSpinner('CSS built successfully!');

    if (targetVault) {
      logger.success('CSS copied to vault snippets');
    }
  } catch (error) {
    logger.failSpinner('CSS build failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}
