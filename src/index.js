import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';

import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';

import schema from './options.json';
import supportWebpack5 from './supportWebpack5';
import supportWebpack4 from './supportWebpack4';

let FetchCompileWasmPlugin;

try {
  // Webpack 5
  // eslint-disable-next-line import/no-unresolved, global-require
  FetchCompileWasmPlugin = require('webpack/lib/web/FetchCompileWasmPlugin');
} catch (ignoreError) {
  // Nothing
}

// Webpack 4
FetchCompileWasmPlugin =
  FetchCompileWasmPlugin ||
  // eslint-disable-next-line global-require
  require('webpack/lib/web/FetchCompileWasmTemplatePlugin');

export default function loader() {}

export function pitch(request) {
  const options = loaderUtils.getOptions(this);

  validateOptions(schema, options, {
    name: 'Worker Loader',
    baseDataPath: 'options',
  });

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
  const compilerOptions = this._compiler.options || {};
  const chunkFilename = compilerOptions.output.chunkFilename.replace(
    /\.([a-z]+)(\?.+)?$/i,
    '.worker.$1$2'
  );

  worker.options = { filename, chunkFilename, globalObject: 'self' };

  worker.compiler = this._compilation.createChildCompiler(
    'worker',
    worker.options
  );

  new WebWorkerTemplatePlugin(worker.options).apply(worker.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new NodeTargetPlugin().apply(worker.compiler);
  }

  new FetchCompileWasmPlugin({
    mangleImports: compilerOptions.optimization.mangleWasmImports,
  }).apply(worker.compiler);
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
