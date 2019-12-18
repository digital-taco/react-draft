#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const find = require('find')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const open = require('open')
const buildWebpackConfig = require('../webpack.config')
const buildComponentTree = require('../lib/build-component-tree.js')
const buildMasterExports = require('../lib/build-master-exports.js')
const reactConfigPath = path.resolve('.', 'draft.config.js')

const draftConfig = fs.existsSync(reactConfigPath) ? require(reactConfigPath) : {}

const { babelModules = [], ignore = [] } = draftConfig

const files = find.fileSync(/\.js$/, path.resolve('.')).filter(fp => {
  if (fp.includes('node_modules/')) return false
  return !ignore.some(ignorePath => {
    if (ignorePath instanceof RegExp) {
      return ignorePath.exec(fp)
    } else if (typeof ignorePath === 'string') {
      return fp.includes(ignorePath)
    } else {
      console.error(`Invalid Configuration: ignore value of ${ignorePath} invalid. Must be a regular expression or a string.`)
    }
  })
})

const cwd = path.resolve('.')
const fileStructure = {
  files: files.map(x => x.replace(cwd, '')),
  cwd,
}

const componentTree = buildComponentTree(fileStructure)

// Write the exports list on initial load
buildMasterExports(componentTree, draftConfig)

// Set up webpack, websockets, express
const webpackConfig = buildWebpackConfig(draftConfig)
const app = express()
const port = 8080
const compiler = webpack(webpackConfig)

// Whenever the compilation goes invalid (something changed), rebuild the master exports
compiler.hooks.invalid.tap('BuildExportsList', () => {
  buildMasterExports(componentTree, draftConfig)
})

// Must be added _before_ dev middleware
app.get('/files', (req, res) => {
  res.json({ files: fileStructure.files })
})

const joinedIncludedNodesModules = babelModules.join('|')
const devMiddleware = middleware(compiler, {
  writeToDisk: !!process.env.WRITE_TO_DISK,
  noInfo: true,
  publicPath: '/',
  hot: true,
  lazy: false,
  stats: {
    builtAt: false,
    colors: true,
    timings: false,
    entrypoints: false,
    assets: false,
    modules: false,
    warnings: false,
    version: false,
    hash: false,
  },
  watchOptions: {
    ignored: new RegExp(`(master-exports|draft-build|node_modules/${joinedIncludedNodesModules && `(?!(${joinedIncludedNodesModules}))`})`),
  },
})

app.use(devMiddleware)
app.use(hotMiddleware(compiler))

const extractFrom = (webpackCompiler, name) => (req, res, next) => {
  const indexPath = path.join(webpackCompiler.outputPath, name)

  // eslint-disable-next-line consistent-return
  webpackCompiler.outputFileSystem.readFile(indexPath, (err, result) => {
    if (err) return next(err)
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
}

// Must be added _after_ the dev middleware
draftConfig.middleware && draftConfig.middleware(app)

// Add demo and index middleware
app.use('/demo', extractFrom(compiler, 'demo.html'))
app.use('/', extractFrom(compiler, 'index.html'))

/** Start that sucker up */
if (!process.env.WRITE_TO_DISK) {
  app.listen(port, err => {
    if (err) {
      console.log(err)
    } else {
      !process.env.CI && open(`http://localhost:${port}`)
    }
  })
}
