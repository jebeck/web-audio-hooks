/* eslint-env node */

const path = require('path');

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /(\.js$)/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /(\.worker\.js$)/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'worker-loader',
            options: { fallback: false, inline: true },
          },
          'babel-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  entry: {
    lib: path.resolve(__dirname, './workers/index.js'),
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, './dist/workers'),
  },
  optimization: { minimize: true },
};
