const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  cache: {
    type: 'filesystem',
  },
  optimization: {
    minimize: false,
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    open: true,
    hot: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, '../dist'),
    proxy: {
      '/api': {
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        target: 'http://rap2api.taobao.org/app/mock/245842',
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ],
};

module.exports = merge(baseConfig, devConfig);
