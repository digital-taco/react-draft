const path = require('path')
const fs = require('fs')

function writeWrapperExport(wrapperPath) {
  const fileContents = `
  export { default } from '${wrapperPath}'
    `
  fs.writeFileSync(path.resolve(__dirname, '../out', 'custom-wrapper-export.js'), fileContents)
}

module.exports = draftConfig => {
  const wrapperPath = draftConfig.wrapperPath
  if (!wrapperPath) {
    const defaultPath = path.resolve('.', 'draft.wrapper.js')
    const wrapperExists = fs.existsSync(defaultPath)
    if (wrapperExists) {
      writeWrapperExport(defaultPath)
    }
  } else {
    writeWrapperExport(wrapperPath)
  }
}
