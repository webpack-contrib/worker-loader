import { stringifyRequest } from 'loader-utils';

import { workerGenerator, sourceMappingURLRegex } from './utils';

export default function runAsChild(
  loaderContext,
  workerContext,
  options,
  callback
) {
  const subCache = `subcache worker-loader ${stringifyRequest(
    { context: loaderContext.rootContext },
    workerContext.request
  )}`;

  workerContext.compiler.hooks.compilation.tap(
    'worker-loader',
    (compilation) => {
      if (compilation.cache) {
        if (!compilation.cache[subCache]) {
          // eslint-disable-next-line no-param-reassign
          compilation.cache[subCache] = {};
        }

        // eslint-disable-next-line no-param-reassign
        compilation.cache = compilation.cache[subCache];
      }
    }
  );

  workerContext.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      return callback(error);
    }

    if (entries[0]) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      workerContext.filename = entries[0].files[0];

      let workerSource = compilation.assets[workerContext.filename].source();

      if (options.inline === 'no-fallback') {
        // Remove `/* sourceMappingURL=url */` comment
        workerSource = workerSource.replace(sourceMappingURLRegex, '');
      }

      // eslint-disable-next-line no-param-reassign
      workerContext.factory = workerGenerator(
        loaderContext,
        workerContext.filename,
        workerSource,
        options
      );

      if (options.inline === 'no-fallback') {
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        delete loaderContext._compilation.assets[workerContext.filename];

        // TODO improve it, we should store generated source maps files for file in `assetInfo`
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

      const esModule =
        typeof options.esModule !== 'undefined' ? options.esModule : true;

      return callback(
        null,
        `${
          esModule ? 'export default' : 'module.exports ='
        } function() {\n  return ${workerContext.factory};\n};\n`
      );
    }

    return callback(null, null);
  });
}
