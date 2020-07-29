import { getWorker } from './utils';

export default function runAsChild(worker, options, callback) {
  // eslint-disable-next-line import/no-unresolved, global-require
  const getLazyHashedEtag = require('webpack/lib/cache/getLazyHashedEtag');

  worker.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      return callback(error);
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
            return callback(getCacheError);
          }

          if (options.inline === 'no-fallback') {
            delete this._compilation.assets[worker.file];
          }

          if (content) {
            return callback(null, content);
          }

          // eslint-disable-next-line no-param-reassign
          worker.factory = getWorker(
            worker.file,
            compilation.assets[worker.file].source(),
            options
          );

          const esModule =
            typeof options.esModule !== 'undefined' ? options.esModule : true;
          const newContent = `${
            esModule ? 'export default' : 'module.exports ='
          } function() {\n  return ${worker.factory};\n};\n`;

          return worker.compiler.cache.store(
            cacheIdent,
            cacheETag,
            newContent,
            (storeCacheError) => {
              if (storeCacheError) {
                return callback(storeCacheError);
              }

              return callback(null, newContent);
            }
          );
        }
      );
    }

    return callback(null, null);
  });
}
