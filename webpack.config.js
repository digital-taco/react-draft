const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const reactDocs = require('react-docgen')

// Read Package JSON and parse component information
let componentInfo, filePath

try {
  const packageJson = require(path.resolve('.', 'package.json'))
  filePath = path.resolve(packageJson.main)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  componentInfo = reactDocs.parse(fileContents)
} catch (err) {
  throw err
}

module.exports = {
  context: path.resolve('.', 'src'), // TODO: Find the nearest parent package.json from current dir
  mode: 'production',
  cache: true,

  // Enables source maps
  devtool: 'source-map',

  entry: {
    'render-demo': path.resolve(__dirname, 'src/DemoRenderer.js'),
  },

  plugins: [
    // Generates the HTML file for the demo
    new HtmlWebpackPlugin({ title: componentInfo.displayName }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  resolve: {
    // symlinks: false,
    alias: {
      // Resolve the path to the target demo
      DemoFile: filePath,
      // Resolve the path to React so we don't import multiple react versions
      react: path.resolve(__dirname, './node_modules/react'),
      'parse-prop-types': path.resolve(__dirname, 'node_modules', 'parse-prop-types'),
    },
  },

  // This needed so svg-inline-loader (and others) will work correctly
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')],
  },

  output: {
    path: path.resolve(__dirname, '/'),
    publicPath: '/',
    filename: '[name].js', // Has to be name for some reason? Anything else doesn't load render-demo
    libraryTarget: 'umd', // make the bundle export
  },

  optimization: {
    runtimeChunk: 'multiple',
    moduleIds: 'hashed',
    minimize: false,
    splitChunks: {
      minSize: 1000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        targetComponent: {
          test: path.resolve('.', 'src'),
          name: 'target-component',
          chunks: 'all',
        },
      },
      chunks: 'all',
    },
  },

  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        include: [
          path.resolve('.'),
          path.resolve(__dirname, 'src'),
        ],
        exclude: /node_modules/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-react',
                ['@babel/preset-env', { targets: { node: 'current' } }],
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
              ],
            },
          },
        ],
      },
      {
        test: /\.(html|jpg|jpeg|png|gif|ttf|ttf2|woff|woff2|svg)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /\.module\.css$/
      }
    ],
  },
}
