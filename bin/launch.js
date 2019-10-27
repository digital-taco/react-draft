#!/usr/bin/env node

const path = require('path')
const find = require('find')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const express = require('express')
const open = require('open')
const config = require('../webpack.config')

const buildComponentTree = require('../lib/build-component-tree.js')
const buildMasterExports = require('../lib/build-master-exports.js')

const files = find.fileSync(/\.js$/, path.resolve('.')).filter(x => !x.includes('node_modules/'))
const cwd = path.resolve('.')
const fileStructure = {
  files: files.map(x => x.replace(cwd, '')),
  cwd,
}

const componentTree = buildComponentTree(fileStructure)

// Write the exports list
buildMasterExports(componentTree)

// Set up webpack, websockets, express
const app = express()
const port = 8080
const compiler = webpack(config)

// Must be added _before_ dev middleware
app.get('/files', (req, res) => {
  res.json({ files: fileStructure.files })
})

const devMiddleware = middleware(compiler, {
  noInfo: true,
  publicPath: '/',
  hot: true,
  lazy: false,
  stats: {
    builtAt: false,
    colors: true,
    timings: true,
    entrypoints: false,
    assets: false,
    modules: false,
    warnings: false,
    version: false,
    hash: false,
  },
})
app.use(devMiddleware)

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

/** Start that sucker up */
app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    open(`http://localhost:${port}`)
  }
})
