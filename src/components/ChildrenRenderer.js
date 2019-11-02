import React from 'react'

export default function ChildrenRenderer({ value }) {
  try {
    let newText = ''
    let transpiled = ''
    if (window.Babel) {
      // eslint-disable-next-line no-undef
      newText = Babel.transform(value, {
        presets: ['es2015', 'react'],
        parserOpts: { sourceType: 'script', minified: true },
      }).code
      console.log('TRANSPILED', newText)
      transpiled = eval(newText) // eslint-disable-line
    } else {
      console.log('babel not defined')
    }
    console.log('TCL: ChildrenInput -> transpiled', transpiled)
    return transpiled || ''
  } catch (err) {
    console.log('TCL: ChildrenRenderer -> err', err)
    return value
  }
}
