/* eslint-disable no-bitwise */
function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

function getComponentGlossary(componentTree) {
  const componentMeta = {}
  const parseBranch = branch => {
    Object.entries(branch).forEach(([, value]) => {
      // If it is an object, it's another branch, so parse it too
      if (!Array.isArray(value)) parseBranch(value)
      // If it is an array, it's a file
      else {
        const [filePath, components] = value
        components.forEach(c => {
          const componentHash = `C${hashCode(filePath + c.displayName)}`.replace('-', '')
          componentMeta[componentHash] = c
          componentMeta[componentHash].filePath = filePath
          componentMeta[componentHash].componentHash = componentHash
        })
      }
    }, {})
  }
  // Parse the component tree for files with exports
  parseBranch(componentTree)
  return componentMeta
}

module.exports = {
  hashCode,
  getComponentGlossary,
}
