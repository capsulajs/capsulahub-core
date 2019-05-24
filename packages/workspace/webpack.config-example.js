const path = require('path');
const baseConfig = require('../../base-webpack.config');

module.exports = {
  ...baseConfig,
  entry: './example/index.ts',
  output: {
    path: path.resolve(__dirname, 'example/dist'),
    filename: 'index.js',
  },
  plugins: [],
};
