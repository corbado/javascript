const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const env = process.env.NODE_ENV;

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
    new Dotenv({
      path: `./.env.${env}`,
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 9000,
  },
};
