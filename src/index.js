/* eslint-disable
  import/first,
  import/order,
  comma-dangle,
  linebreak-style,
  no-param-reassign,
  no-underscore-dangle,
  prefer-destructuring
*/
import schema from './options.json';
import loaderUtils from 'loader-utils';
import validateOptions from '@webpack-contrib/schema-utils';

import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';
import getLazyHashedEtag from 'webpack/lib/cache/getLazyHashedEtag';

import getWorker from './workers/';
import WorkerLoaderError from './Error';

export default function loader() {}

export function pitch(request) {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions({ name: 'Worker Loader', schema, target: options });

  if (!this.webpack) {
    throw new WorkerLoaderError({
      name: 'Worker Loader',
      message: 'This loader is only usable with webpack',
    });
  }

  this.cacheable(false);

  const cb = this.async();

  const filename = loaderUtils.interpolateName(
    this,
    options.name || '[hash].worker.js',
    {
      context: options.context || this.rootContext || this.options.context,
      regExp: options.regExp,
    }
  );

  const worker = {};

  worker.options = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null,
  };

  worker.compiler = this._compilation.createChildCompiler(
    'worker',
    worker.options
  );

  // Tapable.apply is deprecated in tapable@1.0.0-x.
  // The plugins should now call apply themselves.
  new WebWorkerTemplatePlugin(worker.options).apply(worker.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new NodeTargetPlugin().apply(worker.compiler);
  }

  new SingleEntryPlugin(this.context, `!!${request}`, 'main').apply(
    worker.compiler
  );

  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) {
      return cb(err);
    }

    if (entries[0]) {
      worker.file = [...entries[0].files][0];

      const cacheIdent = `${worker.compiler.compilerPath}/worker-loader/${__dirname}/${
        this.resource
      }`;
      const cacheETag = getLazyHashedEtag(compilation.assets[worker.file]);

      return worker.compiler.cache.get(
        cacheIdent,
        cacheETag,
        (err, content) => {
          if (err) {
            return cb(err);
          }

          if (options.fallback === false) {
            delete this._compilation.assets[worker.file];
          }

          if (content) {
            return cb(null, content);
          }

          worker.factory = getWorker(
            worker.file,
            compilation.assets[worker.file].source(),
            options
          );

          const newContent = `module.exports = function() {\n  return ${
            worker.factory
          };\n};`;

          return worker.compiler.cache.store(
            cacheIdent,
            cacheETag,
            newContent,
            (err) => {
              if (err) {
                return cb(err);
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
