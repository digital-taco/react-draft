const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const threadLoader = require('thread-loader')
const BuildExportsList = require('./lib/BuildExportsList')
const {
  getHMRPath,
  getPackageName,
  getInclusionRules,
  buildBabelConfig,
} = require('./lib/config-helpers')

const threadLoaderOptions = {
  workerParallelJobs: 100,
  poolRespawn: false,
  workerNodeArgs: ['--max-old-space-size=2048'],
  poolTimeout: 'infinity',
  name: 'threads',
}

threadLoader.warmup(threadLoaderOptions, ['babel-loader', 'cache-loader', 'file-loader'])

module.exports = draftConfig => {
  const { babelModules = [], babelConfig = {} } = draftConfig

  const draftBabelConfig = buildBabelConfig(babelConfig)
  const { includedModules, excludedModules } = getInclusionRules(babelModules)
  const packageName = getPackageName()
  const hotMiddlewareScriptPath = getHMRPath()

  const config = {
    context: path.resolve('.'),
    mode: 'development',
    cache: true,

    // Enables source maps - this option is slow for building, but fastest with original code for rebuilding (https://webpack.js.org/guides/build-performance/#devtool)
    devtool: process.env.DISABLE_SOURCE_MAPS ? 'none' : 'cheap-module-eval-source-map',

    entry: {
      'draft-main': [path.resolve(__dirname, 'src/components/Draft.js'), hotMiddlewareScriptPath],
      demo: [path.resolve(__dirname, 'src/components/Demo.js'), hotMiddlewareScriptPath],
    },

    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_PATH: process.env.PUBLIC_PATH,
        WRITE_TO_DISK: process.env.WRITE_TO_DISK,
        DEBUG: process.env.DEBUG,
      }),
      new HtmlWebpackPlugin({
        filename: 'demo.html',
        chunks: ['runtime~demo', 'demo', 'vendors', 'demo~draft-main'],
        template: path.resolve(__dirname, 'templates/demo.html'),
      }),
      new HtmlWebpackPlugin({
        title: `Draft | ${packageName.split('/').pop()}`,
        filename: 'index.html',
        chunks: ['runtime~draft-main', 'demo~draft-main', 'draft-main', 'vendors'],
        template: path.resolve(__dirname, 'templates/index.html'),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),

      // Allows us to hook into the lifecycle so we can rebuild the master-exports list
      new BuildExportsList(),
    ],

    resolve: {
      symlinks: true,
      alias: draftConfig.DEBUG
        ? {
            // Resolve the path to React so we don't import multiple react versions
            react: path.resolve(__dirname, './node_modules/react'),
            '@emotion/core': path.resolve(__dirname, './node_modules/@emotion/core'),
          }
        : undefined,
    },

    // Webpack tries to look in the CWD node_modules for these loaders, which has issues sometimes. This just always resolves them to draft's node_modules.
    resolveLoader: {
      alias: draftConfig.DEBUG
        ? {
            'thread-loader': path.resolve(__dirname, 'node_modules/thread-loader/'),
            'cache-loader': path.resolve(__dirname, 'node_modules/cache-loader/'),
          }
        : undefined,
    },

    output: {
      path: path.resolve('.', 'draft-build'),
      pathinfo: false, // REASON: https://webpack.js.org/guides/build-performance/#output-without-path-info
      publicPath: process.env.PUBLIC_PATH || '/',
      filename: '[name].js',
      libraryTarget: 'umd',
    },

    optimization: {
      runtimeChunk: 'multiple',
      moduleIds: 'hashed',
      minimize: false,
      removeAvailableModules: false, // REASON: https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
      removeEmptyChunks: false, // REASON: https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
      splitChunks: {
        minSize: 1000,
        chunks: 'all',
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
          test: /(\.js|\.jsx)$/,
          include: includedModules,
          exclude: excludedModules,
          use: [
            {
              loader: 'thread-loader',
              options: threadLoaderOptions,
            },
            'cache-loader',
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
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
