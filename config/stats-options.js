module.exports = {
  preset: 'errors-warnings',
  warningsFilter: [/out\/component-(list|index)\.js/, /EnvironmentPlugin/],
  assets: false,
  version: false,
  hash: false,
  timings: false,
  entrypoints: false,
  modules: false,
  builtAt: false,
}
