import { spawnSync } from 'node:child_process';

/**
 * Check if the Obsidian CLI binary is available on PATH.
 */
export function isObsidianCliAvailable(): boolean {
  const result = spawnSync('obsidian', ['--version'], {
    stdio: 'ignore',
  });

  if (result.error) {
    // Most likely ENOENT (command not found)
    return false;
  }

  return (result.status ?? 0) === 0;
}

/**
 * Reload the Datacore plugin using the Obsidian CLI.
 *
 * Returns true if the command was executed successfully.
 */
export function reloadDatacorePlugin(): boolean {
  const result = spawnSync('obsidian', ["plugin", "reload", "id=datacore"], {
    stdio: 'inherit',
  });

  if (result.error) {
    return false;
  }

  return (result.status ?? 0) === 0;
}

