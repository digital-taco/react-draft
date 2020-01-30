const colors = require('colors')

function log(str, tags = []) {
  const logTags = Array.isArray(tags) ? tags : [tags]

  let prefix = colors.brightCyan('[Draft]')
  logTags.forEach(tag => {
    switch (tag) {
      case 'debug':
        prefix += colors.brightYellow('[Debug]')
        break
      case 'draft':
        prefix += colors.brightBlue('[Draft]')
        break
      case 'demo':
        prefix += colors.brightGreen('[Demo]')
        break
      default:
        prefix += colors.dim(`[${tag}]`)
    }
  })

  console.log(prefix, str)
}

log.debug = (str, tags = []) => {
  if (!process.env.DEBUG) return
  const logTags = Array.isArray(tags) ? tags : [tags]
  log(str, [...logTags, 'debug'])
}

log.error = str => {
  console.log(
    colors.italic.magenta(`\n[Draft] Error:\n`),
    colors.brightRed(`-------\n${str}\n-------`)
  )
}

log.warning = str => {
  console.log(
    colors.italic.magenta(`\n[Draft] Warning:\n`),
    colors.brightYellow(`-------\n${str}\n-------`)
  )
}

log.verbose = str => {
  if (process.env.VERBOSE) console.log(colors.magenta.dim(`[Draft][Verbose]`), colors.dim(str))
}

module.exports = log
