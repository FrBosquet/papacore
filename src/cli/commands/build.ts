import * as path from 'node:path';
import { Builder } from '../../core/build/builder.js';
import { getProjectPaths } from '../../core/utils.js';
import { logger } from '../utils/logger.js';

export async function buildCommand(): Promise<void> {
  try {
    const cwd = process.cwd();
    const paths = getProjectPaths(cwd);

    // Check if we're in a papacore project
    const babelConfigPath = path.join(cwd, 'babel.config.js');

    logger.startSpinner('Building project...');

    const builder = new Builder({
      projectRoot: paths.projectRoot,
      srcDir: paths.srcDir,
      distDir: paths.distDir,
      babelConfigPath,
      verbose: false,
    });

    builder.build();

    logger.succeedSpinner('Build completed successfully!');
  } catch (error) {
    logger.failSpinner('Build failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}
