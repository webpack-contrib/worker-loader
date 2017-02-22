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
      } else {
        resolve(stats);
      }
    });
  });
});

describe('worker-loader', () => {
  it('should create chunk with worker', () =>
    makeBundle('worker').then((stats) => {
      const workerFile = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/worker/${item}`)[0];
      assert(workerFile);
      assert.notEqual(readFile(workerFile).indexOf('// worker test mark'), -1);
    })
  );

  it('should create chunk with specified name in query', () =>
    makeBundle('name-query').then((stats) => {
      const file = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/name-query/${item}`)[0];
      assert.equal(file, 'expected/name-query/namedWorker.js');
      assert.notEqual(readFile(file).indexOf('// named worker test mark'), -1);
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
        .map(item => `expected/name-options/${item}`);
      assert.deepEqual(files, [
        'expected/name-options/w1.js',
        'expected/name-options/w2.js',
      ]);
      assert.notEqual(readFile(files[0]).indexOf('// w1 via worker options'), -1);
      assert.notEqual(readFile(files[1]).indexOf('// w2 via worker options'), -1);
    })
  );

  it('should inline worker with inline option in query', () =>
    makeBundle('inline-query').then((stats) => {
      const bundleFile = stats.toJson('minimal').chunks
        .map(item => item.files)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => `expected/inline-query/${item}`)[0];
      assert(bundleFile);
      assert.notEqual(readFile(bundleFile).indexOf('// inlined worker test mark'), -1);
    })
  );
});
