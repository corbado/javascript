const { merge } = require('webpack-merge');
const path = require('path');
const common = require('../../webpack.common.js');

module.exports = merge(common, {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  mode: 'production',
  resolve: {
    alias: {
      '@corbado/shared-ui/assets': path.resolve(__dirname, '../../node_modules/@corbado/shared-ui/dist/assets'),
    },
  },
  externals: {
    '@corbado/web-core': '@corbado/web-core',
    '@corbado/shared-ui': '@corbado/shared-ui',
    react: 'react',
    i18next: 'i18next',
    'i18next-browser-languagedetector': 'i18next-browser-languagedetector',
    'react-i18next': 'react-i18next',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
    ],
  },
});
