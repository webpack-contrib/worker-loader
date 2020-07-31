import { getWorker, sourceMappingURLRegex } from './utils';

export default function runAsChild(
  loaderContext,
  workerContext,
  options,
  callback
) {
  // eslint-disable-next-line import/no-unresolved, global-require
  const getLazyHashedEtag = require('webpack/lib/cache/getLazyHashedEtag');

  workerContext.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      return callback(error);
    }

    if (entries[0]) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      workerContext.filename = [...entries[0].files][0];

      const cacheIdent = `${workerContext.compiler.compilerPath}/worker-loader/${__dirname}/${loaderContext.resource}`;
      const cacheETag = getLazyHashedEtag(
        compilation.assets[workerContext.filename]
      );

      return workerContext.compiler.cache.get(
        cacheIdent,
        cacheETag,
        (getCacheError, content) => {
          if (getCacheError) {
            return callback(getCacheError);
          }

          if (options.inline === 'no-fallback') {
            // eslint-disable-next-line no-underscore-dangle, no-param-reassign
            delete loaderContext._compilation.assets[workerContext.filename];

            // TODO improve this, we should store generated source maps files for file in `assetInfo`
            if (
              // eslint-disable-next-line no-underscore-dangle
              loaderContext._compilation.assets[`${workerContext.filename}.map`]
            ) {
              // eslint-disable-next-line no-underscore-dangle, no-param-reassign
              delete loaderContext._compilation.assets[
                `${workerContext.filename}.map`
              ];
            }
          }

          if (content) {
            return callback(null, content);
          }

          let workerSource = compilation.assets[
            workerContext.filename
          ].source();

          if (options.inline === 'no-fallback') {
            // Remove `/* sourceMappingURL=url */` comment
            workerSource = workerSource.replace(sourceMappingURLRegex, '');
          }

          // eslint-disable-next-line no-param-reassign
          workerContext.factory = getWorker(
            loaderContext,
            workerContext.filename,
            workerSource,
            options
          );

          const esModule =
            typeof options.esModule !== 'undefined' ? options.esModule : true;
          const newContent = `${
            esModule ? 'export default' : 'module.exports ='
          } function() {\n  return ${workerContext.factory};\n};\n`;

          return workerContext.compiler.cache.store(
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
