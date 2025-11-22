#!/usr/bin/env node

const { execSync } = require('child_process');
const { readFileSync } = require('fs');

const args = process.argv.slice(2);
const versionType = args[0];

// Validate version type argument
if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
  console.error('Usage: pnpm release <patch|minor|major>');
  console.error('Example: pnpm release patch');
  process.exit(1);
}

// Helper to run commands and show output
function run(command, description) {
  console.log(`\n→ ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`✗ ${description} failed`);
    process.exit(1);
  }
}

// Get current version
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const currentVersion = packageJson.version;

console.log(`\n📦 Releasing new ${versionType} version from v${currentVersion}\n`);

// 1. Run tests
run('pnpm test', 'Running tests');

// 2. Build the project
run('pnpm run build', 'Building project');

// 3. Bump version (this will trigger the "version" script which updates changelog)
run(`npm version ${versionType}`, `Bumping ${versionType} version`);

// 4. Get new version
const updatedPackageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const newVersion = updatedPackageJson.version;

// 5. Push tags and commits
run('git push && git push --tags', 'Pushing to remote');

// 6. Publish to npm
run('pnpm publish --access public', 'Publishing to npm');

console.log(`\n✓ Successfully released v${newVersion}! 🎉\n`);
