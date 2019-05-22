const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
const TsDeclarationWebpackPlugin = require('ts-declaration-webpack-plugin');

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
    new TsDeclarationWebpackPlugin(),
  ],
  node: {
    fs: 'empty',
  },
};
