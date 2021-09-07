const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const frontConfig = {
  target: 'web',
  entry: './client/index.tsx',
//  devtool: 'eval-source-map',
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
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/fe'),
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
      filename: path.resolve(__dirname, 'dist/fe', 'index.html'),
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
    path: path.resolve(__dirname, 'dist/be'),
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
    path: path.resolve(__dirname, 'dist/be'),
  },
  externals: [nodeExternals()],
};

const backConfigPoll = {
  target: 'node',
  entry: './server/poll.ts',
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
    filename: 'poll.js',
    path: path.resolve(__dirname, 'dist/be'),
  },
  externals: [nodeExternals()],
};

const testConfigStation = {
  target: 'node',
  entry: './testStation.ts',
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
    filename: 'testStation.js',
    path: path.resolve(__dirname, 'dist/test'),
  },
  externals: [nodeExternals()],
};

const testConfigDom = {
  target: 'node',
  entry: './testDom.ts',
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
    filename: 'testDom.js',
    path: path.resolve(__dirname, 'dist/test'),
  },
  externals: [nodeExternals()],
};

module.exports = [frontConfig, backConfigMain, backConfigStore, backConfigPoll, testConfigStation, testConfigDom];


