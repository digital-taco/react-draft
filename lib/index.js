module.exports = {
  buildComponentTree: require('./build-component-tree'),
  buildWrapperExport: require('./build-wrapper-export'),
  getFileStructure: require('./get-file-structure'),
  ...require('./config-helpers'),
  ...require('./get-component-glossary'),
  ...require('./build-component-index'),
  log: require('./logger'),
}
