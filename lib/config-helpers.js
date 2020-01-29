const fs = require('fs')
const path = require('path')

function getPackageName() {
  const packagePath = path.resolve('.', 'package.json')
  const { name } = fs.existsSync(packagePath) ? require(packagePath) : null
  return name
}

function resolvePackagePath(packageName) {
  const draftPath = path.resolve(__dirname, `../node_modules/${packageName}`)
  return fs.existsSync(draftPath) ? draftPath : path.resolve(`./node_modules/${packageName}`)
}

function getInclusionRules(babelModules, additionalPaths = []) {
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

  const includedModules = [...additionalPaths, ...includedNodeModules]

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
      ...new Set([
        ...(customBabelConfig.plugins || []),
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
      ]),
    ],
  }
}

module.exports = {
  resolvePackagePath,
  getPackageName,
  getInclusionRules,
  buildBabelConfig,
}
