const { merge } = require('webpack-merge');
const path = require('path');
const common = require('../../webpack.common.js');

module.exports = merge(common, {
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'CorbadoReact',
      type: 'umd',
    },
  },
  devtool: 'source-map',
  mode: 'production',
});
