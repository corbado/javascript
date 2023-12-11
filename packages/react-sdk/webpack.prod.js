const { merge } = require('webpack-merge');
const path = require('path');
const common = require('../../webpack.common.js');

module.exports = merge(common, {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: '@corbado/react-sdk',
      type: 'umd',
    },
  },
  devtool: 'source-map',
  mode: 'production',
  externals: {
    '@corbado/web-core': '@corbado/web-core',
  },
});
