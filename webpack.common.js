module.exports = {
  output: {
    filename: 'index.js',
    clean: true,
    globalObject: 'this',
    library: {
      type: 'module',
    },
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
  experiments: {
    outputModule: true,
  },
};
