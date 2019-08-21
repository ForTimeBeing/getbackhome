const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  node: {
    fs: "empty"
  }
};