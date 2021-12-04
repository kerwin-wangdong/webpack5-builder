#!/usr/bin/env node
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../lib/webpack.dev');

const projectRoot = process.cwd();
const packageConfig = require(path.join(projectRoot, 'package.json'));
const port = packageConfig.port || 3000;

const devServerOptions = {
  port,
  hot: true,
  open: false,
  historyApiFallback: true,
  proxy: packageConfig.proxy,
};

const compiler = webpack(devConfig);

const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer();