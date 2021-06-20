const path = require('path');
const WebpackBar = require('webpackbar');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
// 主题色设定
const themeVariables = {
  'primary-color': '#1DA57A',
};

module.exports = {
  target: devMode ? 'web' : 'browserslist',
  stats: 'errors-warnings',
  entry: {
    index: path.join(__dirname, '../src/client/index.jsx'),
  },
  output: {
    clean: true,
    publicPath: '/',
    path: path.join(__dirname, '../dist'),
    filename: devMode ? '[name].js' : '[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: ['thread-loader', 'babel-loader'],
      },
      {
        test: /\.(c|le)ss$/i,
        exclude: /\.module\.(c|le)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeVariables,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(c|le)ss$/i,
        include: /\.module\.(c|le)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true,
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeVariables,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: path.join(__dirname, '../public/favicon.ico'),
      template: path.join(__dirname, '../public/index.html'),
      inject: true,
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new AntdDayjsWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.less'],
    alias: {
      '@': path.join(__dirname, '../src/client'),
    },
  },
};