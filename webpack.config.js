const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const BuildExportsList = require('./lib/BuildExportsList')

const hotMiddlewareScript =
  'node_modules/webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true'

module.exports = draftConfig => {
  const includedNodeModules = (draftConfig.additionalReactModules || []).join('|')
  const excludedNodeModules = new RegExp(`node_modules/(?!${includedNodeModules})`)

  // Set the title of the page to the CWD package name
  const packagePath = path.resolve('.', 'package.json')
  let { name: packageName } = fs.existsSync(packagePath) ? require(packagePath) : null

  const config = {
    context: path.resolve('.'),
    mode: 'development',
    cache: true,

    // Enables source maps
    devtool: 'source-map',
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
      new HtmlWebpackPlugin({
        filename: 'demo.html',
        chunks: ['runtime~demo', 'demo', 'vendors', 'demo~draft-main'],
      }),
      new HtmlWebpackPlugin({
        title: `Draft | ${packageName.split('/').pop()}`,
        filename: 'index.html',
        chunks: ['runtime~draft-main', 'demo~draft-main', 'draft-main', 'vendors'],
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
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

    // This needed so svg-inline-loader (and others) will work correctly
    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules')],
    },

    output: {
      path: path.resolve(__dirname, '/'),
      publicPath: '/',
      filename: '[name].js', // Has to be name for some reason? Anything else doesn't load draft-main
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
            path.resolve(__dirname),
            path.resolve('.', '..'),
            // ...(draftConfig.additionalReactModules || []),
          ],
          exclude: [excludedNodeModules, /.*\.stories\.js$/],
          use: [
            'cache-loader',
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: [
                  '@babel/preset-react',
                  ['@babel/preset-env', { targets: { node: 'current' } }],
                  require.resolve('@emotion/babel-preset-css-prop'),
                  // ...(draftConfig.babelPresets || []),
                ],
                plugins: [
                  // 'babel-plugin-emotion',
                  '@babel/plugin-syntax-dynamic-import',
                  // ...(draftConfig.babelPlugins || []),
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
          test: /\.svg$/,
          loader: 'svg-inline-loader',
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
        {
          test: /(\.mdx$)/,
          loader: 'ignore-loader',
        },
      ],
    },
  }

  // Maybe we'll need something like this later?
  // if (draftConfig.filesToIgnore) {
  // config.module.rules.push({
  //   test: /(\.stories\.js$|\.mdx$)/,
  //   loader: 'ignore-loader',
  // })
  // }

  return config
}
