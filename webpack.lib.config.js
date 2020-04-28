/* eslint-env node */

const path = require('path');

module.exports = {
  externals: {
    'prop-types': 'prop-types',
    react: 'react',
  },
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
    workers: path.resolve(__dirname, './lib/index.js'),
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, './dist/lib'),
  },
  optimization: { minimize: true },
};
