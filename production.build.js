const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const log = require('./lib/logger')

const webpackConfig = require('./config/draft.webpack.production')

log('Building...', 'Webpack')

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.err(err.stack || err)
  } else if (stats.hasErrors() || stats.hasWarnings()) {
    const info = stats.toJson()
    if (stats.hasErrors()) {
      info.errors.forEach(e => log.error(e))
    }
    if (stats.hasWarnings()) {
      info.warnings.forEach(e => log.warning(e))
    }
  } else {
    const indexStats = fs.statSync(path.resolve(__dirname, 'dist/index.html'))
    const mainStats = fs.statSync(path.resolve(__dirname, 'dist/draft.js'))
    log(`${colors.bold.green('index.html')}  ${indexStats.size / 1000.0}kb`)
    log(`${colors.bold.green('draft.js')}    ${mainStats.size / 1000.0}kb`)
    log('Build Complete', 'Webpack')
  }
})
