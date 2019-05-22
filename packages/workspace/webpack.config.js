const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: '../tsconfig.json',
          compilerOptions: { declaration: false },
        },
      },
      { parser: { import: false } },
    ],
  },
  plugins: [
    // strict mode for the whole bundle
    new WrapperPlugin({
      test: /\.js$/, // only wrap output of bundle files with '.js' extension
      header: 'var publicExports = {}; (function () {\n',
      footer: '})();export default publicExports',
    }),
  ],
  node: {
    fs: 'empty',
  },
};
