import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('worker-loader', () => {
  it('should work', async () => {
    const compiler = getCompiler('./basic/entry.js');
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with inline syntax', async () => {
    const compiler = getCompiler('./query/entry.js');
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./query/my-worker-name.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with WASM', async () => {
    const compiler = getCompiler('./wasm/entry.js');
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./wasm/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with async chunks', async () => {
    const compiler = getCompiler('./chunks/entry.js');
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./chunks/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "externals"', async () => {
    const compiler = getCompiler(
      './external/entry.js',
      {},
      {
        externals: {
          'my-custom-module': 'navigator',
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./external/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  // TODO broken on webpack@5
  // it.skip('should work and respect the "devtool" option ("source-map" value)', async () => {
  //   const compiler = getCompiler(
  //     './basic/entry.js',
  //     {},
  //     { devtool: 'source-map' }
  //   );
  //   const stats = await compile(compiler);
  //   const result = await getResultFromBrowser(stats);
  //
  //   expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
  //     'module'
  //   );
  //   expect(stats.compilation.assets['test.worker.js.map']).toBeDefined();
  //   expect(result).toMatchSnapshot('result');
  //   expect(getWarnings(stats)).toMatchSnapshot('warnings');
  //   expect(getErrors(stats)).toMatchSnapshot('errors');
  // });

  it('should work and respect the "devtool" option ("false" value)', async () => {
    const compiler = getCompiler('./basic/entry.js', {}, { devtool: false });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(stats.compilation.assets['test.worker.js.map']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
