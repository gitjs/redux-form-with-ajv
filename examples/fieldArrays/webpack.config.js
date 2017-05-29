const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const currentPath = __dirname.toLowerCase();
const distPath = path.join(currentPath, 'dist');
const srcPath = path.join(currentPath);
const entry = path.join(currentPath, 'index.js');
const modulePath = path.join(currentPath, '../../', 'src');

module.exports = {
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    'eventsource-polyfill',
    'webpack-hot-middleware/client',
    entry,
  ],
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css',
        'https://redux-form.com/6.5.0/bundle.css'
      ], append: true
    })
  ],
  resolve: {
    alias: {
      'redux-form-with-ajv': modulePath
    },
    modulesDirectories: [
      'node_modules'
    ],
    extensions: ['', '.json', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: ['babel', 'eslint'],
        include: [
          srcPath,
          modulePath
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.md/,
        loaders: ["html-loader", "markdown-loader"]
      }
    ]
  }
};