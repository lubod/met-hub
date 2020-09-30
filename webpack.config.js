const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const frontConfig = {
  target: 'web',
  entry: './client/index.tsx',
//  devtool: devMode ? 'eval-source-map' : 'nosources-source-map',
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
      template: './client/index.html',
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
};

const backConfigMain = {
  target: 'node',
  entry: './server/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
};

const backConfigStore = {
  target: 'node',
  entry: './server/store.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'store.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
};

module.exports = [frontConfig, backConfigMain, backConfigStore];


