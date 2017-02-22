'use strict';

const path = require('path');
const WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const loaderUtils = require('loader-utils');

module.exports = function workerLoader() {};

module.exports.pitch = function pitch(request) {
  if (!this.webpack) throw new Error('Only usable with webpack');
  this.cacheable(false);
  const callback = this.async();
  const query = loaderUtils.parseQuery(this.query);
  const filename = loaderUtils.interpolateName(this, query.name || '[hash].worker.js', {
    context: query.context || this.options.context,
    regExp: query.regExp,
  });
  const outputOptions = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null,
  };
  if (this.options && this.options.worker && this.options.worker.output) {
    Object.keys(this.options.worker.output).forEach((name) => {
      outputOptions[name] = this.options.worker.output[name];
    });
  }
  const workerCompiler = this._compilation.createChildCompiler('worker', outputOptions);
  workerCompiler.apply(new WebWorkerTemplatePlugin(outputOptions));
  workerCompiler.apply(new SingleEntryPlugin(this.context, `!!${request}`, 'main'));
  if (this.options && this.options.worker && this.options.worker.plugins) {
    this.options.worker.plugins.forEach(plugin => workerCompiler.apply(plugin));
  }
  const subCache = `subcache ${__dirname} ${request}`;
  workerCompiler.plugin('compilation', (compilation) => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }
      compilation.cache = compilation.cache[subCache];
    }
  });
  workerCompiler.runAsChild((err, entries, compilation) => {
    if (err) return callback(err);
    if (entries[0]) {
      const workerFile = entries[0].files[0];
      let constructor = `new Worker(__webpack_public_path__ + ${JSON.stringify(workerFile)})`;
      if (query.inline) {
        constructor = `require(${JSON.stringify(`!!${path.join(__dirname, 'createInlineWorker.js')}`)})(${
          JSON.stringify(compilation.assets[workerFile].source())
        }, __webpack_public_path__ + ${
          JSON.stringify(workerFile)
        })`;
      }
      return callback(null, `module.exports = function() {\n\treturn ${constructor};\n};`);
    }
    return callback(null, null);
  });
};
