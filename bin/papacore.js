#!/usr/bin/env node

// This is the entry point that users will execute
// It simply loads and runs the compiled CLI from dist/
import('../dist/cli/index.js').catch((error) => {
  console.error('Failed to load Papacore CLI:', error.message);
  process.exit(1);
});
