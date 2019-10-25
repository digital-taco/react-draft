const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const css = require('rollup-plugin-css-only')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const react = require('react')
const reactDOM = require('react-dom')
const reactIs = require('react-is')
// const express = require('express')
// const open = require('open')


const inputOptions = {
  input: [
    './src/components/DemoWrapper.js',
  ],
  plugins: [
    nodeResolve({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': Object.keys(react),
        'node_modules/react-dom/index.js': Object.keys(reactDOM),
        'node_modules/react-is/index.js': Object.keys(reactIs)
      }
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react']
    }),
    css(),
  ]
}
const outputOptions = {
  format: 'umd',
  name: 'helpers'
}

// const output = {}

async function build() {
  const bundle = await rollup.rollup(inputOptions);

  console.log(bundle.watchFiles); // an array of file names this bundle depends on

  // generate code
  const { output } = await bundle.generate(outputOptions);
  console.log('LOG: build -> output', output)
}

// const app = express()

// app.use('/', (req, res, next) => {
  // res.set('content-type', 'text/html')
  // res.send()
  // res.end()
// })

build().then(() => {

  /** Start that sucker up */
  // app.listen(8080, err => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     open(`http://localhost:8080`)
  //   }
  // })

})
  .catch(console.error)

