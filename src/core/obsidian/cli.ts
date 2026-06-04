import { spawnSync } from 'node:child_process';

/**
 * Check if the Obsidian CLI binary is available on PATH.
 *
 * Does not run `obsidian version` — on macOS that launches the app and can
 * open the vault picker before the user has confirmed dev mode.
 */
export function isObsidianCliAvailable(): boolean {
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(lookup, ['obsidian'], {
    stdio: 'ignore',
  });

  if (result.error) {
    return false;
  }

  return (result.status ?? 1) === 0;
}

/**
 * Reload the Datacore plugin using the Obsidian CLI.
 *
 * Returns true if the command was executed successfully.
 */
export function reloadDatacorePlugin(): boolean {
  const result = spawnSync('obsidian', ['plugin:reload', 'id=datacore'], {
    stdio: 'inherit',
  });

  if (result.error) {
    return false;
  }

  return (result.status ?? 0) === 0;
}

