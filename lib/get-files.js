const find = require('find')
const path = require('path')

function getFileStructure(ignore) {
  const files = find.fileSync(/\.js$/, path.resolve('.')).filter(fp => {
    if (fp.includes('node_modules/')) return false
    const ignorePatterns = [/\.draft\.*.\.js$/, ...ignore]
    // eslint-disable-next-line array-callback-return
    return !ignorePatterns.some(ignorePath => {
      if (ignorePath instanceof RegExp) {
        return ignorePath.exec(fp)
      }
      if (typeof ignorePath === 'string') {
        return fp.includes(ignorePath)
      }
      console.error(
        `Invalid Configuration: ignore value of ${ignorePath} invalid. Must be a regular expression or a string.`
      )
    })
  })

  const cwd = path.resolve('.')
  return {
    files: files.map(x => x.replace(cwd, '')),
    cwd,
  }
}

module.exports = getFileStructure
