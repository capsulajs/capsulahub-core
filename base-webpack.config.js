const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');

const packagePath = path.resolve(__dirname, `packages/${process.env.PACKAGE_NAME}`);

module.exports = {
  mode: 'production',
  entry: `${packagePath}/src/index.ts`,
  output: {
    path: `${packagePath}/dist`,
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
          compilerOptions: {
            declaration: false,
          },
        },
      },
      { parser: { import: false } },
    ],
  },
  plugins: [
    new WrapperPlugin({
      test: /\.js$/,
      header: 'var publicExports = {}; (function () {\n',
      footer: '})();export default publicExports',
    }),
  ],
  node: {
    fs: 'empty',
  },
};
