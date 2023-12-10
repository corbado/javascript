const path = require('path');

module.exports = {
  output: {
    filename: 'index.js',
    clean: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
};
