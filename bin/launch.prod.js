#!/usr/bin/env node

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const log = require('../lib/logger')
const buildMasterExports = require('../lib/build-master-exports')
const buildComponentTree = require('../lib/build-component-tree')
const getFileStructure = require('../lib/get-files')
const { getComponentGlossary } = require('../lib/get-component-glossary')
const statsOptions = require('../config/stats-options')

const reactConfigPath = path.resolve('.', 'draft.config.js')
const draftConfig = fs.existsSync(reactConfigPath) ? require(reactConfigPath) : {}
const { babelModules = [], ignore = [], port = 8080 } = draftConfig
const joinedIncludedNodesModules = babelModules.join('|')

const demoWebpackConfig = require('../config/demo.webpack')(draftConfig)

const fileStructure = getFileStructure(ignore)
const componentTree = buildComponentTree(fileStructure)

// Write the exports list on initial load
buildMasterExports(componentTree, draftConfig)

const demoCompiler = webpack(demoWebpackConfig)

// Whenever the compilation goes invalid (something changed), rebuild the master exports
demoCompiler.hooks.invalid.tap('BuildExportsList', fileName => {
  log.debug(`File Changed: ${fileName}`, 'demo')
  buildMasterExports(componentTree, draftConfig)
})

// Log when it starts compiling
demoCompiler.hooks.watchRun.tap('BeforeRun', () => {
  log('Compiling...', demoCompiler.tag)
})

// Log when it finishes, and launch the server on the initial compile
demoCompiler.hooks.done.tap('Done', stats => {
  if (!demoCompiler.initialBuild) {
    demoCompiler.initialBuild = true
    launchServer()
  }
  log(`Compiled ${colors.dim.italic(`(${stats.endTime - stats.startTime}ms)`)}`, demoCompiler.tag)
})

// WEB SOCKET
const wss = new WebSocket.Server({ port: 7999 })
log.debug('Setting up web socket', 'Web Socket')
wss.on('connection', ws => {
  log.debug('Client Connected', 'Web Socket')
  ws.send(
    JSON.stringify({
      glossary: getComponentGlossary(componentTree),
      tree: componentTree,
    })
  )
})

const devServerOptions = {
  // Only print errors to the console
  stats: statsOptions,
  // Enable HMR
  hot: true,
  // Prevents the page from refreshing when HMR fails
  hotOnly: true,
  // Don't log anything to the console - we'll handle it (except errors)
  noInfo: true,
  // Only show errors on the client
  clientLogLevel: 'error',

  watchOptions: {
    ignored: [
      new RegExp(
        `node_modules${joinedIncludedNodesModules && `?!(/${joinedIncludedNodesModules})`}`
      ), // ignore all node_modules except ones defined in user config
      path.resolve('.', 'draft-build/'), // ignore static site build
      path.resolve(__dirname, '../out/*'), // ignore all component data files
    ],
  },

  before: app => {
    // Route to get the component tree
    app.use('/tree', (req, res) => {
      res.json(componentTree)
    })

    // Route to get the component glossary
    app.use('/glossary', (req, res) => {
      res.json(getComponentGlossary(componentTree))
    })

    // Route to get the demo page
    app.use('/demo', (req, res, next) => {
      const indexPath = path.join(demoCompiler.outputPath, 'demo.html')
      demoCompiler.outputFileSystem.readFile(indexPath, (err, result) => {
        if (err) return next(err)
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
      })
    })

    // Route to get draft
    app.use('/draft.js', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../dist/draft.js'))
    })

    // Route to get index.html
    app.use(/^\/$/, (req, res) => {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'))
    })

    // Add any custom middleware
    draftConfig.middleware && draftConfig.middleware(app)
  },
}

const server = new WebpackDevServer(demoCompiler, devServerOptions)

function launchServer() {
  server.listen(port, '127.0.0.1', () => log(`Server launched on port ${port}`, 'Server'))
}
