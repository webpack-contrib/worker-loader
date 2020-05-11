import getLazyHashedEtag from 'webpack/lib/cache/getLazyHashedEtag';
import getWorker from './workers';

export default function(worker, options, cb) {
  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) {
      return cb(err);
    }

    if (entries[0]) {
      worker.file = [...entries[0].files][0];

      const cacheIdent = `${
        worker.compiler.compilerPath
      }/worker-loader/${__dirname}/${this.resource}`;
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
