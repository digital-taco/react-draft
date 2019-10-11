const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isProductionMode = process.argv.includes('--production')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isProductionMode ? 'production' : 'development',
  cache: true,

  // Enables source maps
  devtool: isProductionMode ? null : 'source-map',

  entry: {
    'render-demo': path.resolve(__dirname, 'src/components/DemoRenderer.js'),
  },

  resolve: {
    alias: {
      // Resolve the path to the target demo
      DemoFile: filePath,
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
          test: /[\\/]node_modules[\\/](?!@fs)/,
          name: 'vendors',
          chunks: 'all',
        },
        fs: {
          test: /[\\/]node_modules[\\/]@fs[\\/]/,
          name: 'fs',
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
        test: /\.js$/,
        include: [
          path.resolve('.'),
          path.resolve(__dirname, 'src'),
          path.resolve('node_modules/@fs'),
        ],
        exclude: /node_modules\/(?!@fs)/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-react',
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@emotion/babel-preset-css-prop',
              ],
              plugins: [
                ['babel-plugin-emotion', { sourceMaps: true }],
                '@babel/plugin-syntax-dynamic-import',
              ],
            },
          },
        ],
      },
      {
        test: /\.(html|png)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
}
