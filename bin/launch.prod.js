const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const log = require('../lib/logger')
const buildMasterExports = require('../lib/build-master-exports')
const buildComponentTree = require('../lib/build-component-tree')
const getFileStructure = require('../lib/get-files')

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

const devServerOptions = {
  // stats: {
  //   preset: 'errors-warnings', // only show errors and warnings
  //   warningsFilter: ['out/component-list.js'], // filter out warnings from component list
  //   version: false,
  //   children: false,
  //   hash: false,
  // },
  stats: 'errors-only',
  hot: true,
  noInfo: true,
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
    app.use('/demo', (req, res, next) => {
      const indexPath = path.join(demoCompiler.outputPath, 'demo.html')
      demoCompiler.outputFileSystem.readFile(indexPath, (err, result) => {
        if (err) return next(err)
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
      })
    })
    app.use('/draft-main.js', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../dist/draft-main.js'))
    })
    app.use('/runtime~draft-main.js', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../dist/runtime~draft-main.js'))
    })
    app.use(/^\/$/, (req, res) => {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'))
    })
  },
}

const server = new WebpackDevServer(demoCompiler, devServerOptions)

function launchServer() {
  server.listen(port, '127.0.0.1', () => log(`Server launched on port ${port}`, 'Server'))
}
