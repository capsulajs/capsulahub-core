const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  mode: 'development',
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
