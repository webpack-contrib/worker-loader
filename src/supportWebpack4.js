import { stringifyRequest } from 'loader-utils';

import { getWorker, sourceMappingURLRegex } from './utils';

export default function runAsChild(worker, request, options, callback) {
  const subCache = `subcache worker-loader ${stringifyRequest(
    { context: this.rootContext },
    request
  )}`;

  worker.compiler.hooks.compilation.tap('worker-loader', (compilation) => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        // eslint-disable-next-line no-param-reassign
        compilation.cache[subCache] = {};
      }

      // eslint-disable-next-line no-param-reassign
      compilation.cache = compilation.cache[subCache];
    }
  });

  worker.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      return callback(error);
    }

    if (entries[0]) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      worker.filename = entries[0].files[0];

      let workerSource = compilation.assets[worker.filename].source();

      if (options.inline === 'no-fallback') {
        // Remove `/* sourceMappingURL=url */` comment
        workerSource = workerSource.replace(sourceMappingURLRegex, '');
      }

      // eslint-disable-next-line no-param-reassign
      worker.factory = getWorker(this, worker.filename, workerSource, options);

      if (options.inline === 'no-fallback') {
        delete this._compilation.assets[worker.filename];

        // TODO improve this, we should store generated source maps files for file in `assetInfo`
        if (this._compilation.assets[`${worker.filename}.map`]) {
          delete this._compilation.assets[`${worker.filename}.map`];
        }
      }

      const esModule =
        typeof options.esModule !== 'undefined' ? options.esModule : true;

      return callback(
        null,
        `${
          esModule ? 'export default' : 'module.exports ='
        } function() {\n  return ${worker.factory};\n};\n`
      );
    }

    return callback(null, null);
  });
}
