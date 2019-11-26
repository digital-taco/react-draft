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

const files = find.fileSync(/\.js$/, path.resolve('.')).filter(x => {
  return !['node_modules/', ...(draftConfig.ignore || [])].some(ignorePath => {
    return x.includes(ignorePath)
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

const devMiddleware = middleware(compiler, {
  // noInfo: true,
  publicPath: '/',
  hot: true,
  lazy: false,
  stats: {
    builtAt: false,
    colors: true,
    timings: true,
    entrypoints: true,
    assets: true,
    modules: false,
    warnings: false,
    version: false,
    hash: false,
  },
  watchOptions: {
    ignored: /master-exports/,
  },
})

app.use(devMiddleware)
app.use(hotMiddleware(compiler))

// Must be added _after_ the dev middleware
app.use('/', (req, res, next) => {
  const indexPath = path.join(compiler.outputPath, 'index.html')

  // eslint-disable-next-line consistent-return
  compiler.outputFileSystem.readFile(indexPath, (err, result) => {
    if (err) return next(err)
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

// app.use('/demo', (req, res, next) => {
//   const indexPath = path.join(compiler.outputPath, 'demo.html')

//   // eslint-disable-next-line consistent-return
//   compiler.outputFileSystem.readFile(indexPath, (err, result) => {
//     if (err) return next(err)
//     res.set('content-type', 'text/html')
//     res.send(result)
//     res.end()
//   })
// })

/** Start that sucker up */
app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    open(`http://localhost:${port}`)
  }
})
