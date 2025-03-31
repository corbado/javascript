const { merge } = require('webpack-merge');
const path = require('path');
const common = require('../../webpack.common.js');

module.exports = merge(common, {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist/'),
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: {
    '@corbado/web-core': '@corbado/web-core',
    react: 'react',
  },
});
