const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const fs = require('fs')
const path = require('path')
const open = require('open')
const colors = require('colors')
const WebSocket = require('ws')
const boxen = require('boxen')
const tcpPortUsed = require('tcp-port-used')
const statsOptions = require('../config/stats-options')
const {
  buildComponentTree,
  buildComponentIndex,
  clearComponentIndex,
  buildWrapperExport,
  getFileStructure,
  getComponentGlossary,
  log,
} = require('../lib')

const reactConfigPath = path.resolve('.', 'draft.config.js')
const draftConfig = fs.existsSync(reactConfigPath) ? require(reactConfigPath) : {}
const { babelModules = [], ignore = [], port = 8080, openAtLaunch = true } = draftConfig
const joinedIncludedNodesModules = babelModules.join('|')

log('Launching...', ['Dev'])

const draftWebpackConfig = require('../config/draft.webpack')(draftConfig)
const demoWebpackConfig = require('../config/demo.webpack')(draftConfig)

const fileStructure = getFileStructure(ignore)
const componentTree = buildComponentTree(fileStructure)

const multiCompiler = webpack([draftWebpackConfig, demoWebpackConfig])
const [draftCompiler, demoCompiler] = multiCompiler.compilers

draftCompiler.initialBuild = false
demoCompiler.initialBuild = false
draftCompiler.tag = 'draft'
demoCompiler.tag = 'demo'

const selectedComponent = {
  filePath: '',
  componentName: '',
}

// Clean out the component index file before we run the compilers
clearComponentIndex()

// Build the export file for the user's custom wrapper (if they have one)
buildWrapperExport(draftConfig)

// WEB SOCKET
const draftWSS = new WebSocket.Server({ port: 7999 })
const iframeWSS = new WebSocket.Server({ port: 7998 })
draftWSS.on('connection', ws => {
  ws.send(
    JSON.stringify({
      glossary: getComponentGlossary(componentTree),
      tree: componentTree,
    })
  )

  ws.on('message', message => {
    const { componentName, filePath } = JSON.parse(message)

    if (selectedComponent.componentName !== componentName) {
      iframeWSS.clients.forEach(clientWS => {
        clientWS.send(JSON.stringify({ type: 'REBUILDING_INDEX' }))
      })

      buildComponentIndex(filePath, componentName, () => {
        selectedComponent.componentName = componentName
        selectedComponent.filePath = filePath
      })
    }
  })
})

// Log whenever we finish a build
multiCompiler.compilers.forEach(compiler =>
  compiler.hooks.done.tap('Done', stats => {
    if (!compiler.initialBuild) {
      compiler.initialBuild = true
      if (draftCompiler.initialBuild && demoCompiler.initialBuild) {
        launchServer(port)
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
  port,
  watchOptions: {
    ignored: [
      new RegExp(
        `node_modules${joinedIncludedNodesModules && `?!(/${joinedIncludedNodesModules})`}`
      ), // ignore all node_modules except ones defined in user config
      path.resolve('.', 'draft-build/'), // ignore static site build
      // path.resolve(__dirname, '../out/*'), // ignore all component data files
    ],
  },

  before: app => {
    // Route to get the component tree
    app.use('/tree', (req, res) => res.json(componentTree))

    // Route to get the component glossary
    app.use('/glossary', (req, res) => res.json(getComponentGlossary(componentTree)))

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

function launchServer(serverPort) {
  tcpPortUsed.check(serverPort).then(isInUse => {
    if (isInUse) {
      launchServer(serverPort - 1)
    } else {
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
  })
}
