/* eslint-disable linebreak-style */

import path from 'path';
import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';
import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import schema from '../options.json';

const getWorker = (file, content, options) => {
  const workerPublicPath = `__webpack_public_path__ + ${JSON.stringify(file)}`;
  if (options.inline) {
    const createInlineWorkerPath = JSON.stringify(`!!${path.join(__dirname, '..', 'createInlineWorker.js')}`);
    const fallbackWorkerPath = options.fallback === false ? 'null' : workerPublicPath;
    return `require(${createInlineWorkerPath})(${JSON.stringify(content)}, ${fallbackWorkerPath})`;
  }
  return `new Worker(${workerPublicPath})`;
};

export default function workerLoader() {}

workerLoader.pitch = function pitch(request) {
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
  /* eslint-disable no-underscore-dangle */
  const workerCompiler = this._compilation.createChildCompiler('worker', outputOptions);
  /* eslint-enable no-underscore-dangle */
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
    /* eslint-disable no-param-reassign */
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }
      compilation.cache = compilation.cache[subCache];
    }
    /* eslint-enable no-param-reassign */
  });
  workerCompiler.runAsChild((err, entries, compilation) => {
    if (err) return callback(err);
    if (entries[0]) {
      const [workerFile] = entries[0].files;
      const workerFactory = getWorker(workerFile, compilation.assets[workerFile].source(), options);
      if (options.fallback === false) {
        /* eslint-disable no-underscore-dangle */
        delete this._compilation.assets[workerFile];
        /* eslint-enable no-underscore-dangle */
      }
      return callback(null, `module.exports = function() {\n\treturn ${workerFactory};\n};`);
    }
    return callback(null, null);
  });
};
