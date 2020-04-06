const path = require('path')
const fs = require('fs')

function writeIndex(src, callback = () => {}) {
  fs.writeFile(path.resolve(__dirname, '../out', 'component-index.js'), src, callback)
}

function clearComponentIndex() {
  writeIndex('export default undefined\n')
}

function buildComponentIndex(filePath, componentName, callback) {
  let fileContents = ''
  fileContents += `import * as components from '${filePath}';\n\n`
  fileContents += `const exported = components.${componentName} || components.default\n`
  fileContents += `exported.componentName = '${componentName}'\n`
  fileContents += `exported.filePath = '${filePath}'\n`
  fileContents += `export default exported\n`
  writeIndex(fileContents, callback)
}

module.exports = {
  clearComponentIndex,
  buildComponentIndex,
}
