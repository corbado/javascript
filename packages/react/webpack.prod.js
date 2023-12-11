const { merge } = require('webpack-merge');
const path = require('path');
const common = require('../../webpack.common.js');

module.exports = merge(common, {
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: '@corbado/react',
      type: 'umd',
    },
  },
  devtool: 'source-map',
  mode: 'production',
  externals: {
    '@corbado/react-sdk': '@corbado/react-sdk',
    '@corbado/shared-ui': '@corbado/shared-ui',
    '@corbado/web-core': '@corbado/web-core',
  },
  module: {
    rules: [
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
    ],
  },
});
