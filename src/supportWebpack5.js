import getWorker from './workers';

export default function runAsChild(worker, options, cb) {
  // eslint-disable-next-line import/no-unresolved, global-require
  const getLazyHashedEtag = require('webpack/lib/cache/getLazyHashedEtag');

  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) {
      return cb(err);
    }

    if (entries[0]) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      worker.file = [...entries[0].files][0];

      const cacheIdent = `${worker.compiler.compilerPath}/worker-loader/${__dirname}/${this.resource}`;
      const cacheETag = getLazyHashedEtag(compilation.assets[worker.file]);

      return worker.compiler.cache.get(
        cacheIdent,
        cacheETag,
        (getCacheError, content) => {
          if (getCacheError) {
            return cb(getCacheError);
          }

          if (options.fallback === false) {
            delete this._compilation.assets[worker.file];
          }

          if (content) {
            return cb(null, content);
          }

          // eslint-disable-next-line no-param-reassign
          worker.factory = getWorker(
            worker.file,
            compilation.assets[worker.file].source(),
            options
          );

          const newContent = `module.exports = function() {\n  return ${worker.factory};\n};`;

          return worker.compiler.cache.store(
            cacheIdent,
            cacheETag,
            newContent,
            (storeCacheError) => {
              if (storeCacheError) {
                return cb(storeCacheError);
              }

              return cb(null, newContent);
            }
          );
        }
      );
    }

    return cb(null, null);
  });
}
