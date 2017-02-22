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
  it('should create chunk with worker via query', () =>
    makeBundle('worker-query').then((stats) => {
      const workerFile = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/worker-query/${item}`)[0];
      assert(workerFile);
      assert.notEqual(readFile(workerFile).indexOf('// worker test mark'), -1);
    })
  );

  it('should create chunk with specified name in query', () =>
    makeBundle('name-query').then((stats) => {
      const workerFile = 'expected/name-query/namedWorker.js';
      const receivedWorkerFile = stats.toJson('minimal').children
        .map(item => item.chunks)
        .reduce((acc, item) => acc.concat(item), [])
        .map(item => item.files)
        .map(item => `expected/name-query/${item}`)[0];
      assert.equal(receivedWorkerFile, workerFile);
      assert.notEqual(readFile(workerFile).indexOf('// named worker test mark'), -1);
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
