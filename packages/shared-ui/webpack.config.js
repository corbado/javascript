// const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const isProduction = process.env.NODE_ENV !== 'development';

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash].bundle.js' : 'index.js',
    clean: true,
    library: {
      name: 'CorbadoSharedUI',
      type: 'umd',
    },
    globalObject: 'this',
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: !isProduction,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
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
  // plugins: [
  //   new CopyWebpackPlugin({
  //     patterns: [
  //       {
  //         from: path.resolve(__dirname, 'assets'),
  //         to: 'optimizedAssets',
  //         noErrorOnMissing: true,
  //       },
  //     ],
  //   }),
  // ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  optimization: {
    minimize: isProduction,
  },
};
