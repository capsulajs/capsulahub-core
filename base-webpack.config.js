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
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
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
