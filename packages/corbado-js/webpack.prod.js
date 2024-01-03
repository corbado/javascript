const { merge } = require('webpack-merge');
const path = require('path');
const common = require('../../webpack.common.js');

module.exports = merge(common, {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    },
  },
  devtool: 'source-map',
  mode: 'production',
  externals: {
    i18next: 'i18next',
    'i18next-browser-languagedetector': 'i18next-browser-languagedetector',
    'react-i18next': 'react-i18next',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: [
          '@svgr/webpack',
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
    ],
  },
});
