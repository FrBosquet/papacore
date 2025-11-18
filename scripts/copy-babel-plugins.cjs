const fs = require('node:fs')
const path = require('node:path')

const distBabelDir = path.join(__dirname, '../dist/core/babel')

// Create dist/core/babel directory
fs.mkdirSync(distBabelDir, { recursive: true })

// Copy babel plugin files
const plugins = [
  'transform-imports-exports.cjs',
  'transform-react-hooks.cjs'
]

for (const plugin of plugins) {
  const src = path.join(__dirname, '../src/core/babel', plugin)
  const dest = path.join(distBabelDir, plugin)
  fs.copyFileSync(src, dest)
}

console.log('✓ Copied Babel plugins to dist/')
