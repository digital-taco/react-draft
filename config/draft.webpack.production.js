const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { getInclusionRules } = require('../lib/config-helpers')

const { includedModules, excludedModules } = getInclusionRules(
  [],
  [path.resolve(__dirname, '../src')]
)

module.exports = {
  context: path.resolve(__dirname, '../src'),
  mode: 'development',
  cache: false,
  name: 'draft',
  devtool: 'none',

  entry: {
    'draft-main': [path.resolve(__dirname, '../src/components/Draft.js')],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: `Draft`,
      filename: 'index.html',
      chunks: ['runtime~draft-main', 'draft-main', 'vendors'],
      template: path.resolve(__dirname, '../templates/index.html'),
    }),
  ],

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },

  // resolve: {
  //   symlinks: true,
  //   alias: {
  //     // Resolve the path to React so we don't import multiple react versions
  //     react: path.resolve(__dirname, '../node_modules/react'),
  //     '@emotion/core': path.resolve(__dirname, '../node_modules/@emotion/core'),
  //   },
  // },

  // Webpack tries to look in the CWD node_modules for these loaders, which has issues sometimes. This just always resolves them to draft's node_modules.
  // resolveLoader: {
  //   alias: {
  //     'thread-loader': path.resolve(__dirname, '../node_modules/thread-loader/'),
  //     // 'cache-loader': path.resolve(__dirname, '../node_modules/cache-loader/'),
  //   },
  // },

  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        include: includedModules,
        exclude: excludedModules,
        use: [
          // 'cache-loader',
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
