#!/usr/bin/env node
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../lib/webpack.dev');

const projectRoot = process.cwd();
const packageConfig = require(path.join(projectRoot, './package.json'));
const port = packageConfig.port || 3000;

const options = {
  port,
  hot: true,
  open: true,
  historyApiFallback: true,
  proxy: packageConfig.proxy,
};

const compiler = webpack(devConfig);

const server = new WebpackDevServer(compiler, options);

server.listen(port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
});
