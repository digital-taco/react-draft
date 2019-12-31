/* eslint-disable no-bitwise */
/* eslint-disable no-var */
const fs = require('fs')
const path = require('path')

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

module.exports = (componentTree, draftConfig) => {
  const filesWithExports = []

  const parseBranch = branch => {
    Object.entries(branch).forEach(([, value]) => {
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
  let metaList = '\nconst exports = {}\n'
  const exportsList = []

  filesWithExports.forEach(([filePath, components]) => {
    const filePathHash = `A${hashCode(`${filePath}`)}`.replace('-', '')

    importList += `import * as ${filePathHash} from '${filePath}';\n`

    components.forEach(component => {
      const componentHash = `C${hashCode(filePath + component.displayName)}`.replace('-', '')
      const componentMeta = { ...component, filePath, componentHash }

      metaList += `
exports.${componentHash} = ${filePathHash}.${component.displayName} || ${filePathHash}.default
if (exports.${componentHash}) exports.${componentHash}.meta = ${JSON.stringify(componentMeta)}\n`

      exportsList.push(componentHash)
    })
  })

  // ADD EMPTY DEMO FILE
  importList += `import {default as EmptyDemo} from '${path.resolve(
    __dirname,
    '../src/components/demo/EmptyDemo.js'
  )}';\n`

  metaList += `
exports.EmptyDemo = EmptyDemo
exports.EmptyDemo.meta = {componentHash: 'EmptyDemo'}\n
  `

  // For debugging
  // metaList += 'console.log("EXPORTS", exports)\n'

  const componentTreeExport = `exports.componentTree = ${JSON.stringify(componentTree, null, 2)}`

  // Check if draft.wrapper.js exists
  let wrapperPath = draftConfig.wrapperPath
  if (!wrapperPath) {
    const defaultPath = path.resolve('.', 'draft.wrapper.js')
    const wrapperExists = fs.existsSync(defaultPath)
    if (wrapperExists) {
      wrapperPath = defaultPath
    }
  }

  if (wrapperPath) {
    importList += `import Wrapper from '${wrapperPath}'\n`
    metaList += `exports.Wrapper = Wrapper`
  }

  const fileContents = `${importList + metaList}\n${componentTreeExport}\nexport default exports`

  // Write it to the master exports file
  console.log('Writing master exports file...')
  if (!fs.existsSync(path.resolve(__dirname, '../out'))) {
    fs.mkdirSync(path.resolve(__dirname, '../out'))
  }
  fs.writeFileSync(path.resolve(__dirname, '../out', 'master-exports.js'), fileContents)

  return componentTree
}
