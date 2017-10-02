const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const currentPath = __dirname;
const distPath = path.join(currentPath, 'dist');
const srcPath = path.join(currentPath);
const entry = path.join(currentPath, 'index.js');
const modulePath = path.join(currentPath, '../../', 'src');

module.exports = {
  devtool: 'eval',
  entry: ['babel-polyfill', 'eventsource-polyfill', 'webpack-hot-middleware/client', entry],
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css',
        'https://redux-form.com/6.5.0/bundle.css'
      ],
      append: true
    })
  ],
  resolve: {
    alias: {
      'redux-form-with-ajv': modulePath
    },
    modules: ['node_modules'],
    extensions: ['.json', '.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        use: [{ loader: 'babel-loader' }],
        include: [srcPath, modulePath]
      },
      {
        test: /\.json$/,
        use: [{ loader: 'json-loader' }]
      },
      {
        test: /\.md/,
        use: [{ loader: 'html-loader' }, { loader: 'markdown-loader' }]
      }
    ]
  }
};
