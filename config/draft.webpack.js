const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { getInclusionRules } = require('../lib/config-helpers')

const { includedModules, excludedModules } = getInclusionRules(
  [],
  [path.resolve(__dirname, '../src')]
)

module.exports = () => {
  const config = {
    context: path.resolve(__dirname, '../src'),
    mode: 'development',
    cache: true,
    name: 'draft',

    // Enables source maps - this option is slow for building, but fastest with original code for rebuilding (https://webpack.js.org/guides/build-performance/#devtool)
    devtool: process.env.DISABLE_SOURCE_MAPS ? 'none' : 'cheap-module-eval-source-map',

    entry: {
      draft: ['react-hot-loader/patch', path.resolve(__dirname, '../src/components/Draft.js')],
    },

    plugins: [
      // ENV variables
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        PUBLIC_PATH: '/',
        WRITE_TO_DISK: false,
        DEBUG: false,
      }),

      new HtmlWebpackPlugin({
        title: `Draft`,
        filename: 'index.html',
        chunks: ['runtime~draft', 'draft', 'vendors'],
        template: path.resolve(__dirname, '../templates/index.html'),
      }),

      // Needed for HMR
      new webpack.HotModuleReplacementPlugin(),

      // This prevents an immediate rebuild triggered by component meta files being initially created
      new webpack.WatchIgnorePlugin([path.resolve(__dirname, '../out'), path.resolve('.')]),
    ],

    output: {
      path: path.resolve(__dirname, '..'),
      pathinfo: false, // REASON: https://webpack.js.org/guides/build-performance/#output-without-path-info
      filename: '[name].js',
      libraryTarget: 'umd',

      // HMR only works with our setup like this
      hotUpdateChunkFilename: 'hot-update.js',
      hotUpdateMainFilename: 'main.hot-update.json',
    },

    optimization: {
      runtimeChunk: 'multiple',
      moduleIds: 'hashed',
      minimize: false,
      removeAvailableModules: true, // REASON: https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
      removeEmptyChunks: true, // REASON: https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
      noEmitOnErrors: true,
    },

    resolve: {
      symlinks: true,
      alias: {
        // This must be resolved before react
        'react-hot-loader': path.resolve(__dirname, '../node_modules/react-hot-loader'),
        // Resolve the path to React so we don't import multiple react versions
        react: path.resolve(__dirname, '../node_modules/react'),
        // react-hot-loader alters react-dom, so we need to resolve to the altered version
        'react-dom': path.resolve(__dirname, '../node_modules/@hot-loader/react-dom/'),
        '@emotion/core': path.resolve(__dirname, '../node_modules/@emotion/core'),
      },
    },

    // Webpack tries to look in the CWD node_modules for these loaders, which has issues sometimes. This just always resolves them to draft's node_modules.
    resolveLoader: {
      alias: {
        'thread-loader': path.resolve(__dirname, '../node_modules/thread-loader/'),
        'cache-loader': path.resolve(__dirname, '../node_modules/cache-loader/'),
        'react-hot-loader/webpack': path.resolve(
          __dirname,
          '../node_modules/react-hot-loader/webpack'
        ),
      },
    },

    module: {
      rules: [
        {
          test: /(\.js|\.jsx)$/,
          include: includedModules,
          exclude: excludedModules,
          use: [
            'cache-loader',
            'react-hot-loader/webpack',
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
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

  return config
}
