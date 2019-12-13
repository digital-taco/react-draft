const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const BuildExportsList = require('./lib/BuildExportsList')
const threadLoader = require('thread-loader')

const hotMiddlewareScript =
  'node_modules/webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true'

const threadLoaderOptions = {
  workerParallelJobs: 100,
  poolRespawn: false,
  workerNodeArgs: ['--max-old-space-size=2048'],
  poolTimeout: 'infinity',
  name: 'threads',
}

threadLoader.warmup(threadLoaderOptions, [
  'babel-loader',
  'cache-loader',
  'file-loader',
])

module.exports = draftConfig => {
  const {
    babelModules = []
  } = draftConfig

  // Build an array of regexes or functions to identify files that are in additional modules that need to run through babel
  const includedNodeModules = babelModules.map(m => m instanceof RegExp ? m : path.resolve('.', 'node_modules', m))

  // Build a single regex to exclude all node modules except the ones provided in the config babelModules option
  const joinedIncludedNodesModules = babelModules.join('|')
  const excludedModules = [/draft-build/, new RegExp(`node_modules/${joinedIncludedNodesModules && `(?!(${joinedIncludedNodesModules}))`}`)]

  // All paths that should be included in loaders
  const includedModules = [
    path.resolve('.'),
    path.resolve(__dirname, 'src'),
    ...includedNodeModules,
  ]

  // Set the title of the page to the CWD package name
  const packagePath = path.resolve('.', 'package.json')
  let { name: packageName } = fs.existsSync(packagePath) ? require(packagePath) : null

  const config = {
    context: path.resolve('.'),
    mode: 'development',
    cache: true,

    // Enables source maps - this option is slow for building, but fastest with original code for rebuilding (https://webpack.js.org/guides/build-performance/#devtool)
    devtool: process.env.DISABLE_SOURCE_MAPS ? 'none' : 'cheap-module-eval-source-map',
    entry: {
      'draft-main': [
        path.resolve(__dirname, 'src/components/Draft.js'),
        path.resolve(__dirname, hotMiddlewareScript),
      ],
      demo: [
        path.resolve(__dirname, 'src/components/Demo.js'),
        path.resolve(__dirname, hotMiddlewareScript),
      ],
    },

    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_PATH: process.env.PUBLIC_PATH,
        WRITE_TO_DISK: process.env.WRITE_TO_DISK,
        DEBUG: process.env.DEBUG
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
      alias: {
        // Resolve the path to React so we don't import multiple react versions
        react: path.resolve(__dirname, './node_modules/react'),
        '@emotion/core': path.resolve(__dirname, './node_modules/@emotion/core'),
      },
    },

    // Webpack tries to look in the CWD node_modules for these loaders, which has issues sometimes. This just always resolves them to draft's node_modules.
    resolveLoader: {
      alias: {
        'thread-loader': path.resolve(__dirname, 'node_modules/thread-loader/'),
        'cache-loader': path.resolve(__dirname, 'node_modules/cache-loader/'),
      }
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
                presets: [
                  '@babel/preset-react',
                  ['@babel/preset-env', { targets: { node: 'current' } }],
                  require.resolve('@emotion/babel-preset-css-prop'),
                ],
                plugins: [
                  '@babel/plugin-syntax-dynamic-import',
                ],
              },
            },
          ],
        },
        {
          test: /\.(jpg|jpeg|png|gif|ttf|ttf2|woff|woff2|svg)$/,
          loader: 'file-loader?name=[name].[ext]',
          include: includedModules,
          exclude: excludedModules,
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
