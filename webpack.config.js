const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const BuildExportsList = require('./lib/BuildExportsList')

module.exports = {
  context: path.resolve('.', 'src'),
  mode: 'production',
  cache: true,

  // Enables source maps
  devtool: 'source-map',

  // Our main entry point
  entry: {
    'render-demo': path.resolve(__dirname, 'src/components/DemoRenderer.js'),
  },

  plugins: [
    // Generates the HTML file for the demo
    new HtmlWebpackPlugin({ title: 'React Draft' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BuildExportsList(),
  ],

  resolve: {
    alias: {
      // Resolve the path to the target demo
      ExportsList: path.resolve(__dirname, 'out', 'master-exports.js'),
      // Resolve the path to React so we don't import multiple react versions
      react: path.resolve(__dirname, './node_modules/react'),
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
        include: [path.resolve('.'), path.resolve(__dirname, 'src')],
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
              plugins: ['@babel/plugin-syntax-dynamic-import'],
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
