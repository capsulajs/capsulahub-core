const path = require('path');
const baseConfig = require('../../base-webpack.config');

module.exports = {
  ...baseConfig,
  entry: {
    'services/serviceA': './src/services/serviceA.ts',
    'services/serviceB': './src/services/serviceB.ts',
    'services/EnvRegistry': './src/services/EnvRegistry.ts',
    'services/EnvSelector': './src/services/EnvSelector.ts',
    'services/MethodSelector': './src/services/MethodSelector.ts',
    'services/Orchestrator': './src/services/Orchestrator.ts',
    'components/Logger': './src/components/Logger.tsx',
    'components/Catalog': './src/components/Catalog.tsx',
    'components/Grid': './src/components/Grid.tsx',
    'components/RequestForm': './src/components/RequestForm.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
};
