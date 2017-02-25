'use strict';

const assert = require('assert');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');

process.chdir(__dirname);

const readFile = file => fs.readFileSync(file, 'utf-8');

const makeBundle = (name, options) => del(`expected/${name}`).then(() => {
  const config = Object.assign({
    entry: `./fixtures/${name}/entry.js`,
    output: {
      path: `expected/${name}`,
      filename: 'bundle.js',
    },
  }, options);
  const bundle = webpack(config);
  return new Promise((resolve, reject) => {
    bundle.run((err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.compilation.errors.length) {
        reject(Error(stats.toString('errors-only')));
      } else {
        resolve(stats);
      }
    });
  });
});

describe('worker-loader', () => {
  it('should create chunk with worker', () =>
    makeBundle('worker').then((stats) => {
      const files = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/worker/${item}`);
      assert.equal(files.length, 1);
      assert.notEqual(readFile(files[0]).indexOf('// worker test mark'), -1);
    })
  );

  it('should create chunk with specified name in query', () =>
    makeBundle('name-query').then((stats) => {
      const files = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/name-query/${item}`);
      assert.equal(files[0], 'expected/name-query/namedWorker.js');
      assert.notEqual(readFile(files[0]).indexOf('// named worker test mark'), -1);
    })
  );

  it('should create named chunks with workers via options', () =>
    makeBundle('name-options', {
      module: {
        rules: [
          {
            test: /(w1|w2)\.js$/,
            loader: '../index.js',
            options: {
              name: '[name].js',
            },
          },
        ],
      },
    }).then((stats) => {
      const files = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/name-options/${item}`)
        .sort();
      assert.equal(files.length, 2);
      assert.notEqual(readFile(files[0]).indexOf('// w1 via worker options'), -1);
      assert.notEqual(readFile(files[1]).indexOf('// w2 via worker options'), -1);
    })
  );

  it('should inline worker with inline option in query', () =>
    makeBundle('inline-query').then((stats) => {
      const files = stats.toJson('minimal').chunks
        .map(item => item.files)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => `expected/inline-query/${item}`);
      assert.equal(files.length, 1);
      assert.notEqual(readFile(files[0]).indexOf('// inlined worker test mark'), -1);
    })
  );

  it('should inline worker with inline in options', () =>
    makeBundle('inline-options', {
      module: {
        rules: [
          {
            test: /(w1|w2)\.js$/,
            loader: '../index.js',
            options: {
              inline: true,
            },
          },
        ],
      },
    }).then((stats) => {
      const files = stats.toJson('minimal').chunks
        .map(item => item.files)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => `expected/inline-options/${item}`);
      assert.equal(files.length, 1);
      assert.notEqual(readFile(files[0]).indexOf('// w1 inlined via options'), -1);
      assert.notEqual(readFile(files[0]).indexOf('// w2 inlined via options'), -1);
    })
  );

  it('should add fallback chunks with inline option', () =>
    makeBundle('inline-fallbacks', {
      module: {
        rules: [
          {
            test: /(w1|w2)\.js$/,
            loader: '../index.js',
            options: {
              inline: true,
            },
          },
        ],
      },
    }).then((stats) => {
      const files = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/inline-fallbacks/${item}`);
      assert.equal(files.length, 2);
      const w1 = readFile(files[0]);
      const w2 = readFile(files[1]);
      if (w1.indexOf('// w1 via worker options') !== -1) {
        assert.notEqual(w2.indexOf('// w2 via worker options'), -1);
      }
      if (w1.indexOf('// w2 via worker options') !== -1) {
        assert.notEqual(w2.indexOf('// w1 via worker options'), -1);
      }
    })
  );

  it('should not add fallback chunks with inline and fallback === false', () =>
    makeBundle('no-fallbacks', {
      module: {
        rules: [
          {
            test: /(w1|w2)\.js$/,
            loader: '../index.js',
            options: {
              inline: true,
              fallback: false,
            },
          },
        ],
      },
    }).then((stats) => {
      // const workerFiles = stats.toJson('minimal').children
      //   .map(item => item.chunks)
      //   .reduce((acc, item) => acc.concat(item), [])
      //   .map(item => item.files)
      //   .map(item => `expected/no-fallbacks/${item}`);
      const bundleFile = stats.toJson('minimal').chunks
        .map(item => item.files)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => `expected/no-fallbacks/${item}`)[0];
      assert(bundleFile);
      assert.equal(fs.readdirSync('expected/no-fallbacks').length, 1);
      // assert.equal(workerFiles.length, 0);
      assert.notEqual(readFile(bundleFile).indexOf('// w1 inlined without fallback'), -1);
      assert.notEqual(readFile(bundleFile).indexOf('// w2 inlined without fallback'), -1);
    })
  );
});
