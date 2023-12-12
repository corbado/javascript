const path = require('path');
const { merge } = require('webpack-merge');
const common = require('../../webpack.common.js');

module.exports = merge(common, {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: '@corbado/shared-ui',
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
      {
        test: /\.json$/,
        type: 'json',
        include: /i18n/,
      },
    ],
  },
});