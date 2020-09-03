const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const configure = (devMode) => ({
  entry: './src/index.tsx',
  devtool: devMode ? 'eval-source-map' : 'nosources-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader', 'css-loader', 'sass-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: path.resolve(__dirname, 'dist', 'index.html'),
      xhtml: true,
    }),
  ],
  devServer: {
    hot: true,
    headers: {
      'Access-Control-Allow-Headers': 'x-ijt',
    },
  },
})

module.exports = (env, options) => {
  const { mode } = options;
  const devMode = mode === 'development';
  return configure(devMode)
};
