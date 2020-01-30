const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const fs = require('fs')
const path = require('path')
const open = require('open')
const colors = require('colors')
const WebSocket = require('ws')
const boxen = require('boxen')
const log = require('../lib/logger')
const buildMasterExports = require('../lib/build-master-exports')
const buildComponentTree = require('../lib/build-component-tree')
const getFileStructure = require('../lib/get-files')
const { getComponentGlossary } = require('../lib/get-component-glossary')
const statsOptions = require('../config/stats-options')

const reactConfigPath = path.resolve('.', 'draft.config.js')
const draftConfig = fs.existsSync(reactConfigPath) ? require(reactConfigPath) : {}
const { babelModules = [], ignore = [], port = 8080, openAtLaunch = true } = draftConfig
const joinedIncludedNodesModules = babelModules.join('|')

log.verbose('Launching Draft')

const draftWebpackConfig = require('../config/draft.webpack')(draftConfig)
const demoWebpackConfig = require('../config/demo.webpack')(draftConfig)

log.verbose('Webpack Configs Retrieved')

const fileStructure = getFileStructure(ignore)
const componentTree = buildComponentTree(fileStructure)

// Write the exports list on initial load
buildMasterExports(componentTree, draftConfig)

const multiCompiler = webpack([draftWebpackConfig, demoWebpackConfig])
const [draftCompiler, demoCompiler] = multiCompiler.compilers

draftCompiler.initialBuild = false
demoCompiler.initialBuild = false
draftCompiler.tag = 'draft'
demoCompiler.tag = 'demo'

// WEB SOCKET
const wss = new WebSocket.Server({ port: 7999 })
log.debug('Setting up web socket', 'Web Socket')
wss.on('connection', ws => {
  log.verbose('Client Connected (Initial)', 'Web Socket')
  ws.send(
    JSON.stringify({
      glossary: getComponentGlossary(componentTree),
      tree: componentTree,
    })
  )
})

// Whenever the compilation goes invalid (something changed), rebuild the master exports
multiCompiler.compilers.forEach(compiler =>
  compiler.hooks.invalid.tap('BuildExportsList', fileName => {
    log.debug(`File Changed: ${fileName}`, 'demo')
    buildMasterExports(componentTree, draftConfig)
    wss.clients.forEach(socket => {
      log.verbose(`Updating glossary - Client []`, 'Web Socket')
      const updatedFileStructure = getFileStructure(ignore)
      socket.send(
        JSON.stringify({
          glossary: getComponentGlossary(componentTree),
          tree: buildComponentTree(updatedFileStructure),
        })
      )
    })
  })
)

// Log whenever we start a build
multiCompiler.compilers.forEach(compiler =>
  compiler.hooks.watchRun.tap('BeforeRun', () => {
    log('Compiling...', compiler.tag)
  })
)

// Log whenever we finish a build
multiCompiler.compilers.forEach(compiler =>
  compiler.hooks.done.tap('Done', stats => {
    if (!compiler.initialBuild) {
      compiler.initialBuild = true
      if (draftCompiler.initialBuild && demoCompiler.initialBuild) {
        launchServer()
      }
    }
    log(`Compiled ${colors.dim.italic(`(${stats.endTime - stats.startTime}ms)`)}`, compiler.tag)
  })
)

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
  },
}

const server = new WebpackDevServer(multiCompiler, devServerOptions)

function launchServer() {
  server.listen(port, '127.0.0.1', err => {
    if (err) {
      log.error(err)
    } else {
      console.log(
        boxen(
          `   Draft launched on port ${port}   \n\n${colors.brightGreen(
            `http://localhost:${port}`
          )}`,
          {
            padding: {
              top: 1,
              left: 0,
              right: 0,
              bottom: 1,
            },
            borderColor: '#2979ff',
            align: 'center',
            dimBorder: true,
          }
        )
      )
      if (openAtLaunch) {
        open(`http://localhost:${port}`)
      }
    }
  })
}
