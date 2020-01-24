/* eslint-disable class-methods-use-this */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const threadLoader = require('thread-loader')
const { getInclusionRules, buildBabelConfig } = require('../lib/config-helpers')

const threadLoaderOptions = {
  workerParallelJobs: 100,
  poolRespawn: false,
  workerNodeArgs: ['--max-old-space-size=2048'],
  poolTimeout: Infinity,
  name: 'threads',
}

threadLoader.warmup(threadLoaderOptions, ['babel-loader', 'cache-loader', 'file-loader'])

module.exports = draftConfig => {
  const { babelModules = [], babelConfig = {} } = draftConfig

  const draftBabelConfig = buildBabelConfig(babelConfig)
  const { includedModules, excludedModules } = getInclusionRules(babelModules, [
    path.resolve('.'),
    path.resolve(__dirname, '../src/components/Demo.js'),
    path.resolve(__dirname, '../src/components/demo'),
  ])

  const config = {
    context: path.resolve('.'),
    mode: 'development',
    cache: true,
    name: 'demo',

    // Enables source maps - this option is slow for building, but fastest with original code for rebuilding (https://webpack.js.org/guides/build-performance/#devtool)
    devtool: process.env.DISABLE_SOURCE_MAPS ? 'none' : 'cheap-module-eval-source-map',

    entry: {
      demo: [path.resolve(__dirname, '../src/components/Demo.js')],
    },

    plugins: [
      // ENV variables
      new webpack.EnvironmentPlugin({
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_PATH: process.env.PUBLIC_PATH,
        WRITE_TO_DISK: process.env.WRITE_TO_DISK,
        DEBUG: process.env.DEBUG,
      }),

      // Build the HTML template for the demo
      new HtmlWebpackPlugin({
        filename: 'demo.html',
        chunks: ['runtime~demo', 'demo', 'vendors', 'demo~draft-main'],
        template: path.resolve(__dirname, '../templates/demo.html'),
      }),

      // Needed for HMR
      new webpack.HotModuleReplacementPlugin(),

      // This prevents an immediate rebuild triggered by component meta files being initially created
      new webpack.WatchIgnorePlugin([/(component-list|component-meta|component-tree)/]),
    ],

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
        'ignore-loader': path.resolve(__dirname, '../node_modules/ignore-loader/'),
      },
    },

    performance: false,

    output: {
      path: process.env.WRITE_TO_FILE
        ? path.resolve('.', 'draft-build')
        : path.resolve(__dirname, '..'),
      pathinfo: false, // REASON: https://webpack.js.org/guides/build-performance/#output-without-path-info
      publicPath: process.env.PUBLIC_PATH || '/',
      filename: '[name].js',
      libraryTarget: 'umd',
    },

    optimization: {
      runtimeChunk: true,
      moduleIds: 'hashed',
      minimize: false,
      removeAvailableModules: false, // REASON: https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
      removeEmptyChunks: false, // REASON: https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
      noEmitOnErrors: true,
      splitChunks: {
        minSize: 1000,
        chunks: 'all',
        name: false,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },

    module: {
      rules: [
        {
          test: /\.mdx$/,
          use: 'ignore-loader',
        },
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
                ...draftBabelConfig,
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
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
          include: /\.module\.css$/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          exclude: /\.module\.css$/,
        },
      ],
    },
  }

  return config
}
