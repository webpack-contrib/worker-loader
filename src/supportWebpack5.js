import { workerGenerator, sourceMappingURLRegex } from './utils';

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
      const [workerFilename] = [...entries[0].files];
      const cacheIdent = `${workerContext.compiler.compilerPath}/worker-loader/${__dirname}/${loaderContext.resource}`;
      const cacheETag = getLazyHashedEtag(compilation.assets[workerFilename]);

      return workerContext.compiler.cache.get(
        cacheIdent,
        cacheETag,
        (getCacheError, content) => {
          if (getCacheError) {
            return callback(getCacheError);
          }

          if (options.inline === 'no-fallback') {
            // eslint-disable-next-line no-underscore-dangle, no-param-reassign
            delete loaderContext._compilation.assets[workerFilename];

            // TODO improve this, we should store generated source maps files for file in `assetInfo`
            // eslint-disable-next-line no-underscore-dangle
            if (loaderContext._compilation.assets[`${workerFilename}.map`]) {
              // eslint-disable-next-line no-underscore-dangle, no-param-reassign
              delete loaderContext._compilation.assets[`${workerFilename}.map`];
            }
          }

          if (content) {
            return callback(null, content);
          }

          let workerSource = compilation.assets[workerFilename].source();

          if (options.inline === 'no-fallback') {
            // Remove `/* sourceMappingURL=url */` comment
            workerSource = workerSource.replace(sourceMappingURLRegex, '');
          }

          // eslint-disable-next-line no-param-reassign
          workerContext.factory = workerGenerator(
            loaderContext,
            workerFilename,
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
