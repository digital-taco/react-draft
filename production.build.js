const webpack = require('webpack')
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
    log('Build Complete', 'Webpack')
  }
})
