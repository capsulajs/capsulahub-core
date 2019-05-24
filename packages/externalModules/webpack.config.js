const path = require('path');
const baseConfig = require('../../base-webpack.config');

module.exports = {
  ...baseConfig,
  entry: {
    'services/serviceA': './src/services/serviceA.ts',
    serviceB: './src/services/serviceB.ts',
    Grid: './src/components/Grid.tsx',
    RequestForm: './src/components/RequestForm.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
};
