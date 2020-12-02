import {
  workerGenerator,
  sourceMappingURLRegex,
  sourceURLWebpackRegex,
} from "./utils";

export default function runAsChild(
  loaderContext,
  workerContext,
  options,
  callback
) {
  workerContext.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      return callback(error);
    }

    if (entries[0]) {
      const [workerFilename] = [...entries[0].files];
      const cache = workerContext.compiler.getCache("worker-loader");
      const cacheIdent = workerFilename;
      const cacheETag = cache.getLazyHashedEtag(
        compilation.assets[workerFilename]
      );

      return cache.get(cacheIdent, cacheETag, (getCacheError, content) => {
        if (getCacheError) {
          return callback(getCacheError);
        }

        if (options.inline === "no-fallback") {
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

        if (options.inline === "no-fallback") {
          // Remove `/* sourceMappingURL=url */` comment
          workerSource = workerSource.replace(sourceMappingURLRegex, "");

          // Remove `//# sourceURL=webpack-internal` comment
          workerSource = workerSource.replace(sourceURLWebpackRegex, "");
        }

        const workerCode = workerGenerator(
          loaderContext,
          workerFilename,
          workerSource,
          options
        );

        return cache.store(
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
      });
    }

    return callback(
      new Error(
        `Failed to compile web worker "${workerContext.request}" request`
      )
    );
  });
}
