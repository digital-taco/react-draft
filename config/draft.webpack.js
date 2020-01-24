const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const threadLoader = require('thread-loader')
const { getInclusionRules } = require('../lib/config-helpers')

const threadLoaderOptions = {
  workerParallelJobs: 100,
  poolRespawn: false,
  workerNodeArgs: ['--max-old-space-size=2048'],
  poolTimeout: Infinity,
  name: 'threads',
}

threadLoader.warmup(threadLoaderOptions, ['babel-loader', 'cache-loader', 'file-loader'])

module.exports = () => {
  const { includedModules, excludedModules } = getInclusionRules(
    [],
    [path.resolve(__dirname, '../src')]
  )

  const config = {
    context: path.resolve(__dirname, '../src'),
    mode: 'development',
    cache: true,
    name: 'draft',

    // Enables source maps - this option is slow for building, but fastest with original code for rebuilding (https://webpack.js.org/guides/build-performance/#devtool)
    devtool: process.env.DISABLE_SOURCE_MAPS ? 'none' : 'cheap-module-eval-source-map',

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
        // Resolve the path to React so we don't import multiple react versions
        react: path.resolve(__dirname, '../node_modules/react'),
        '@emotion/core': path.resolve(__dirname, '../node_modules/@emotion/core'),
      },
    },

    // Webpack tries to look in the CWD node_modules for these loaders, which has issues sometimes. This just always resolves them to draft's node_modules.
    resolveLoader: {
      alias: {
        'thread-loader': path.resolve(__dirname, '../node_modules/thread-loader/'),
        'cache-loader': path.resolve(__dirname, '../node_modules/cache-loader/'),
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
            {
              loader: 'thread-loader',
              options: threadLoaderOptions,
            },
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
