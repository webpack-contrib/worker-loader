'use strict';

const path = require('path');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const schema = require('./options.json');

const getWorker = (file, content, options) => {
  const workerPublicPath = `__webpack_public_path__ + ${JSON.stringify(file)}`;
  if (options.inline) {
    const createInlineWorkerPath = JSON.stringify(`!!${path.join(__dirname, 'createInlineWorker.js')}`);
    const fallbackWorkerPath = options.fallback === false ? 'null' : workerPublicPath;
    return `require(${createInlineWorkerPath})(${JSON.stringify(content)}, ${fallbackWorkerPath})`;
  }
  return `new Worker(${workerPublicPath})`;
};

module.exports = function workerLoader() {};

module.exports.pitch = function pitch(request) {
  if (!this.webpack) throw new Error('Only usable with webpack');
  this.cacheable(false);
  const callback = this.async();
  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'Worker Loader');

  const filename = loaderUtils.interpolateName(this, options.name || '[hash].worker.js', {
    context: options.context || this.options.context,
    regExp: options.regExp,
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
  if (this.target !== 'webworker' && this.target !== 'web') {
    workerCompiler.apply(new NodeTargetPlugin());
  }
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
      const workerFactory = getWorker(workerFile, compilation.assets[workerFile].source(), options);
      if (options.fallback === false) {
        delete this._compilation.assets[workerFile];
      }
      return callback(null, `module.exports = function() {\n\treturn ${workerFactory};\n};`);
    }
    return callback(null, null);
  });
};
