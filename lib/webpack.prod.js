// const path = require('path');
const { merge } = require('webpack-merge');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const ElasticAPMSourceMapWebpackPlugin = require('../plugins/elastic-apm-sourcemap-webpack-plugin');

// const projectRoot = process.cwd();
const baseConfig = require('./webpack.base');

// const packageConfig = require(path.join(projectRoot, 'package.json'));

const prodConfig = {
  mode: 'production',
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new ESBuildMinifyPlugin(),
    ],
  },
  devtool: 'hidden-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    process.env.ANALYZE && new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
    // packageConfig.sourceMap && new ElasticAPMSourceMapWebpackPlugin({
    //   serviceName: packageConfig.name,
    //   serviceVersion: packageConfig.version,
    //   publicPath: `http://localhost:${packageConfig.port || 3000}`,
    //   serverURL: 'http://localhost:8200/assets/v1/sourcemaps',
    // }),
  ].filter(Boolean),
};

module.exports = merge(baseConfig, prodConfig);
