/* eslint-disable
  import/order,
  comma-dangle,
  arrow-parens,
  linebreak-style,
  prefer-destructuring,
  no-underscore-dangle,
  array-bracket-spacing,
*/
import fs from 'fs';
import assert from 'assert';
import webpack from './helpers/compiler';

process.chdir(__dirname);

const readFile = (file) => fs.readFileSync(file, 'utf-8');

test('should create chunk with worker', () =>
  webpack('worker').then((stats) => {
    const files = stats
      .toJson()
      .children.map((item) => item.chunks)
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => item.files)
      .map((item) => `__expected__/worker/${item}`);

    assert.equal(files.length, 1);

    assert.notEqual(readFile(files[0]).indexOf('// worker test mark'), -1);
  }));

test('should create chunk with specified name in query', () =>
  webpack('name-query').then((stats) => {
    const files = stats
      .toJson()
      .children.map((item) => item.chunks)
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => item.files)
      .map((item) => `__expected__/name-query/${item}`);

    assert.equal(files[0], '__expected__/name-query/namedWorker.js');

    assert.notEqual(
      readFile(files[0]).indexOf('// named worker test mark'),
      -1
    );
  }));

test('should create named chunks with workers via options', () =>
  webpack('name-options', {
    loader: {
      test: /(w1|w2)\.js$/,
      options: {
        name: '[name].js',
      },
    },
  }).then((stats) => {
    const files = stats
      .toJson()
      .children.map((item) => item.chunks)
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => item.files)
      .map((item) => `__expected__/name-options/${item}`)
      .sort();

    assert.equal(files.length, 2);
    assert.equal(files[0], '__expected__/name-options/w1.js');
    assert.equal(files[1], '__expected__/name-options/w2.js');

    assert.notEqual(readFile(files[0]).indexOf('// w1 via worker options'), -1);
    assert.notEqual(readFile(files[1]).indexOf('// w2 via worker options'), -1);
  }));

test('should inline worker with inline option in query', () =>
  webpack('inline-query').then((stats) => {
    const files = stats
      .toJson()
      .chunks.map((item) => item.files)
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => `__expected__/inline-query/${item}`);

    assert.equal(files.length, 1);

    assert.notEqual(
      readFile(files[0]).indexOf('// inlined worker test mark'),
      -1
    );
  }));

test('should inline worker with inline in options', () =>
  webpack('inline-options', {
    loader: {
      test: /(w1|w2)\.js$/,
      options: {
        inline: true,
      },
    },
  }).then((stats) => {
    const files = stats
      .toJson()
      .chunks.map((item) => item.files)
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => `__expected__/inline-options/${item}`);

    assert.equal(files.length, 1);

    assert.notEqual(
      readFile(files[0]).indexOf('// w1 inlined via options'),
      -1
    );
    assert.notEqual(
      readFile(files[0]).indexOf('// w2 inlined via options'),
      -1
    );
  }));

test('should add fallback chunks with inline option', () =>
  webpack('inline-fallbacks', {
    loader: {
      test: /(w1|w2)\.js$/,
      options: {
        inline: true,
      },
    },
  }).then((stats) => {
    const files = stats
      .toJson()
      .children.map((item) => item.chunks)
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => item.files)
      .map((item) => `__expected__/inline-fallbacks/${item}`);

    assert.equal(files.length, 2);

    const w1 = readFile(files[0]);
    const w2 = readFile(files[1]);

    if (w1.indexOf('// w1 via worker options') !== -1) {
      assert.notEqual(w2.indexOf('// w2 via worker options'), -1);
    }

    if (w1.indexOf('// w2 via worker options') !== -1) {
      assert.notEqual(w2.indexOf('// w1 via worker options'), -1);
    }
  }));

test('should not add fallback chunks with inline and fallback === false', () =>
  webpack('no-fallbacks', {
    loader: {
      test: /(w1|w2)\.js$/,
      options: {
        inline: true,
        fallback: false,
      },
    },
  }).then((stats) => {
    const [file] = stats
      .toJson()
      .chunks.map((item) => item.files)
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => `__expected__/no-fallbacks/${item}`);

    assert(file);

    assert.equal(fs.readdirSync('__expected__/no-fallbacks').length, 1);

    assert.notEqual(
      readFile(file).indexOf('// w1 inlined without fallback'),
      -1
    );
    assert.notEqual(
      readFile(file).indexOf('// w2 inlined without fallback'),
      -1
    );
  }));

test('should use the publicPath option as the base URL if specified', () =>
  webpack('public-path-override', {
    loader: {
      options: {
        publicPath: '/some/proxy/',
      },
    },
  }).then((stats) => {
    const assets = stats.compilation.assets;

    const bundle = assets['bundle.js'];
    const worker = Object.keys(assets)[1];

    expect(bundle.source()).toContain(
      `new Worker("/some/proxy/" + "${worker}")`
    );
  }));

['web', 'webworker'].forEach((target) => {
  test(`should have missing dependencies (${target})`, () =>
    webpack('nodejs-core-modules', {
      target,
      loader: {
        options: {
          inline: true,
          fallback: false,
        },
      },
    }).then((stats) => {
      expect(stats.compilation.missingDependencies.length).not.toEqual(0);
    }));
});

[
  'node',
  'async-node',
  'node-webkit',
  'atom',
  'electron',
  'electron-main',
  'electron-renderer',
].forEach((target) => {
  test(`should not have missing dependencies (${target})`, () =>
    webpack('nodejs-core-modules', {
      target,
      loader: {
        options: {
          inline: true,
          fallback: false,
        },
      },
    }).then((stats) => {
      assert.equal(stats.compilation.missingDependencies.length, 0);
    }));
});
