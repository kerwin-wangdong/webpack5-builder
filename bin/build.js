#!/usr/bin/env node
const webpack = require('webpack');
const prodConfig = require('../lib/webpack.prod');

const compiler = webpack(prodConfig);

compiler.run();
