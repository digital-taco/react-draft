export function isJsxString(str) {
  return str && /(<|\()/.test(str[0])
}

export function transpile(jsx) {
  return window.Babel.transform(jsx, {
    presets: ['es2015', 'react'],
    parserOpts: { sourceType: 'script', minified: true },
  }).code
}
