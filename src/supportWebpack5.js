import { stringifyRequest } from 'loader-utils';

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
      const requestIdent = stringifyRequest(
        { context: loaderContext.rootContext },
        workerContext.request
      );
      const cacheIdent = `${workerContext.compiler.compilerPath}/worker-loader|${requestIdent}`;
      const cacheETag = getLazyHashedEtag(compilation.assets[workerFilename]);

      // TODO not working, need fix on webpack@5 side
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

          const workerCode = workerGenerator(
            loaderContext,
            workerFilename,
            workerSource,
            options
          );

          return workerContext.compiler.cache.store(
            cacheIdent,
            cacheETag,
            workerCode,
            (storeCacheError) => {
              if (storeCacheError) {
                return callback(storeCacheError);
              }

              return callback(null, workerCode);
            }
          );
        }
      );
    }

    return callback(null, null);
  });
}
