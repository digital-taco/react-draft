const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { getInclusionRules } = require('../lib/config-helpers')

const { includedModules, excludedModules } = getInclusionRules(
  [],
  [path.resolve(__dirname, '../src')]
)

module.exports = {
  context: path.resolve(__dirname, '../src'),
  mode: 'production',
  cache: false,
  devtool: 'none',

  entry: {
    draft: [path.resolve(__dirname, '../src/components/Draft.js')],
  },

  plugins: [
    // ENV variables
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
      PUBLIC_PATH: process.env.PUBLIC_PATH,
      WRITE_TO_DISK: process.env.WRITE_TO_DISK,
      DEBUG: process.env.DEBUG,
    }),

    new HtmlWebpackPlugin({
      title: `Draft`,
      filename: 'index.html',
      chunks: ['runtime~draft', 'draft', 'vendors'],
      template: path.resolve(__dirname, '../templates/index.html'),
    }),
  ],

  performance: {
    // Disables the warnings about entrypoints being too large
    hints: false,
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        include: includedModules,
        exclude: excludedModules,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: false,
              presets: [
                ['@babel/preset-env', { targets: { node: 'current' }, modules: false }],
                '@babel/preset-react',
                require.resolve('@emotion/babel-preset-css-prop'),
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|ttf|ttf2|woff|woff2|svg)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
