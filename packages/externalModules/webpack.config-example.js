const path = require('path');
const baseConfig = require('../../base-webpack.config');

module.exports = {
  ...baseConfig,
  entry: {
    app: './src/app.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [],
};
