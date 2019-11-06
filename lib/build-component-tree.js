const fs = require('fs')
const reactDocs = require('react-docgen')

module.exports = fileStructure => {
  const { files, cwd } = fileStructure

  const fileTree = {}

  files.forEach(file => {
    // Get the path sections for the file (filter out empty path sections)
    let paths = file.split(/[\\/]/).filter(p => p)
    // Get the file's name
    const fileName = paths[paths.length - 1]
    // Get the rest of the path sections
    paths = paths.slice(0, paths.length - 1)

    let previousNode = fileTree
    paths.forEach((path, index) => {
      previousNode[path] = previousNode[path] || {}

      // If it isn't the last path, then we need to go deeper
      if (index !== paths.length - 1) {
        previousNode = previousNode[path]
      } else {
        const fileContents = fs.readFileSync(cwd + file)
        try {
          // Attempt to parse the file for component definitions
          previousNode[path][fileName] = [
            cwd + file,
            reactDocs.parse(fileContents, reactDocs.resolver.findAllExportedComponentDefinitions),
          ]
        } catch (e) {
          // If it fails, it will throw an error - print it out here
          console.error(`[PARSE ERROR] ${file} | ${e.message}`)
        }
      }
    })
  })

  return fileTree
}
