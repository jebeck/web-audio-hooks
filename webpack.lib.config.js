/* eslint-env node */

const path = require('path');

module.exports = {
  externals: {
    '@xstate/react': '@xstate/react',
    'prop-types': 'prop-types',
    react: 'react',
    'styled-components': 'styled-components',
    teoria: 'teoria',
    uuid: 'uuid',
    webmidi: 'webmidi',
    xstate: 'xstate',
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
