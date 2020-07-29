import { getWorker } from './utils';

export default function runAsChild(worker, request, options, callback) {
  const subCache = `subcache ${__dirname} ${request}`;

  // eslint-disable-next-line no-param-reassign
  worker.compilation = (compilation) => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        // eslint-disable-next-line no-param-reassign
        compilation.cache[subCache] = {};
      }

      // eslint-disable-next-line no-param-reassign
      compilation.cache = compilation.cache[subCache];
    }
  };

  worker.compiler.hooks.compilation.tap('WorkerLoader', worker.compilation);
  worker.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      return callback(error);
    }

    if (entries[0]) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      worker.file = entries[0].files[0];

      // eslint-disable-next-line no-param-reassign
      worker.factory = getWorker(
        worker.file,
        compilation.assets[worker.file].source(),
        options
      );

      if (options.inline === 'no-fallback') {
        delete this._compilation.assets[worker.file];
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
