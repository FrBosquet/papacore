import * as fs from 'node:fs';
import * as path from 'node:path';
import { Scanner } from '../../core/deps/scanner.js';
import { getProjectPaths, loadConfig } from '../../core/utils.js';
import { logger } from '../utils/logger.js';

export async function scanCommand(): Promise<void> {
  try {
    const cwd = process.cwd();
    const paths = getProjectPaths(cwd);

    // Load config for target vault
    const config = loadConfig(paths.configPath);
    const targetVault = config.targetVault;

    logger.startSpinner('Scanning vault for dependencies...');

    const scanner = new Scanner({
      srcDir: paths.srcDir,
      distDir: paths.distDir,
      verbose: false,
    });

    const deps = scanner.updateDepsJson(targetVault);

    if (!deps) {
      logger.failSpinner('Scan failed - no dependencies found');
      process.exit(1);
    }

    // Save to deps.json
    const depsPath = path.join(cwd, 'deps.json');
    fs.writeFileSync(depsPath, JSON.stringify(deps, null, 2));

    logger.succeedSpinner('Scan completed!');

    // Show summary
    const viewCount = Object.keys(deps.views).length;
    const graphCount = Object.keys(deps.graph).length;

    logger.info(`Found ${viewCount} view component(s)`);
    logger.info(`Found ${graphCount} internal dependency(ies)`);
    logger.success(`Saved to ${depsPath}`);
  } catch (error) {
    logger.failSpinner('Scan failed');
    logger.error((error as Error).message);
    process.exit(1);
  }
}
