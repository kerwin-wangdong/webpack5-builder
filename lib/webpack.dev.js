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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ],
};

module.exports = merge(baseConfig, devConfig);
