const path = require('path');
const webpack = require('webpack');

const currentPath = __dirname.toLowerCase();
const distPath = path.join(currentPath, 'dist');
const srcPath =  path.join(currentPath, 'src');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  resolve: {
    modulesDirectories: [
      'node_modules'
    ],
    extensions: [ '', '.json', '.js' ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: [ 'babel', 'eslint' ],
        include: [
          srcPath
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.md/,
        loaders: [ "html-loader", "markdown-loader" ]
      }
    ]
  }
};