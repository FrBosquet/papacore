module.exports = {
  presets: [
    ['@babel/preset-typescript', {
      isTSX: true,
      allExtensions: true,
      onlyRemoveTypeImports: true
    }]
  ],
  plugins: [
    './node_modules/papacore/dist/core/babel/transform-imports-exports.cjs',
    './node_modules/papacore/dist/core/babel/transform-react-hooks.cjs'
  ]
};
