import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';

import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';

import schema from './options.json';
import supportWebpack5 from './supportWebpack5';
import supportWebpack4 from './supportWebpack4';

export default function loader() {}

export function pitch(request) {
  const options = loaderUtils.getOptions(this);

  validateOptions(schema, options, {
    name: 'Worker Loader',
    baseDataPath: 'options',
  });

  validateOptions({ name: 'Worker Loader', schema, target: options });

  this.cacheable(false);

  const cb = this.async();

  const filename = loaderUtils.interpolateName(
    this,
    options.name || '[hash].worker.js',
    {
      context: options.context || this.rootContext || this.options.context,
      regExp: options.regExp,
    }
  );

  const worker = {};

  worker.options = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null,
  };

  worker.compiler = this._compilation.createChildCompiler(
    'worker',
    worker.options
  );

  // Tapable.apply is deprecated in tapable@1.0.0-x.
  // The plugins should now call apply themselves.
  new WebWorkerTemplatePlugin(worker.options).apply(worker.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new NodeTargetPlugin().apply(worker.compiler);
  }

  new SingleEntryPlugin(this.context, `!!${request}`, 'main').apply(
    worker.compiler
  );

  if (
    worker.compiler.cache &&
    typeof worker.compiler.cache.get === 'function'
  ) {
    supportWebpack5.call(this, worker, options, cb);
  } else {
    supportWebpack4.call(this, worker, request, options, cb);
  }
}
