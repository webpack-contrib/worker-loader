import getWorker from './workers';

export default function runAsChild(worker, request, options, cb) {
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
  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) return cb(err);

    if (entries[0]) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      worker.file = entries[0].files[0];

      // eslint-disable-next-line no-param-reassign
      worker.factory = getWorker(
        worker.file,
        compilation.assets[worker.file].source(),
        options
      );

      if (options.fallback === false) {
        delete this._compilation.assets[worker.file];
      }

      return cb(
        null,
        `module.exports = function() {\n  return ${worker.factory};\n};`
      );
    }

    return cb(null, null);
  });
}
