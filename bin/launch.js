#!/usr/bin/env node

// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
const reactDocs = require('react-docgen')
const standalone = require('@babel/standalone/babel')
const config = require('../webpack.config')
const find = require('find')
const open = require('open')

const fileStructure = find.fileSync(/\.js$/, path.resolve('.')).filter(x => !x.includes('node_modules/'));

const wss = new WebSocket.Server({ port: 8001 })
const app = express()
const port = 8080
const compiler = webpack(config)

// Read Package JSON and parse component information
let componentInfo, filePath, updateFilePath

try {
  const packageJson = require(path.resolve('.', 'package.json'))
  filePath = path.resolve(packageJson.main)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  componentInfo = reactDocs.parse(fileContents)
} catch (err) {
  throw err
}

/**
 * @description Reads in and parses the component file with react-docgen
 * @returns {string} The react-docgen parsed value as a string
 */
function parseComponentFile() {
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.stringify(reactDocs.parse(fileContents))
}

/** Add the middleware for webpack-dev-server */
const devMiddleware = middleware(compiler, {
  noInfo: true,
  publicPath: '/',
  hot: true,
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

// custom routes have to be set up before the webpack middleware in order to access
app.get('/files', (req, res) => {
  let cwd = path.resolve('.')
  res.json({ files: fileStructure.map(x => x.replace(cwd, '')), currentlySelected: filePath.replace(cwd, ''), cwd });
})
app.post('/change-selected-file', bodyParser.json(), (req, res) => {
  let cwd = path.resolve('.')
  filePath = path.resolve('.' + req.query.newPath)
  console.log(filePath)
  res.json({ files: fileStructure.map(x => x.replace(cwd, '')), currentlySelected: filePath.replace(cwd, ''), cwd });
})

/** Add the middleware for hot-module-reloading */
const wphmw = hotMiddleware(compiler)
app.use(wphmw)

/** Add the endpoint for the user to access the lab */
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

/** Add handlers for the web socket that the component doc information will be handled on */
wss.on('connection', ws => {
  componentInfo = parseComponentFile()

  ws.on('message', message => {
    if (message === 'CONNECTED') {
      ws.send(componentInfo)
    }
  })

  const watchFile = () => {
    const updatedComponentInfo = parseComponentFile()
    // Check if they are the same, so we know if documentation updates happened or not
    if (updatedComponentInfo !== componentInfo) {
      console.log('Component documentation updated...')
      componentInfo = updatedComponentInfo
      ws.send(updatedComponentInfo)
    }
  }
  // Watch the file for any changes to it's documentation (proptypes, name, default prop values, etc.)
  let watcher = fs.watchFile(filePath, { interval: 1000 }, watchFile);

})

/** Start that sucker up */
app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    open(`http://localhost:${port}`)
  }
})
