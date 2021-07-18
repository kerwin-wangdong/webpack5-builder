const fetch = require('node-fetch').default;
const FormData = require('form-data');
const webpackLog = require('webpack-log');

class ElasticAPMSourceMapWebpackPlugin {
  constructor(config) {
    if (!config.serviceName) {
      throw new Error('Elastic APM SourceMap Plugin must have a serviceName!');
    }
    if (!config.serviceVersion) {
      throw new Error('Elastic APM SourceMap Plugin must have a serviceVersion!');
    }
    this.config = config;
    this.logger = webpackLog({
      name: 'ElasticAPMSourceMapPlugin',
      level: 'debug'
    });
  }

  emit(compilation, callback) {
    this.logger.debug(`starting uploading sourcemaps with configs: ${JSON.stringify(this.config)}.`);
    const { chunks = [] } = compilation.getStats().toJson();

    const promises = chunks.map(chunk => {
      const { files, auxiliaryFiles } = chunk;
      const sourceFile = (files || []).find(i => i.match(/\.js$/));
      const sourceMap = (auxiliaryFiles || files || []).find(i => i.match(/\.js\.map$/));
      return { sourceFile, sourceMap };
    })
    .map(({ sourceFile, sourceMap }) => {
      if (!sourceFile || !sourceMap) {
        // It is impossible for Wepback to run into here.
        this.logger.debug('there is no .js files to be uploaded.');
        return Promise.resolve();
      }
      const formData = new FormData();
      const bundleFilePath = `${this.config.publicPath}/${sourceFile}`;

      formData.append('service_name', this.config.serviceName);
      formData.append('service_version', this.config.serviceVersion);
      formData.append('bundle_filepath', bundleFilePath);
      formData.append('sourcemap', compilation.assets[sourceMap].source(), {
        filename: sourceMap,
        contentType: 'application/json'
      });

      const headers = this.config.secret
        ? { Authorization: `Bearer ${this.config.secret}` }
        : undefined;

      this.logger.debug(
        `uploading ${sourceMap} to Elastic APM with bundle_filepath: ${bundleFilePath}.`
      );

      return fetch(this.config.serverURL, {
        method: 'POST',
        body: formData,
        headers: headers
      })
        .then(response => Promise.all([response.ok, response.text()]))
        .then(([ok, responseText]) => {
          if (ok) {
            this.logger.debug(`uploaded ${sourceMap}.`);
          } else {
            this.logger.error(`APM server response: ${responseText}`);
            throw new Error(`error while uploading ${sourceMap} to Elastic APM`);
          }
        });
    });

    Promise.all(promises)
    .then(() => {
      this.logger.debug('finished uploading sourcemaps.');
      callback();
    })
    .catch(err => {
      this.logger.error(err);
      if (this.config.ignoreErrors) {
        callback();
      } else {
        callback(err);
      }
    });
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ElasticAPMSourceMapPlugin', (compilation, callback) => {
      this.emit(compilation, callback);
    });
  }
}

module.exports = ElasticAPMSourceMapWebpackPlugin;