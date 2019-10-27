const fs = require('fs')
const path = require('path')

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

module.exports = componentTree => {
  const filesWithExports = []

  const parseBranch = branch => {
    Object.entries(branch).forEach(([key, value]) => {
      // If it is an object, it's another branch, so parse it too
      if (!Array.isArray(value)) parseBranch(value)
      // If it is an array, it's a file
      else {
        const [filePath, components] = value
        filesWithExports.push([filePath, components])
      }
    }, {})
  }

  // Parse the component tree for files with exports
  parseBranch(componentTree)

  // Build the exports list
  let importList = ''
  let metaList = ''
  const exportsList = []

  filesWithExports.forEach(([filePath, components]) => {
    components.forEach(component => {
      const componentHash = `C${hashCode(filePath + component.displayName)}`.replace('-', '')
      const componentMeta = { ...component, filePath }

      if (components.length === 1) {
        importList += `import { default as ${componentHash} } from '${filePath}';\n`
      } else {
        importList += `import { ${component.displayName} as ${componentHash} } from '${filePath}';\n`
      }
      metaList += `${componentHash}.meta = ${JSON.stringify(componentMeta)};\n`
      exportsList.push(componentHash)
    })
  })

  const componentTreeExport = `export default ${JSON.stringify(componentTree, null, 2)}`

  const fileContents = `${importList + metaList}export {${exportsList.join(
    ','
  )}}\n${componentTreeExport}`

  // Write it to the master exports file
  console.log('Writing master exports file...')
  fs.writeFileSync(path.resolve(__dirname, '../out', 'master-exports.js'), fileContents)

  return componentTree
}
