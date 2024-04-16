const { merge } = require('webpack-merge');
const path = require('path');
const common = require('../../webpack.common.js');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = merge(common, {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FE_LIBRARY_VERSION': JSON.stringify(pkg.version),
    }),
  ],
});
