const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/scripts/index.js',
    auth: './src/scripts/auth.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/auth.html',
      filename: 'auth.html',
      chunks: ['auth'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 9000,
  },
};
