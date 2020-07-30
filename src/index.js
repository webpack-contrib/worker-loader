import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';
import ExternalsPlugin from 'webpack/lib/ExternalsPlugin';

import schema from './options.json';
import supportWebpack5 from './supportWebpack5';
import supportWebpack4 from './supportWebpack4';
import {
  getDefaultFilename,
  getDefaultChunkFilename,
  getExternalsType,
} from './utils';

let FetchCompileWasmPlugin;
let FetchCompileAsyncWasmPlugin;

try {
  // Webpack 5, sync WASM
  // eslint-disable-next-line global-require, import/no-unresolved
  FetchCompileWasmPlugin = require('webpack/lib/web/FetchCompileWasmPlugin');
} catch (ignoreError) {
  // Nothing
}

try {
  // Webpack 5, async WASM
  // eslint-disable-next-line global-require, import/no-unresolved
  FetchCompileAsyncWasmPlugin = require('webpack/lib/web/FetchCompileAsyncWasmPlugin');
} catch (ignoreError) {
  // Nothing
}

// Webpack 4
FetchCompileWasmPlugin =
  FetchCompileWasmPlugin ||
  // eslint-disable-next-line global-require, import/no-unresolved
  require('webpack/lib/web/FetchCompileWasmTemplatePlugin');

export default function loader() {}

export function pitch(request) {
  this.cacheable(false);

  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Worker Loader',
    baseDataPath: 'options',
  });

  const worker = {};
  const compilerOptions = this._compiler.options || {};
  const filename = options.filename
    ? options.filename
    : getDefaultFilename(compilerOptions.output.filename);
  const chunkFilename = options.chunkFilename
    ? options.chunkFilename
    : getDefaultChunkFilename(compilerOptions.output.chunkFilename);
  const publicPath = options.publicPath
    ? options.publicPath
    : compilerOptions.output.publicPath;

  worker.options = {
    filename,
    chunkFilename,
    publicPath,
    globalObject: 'self',
  };

  worker.compiler = this._compilation.createChildCompiler(
    `worker-loader ${request}`,
    worker.options
  );

  new WebWorkerTemplatePlugin(worker.options).apply(worker.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new NodeTargetPlugin().apply(worker.compiler);
  }

  if (FetchCompileWasmPlugin) {
    new FetchCompileWasmPlugin({
      mangleImports: compilerOptions.optimization.mangleWasmImports,
    }).apply(worker.compiler);
  }

  if (FetchCompileAsyncWasmPlugin) {
    new FetchCompileAsyncWasmPlugin().apply(worker.compiler);
  }

  if (compilerOptions.externals) {
    new ExternalsPlugin(
      getExternalsType(compilerOptions),
      compilerOptions.externals
    ).apply(worker.compiler);
  }

  new SingleEntryPlugin(this.context, `!!${request}`, 'main').apply(
    worker.compiler
  );

  const cb = this.async();

  if (
    worker.compiler.cache &&
    typeof worker.compiler.cache.get === 'function'
  ) {
    supportWebpack5.call(this, worker, options, cb);
  } else {
    supportWebpack4.call(this, worker, request, options, cb);
  }
}
