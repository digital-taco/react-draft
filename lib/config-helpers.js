const fs = require('fs')
const path = require('path')

function getPackageName() {
  const packagePath = path.resolve('.', 'package.json')
  const { name } = fs.existsSync(packagePath) ? require(packagePath) : null
  return name
}

function getHMRPath() {
  const hotMiddlewareScript =
    'node_modules/webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true'
  const hotMiddlewareScriptPath = path.resolve(__dirname, hotMiddlewareScript)
  return fs.existsSync(hotMiddlewareScriptPath)
    ? hotMiddlewareScriptPath
    : path.resolve('.', hotMiddlewareScript)
}

function getInclusionRules(babelModules) {
  // Build an array of regexes or functions to identify files that are in additional modules that need to run through babel
  const includedNodeModules = babelModules.map(m =>
    m instanceof RegExp ? m : path.resolve('.', 'node_modules', m)
  )
  // Build a single regex to exclude all node modules except the ones provided in the config babelModules option
  const joinedIncludedNodesModules = ['@digital-taco/react-draft', ...babelModules].join('|')

  const excludedModules = [
    /draft-build/,
    new RegExp(
      `node_modules/${joinedIncludedNodesModules && `(?!(${joinedIncludedNodesModules}))`}`
    ),
  ]

  const includedModules = [
    path.resolve('.'),
    path.resolve(__dirname, '../src'),
    ...includedNodeModules,
  ]

  return {
    includedModules,
    excludedModules,
  }
}

function buildBabelConfig(customBabelConfig) {
  return {
    ...customBabelConfig,
    presets: [
      ...new Set([
        ...(customBabelConfig.presets || []),
        '@babel/preset-react',
        ['@babel/preset-env', { targets: { node: 'current' } }],
        require.resolve('@emotion/babel-preset-css-prop'),
      ]),
    ],
    plugins: [
      ...new Set([...(customBabelConfig.plugins || []), '@babel/plugin-syntax-dynamic-import']),
    ],
  }
}

module.exports = {
  getHMRPath,
  getPackageName,
  getInclusionRules,
  buildBabelConfig,
}
