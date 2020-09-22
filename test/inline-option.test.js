import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('"inline" option', () => {
  it('should not work by default', async () => {
    const compiler = getCompiler('./basic/entry.js');
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "no-fallback" value', async () => {
    const compiler = getCompiler('./basic/entry.js', { inline: 'no-fallback' });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "no-fallback" value and the "devtool" option ("source-map" value)', async () => {
    const compiler = getCompiler(
      './basic/entry.js',
      { inline: 'no-fallback' },
      { devtool: 'source-map' }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(
      moduleSource.indexOf('sourceMappingURL=test.worker.js.map"') === -1
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeUndefined();
    expect(stats.compilation.assets['test.worker.js.map']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "no-fallback" value and the "devtool" option ("eval-source-map" value)', async () => {
    const compiler = getCompiler(
      './basic/entry.js',
      { inline: 'no-fallback' },
      { devtool: 'eval-source-map' }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);
    const sourceUrlInternalIndex = moduleSource.indexOf(
      'sourceURL=webpack-internal:///./basic/worker.js'
    );

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(
      moduleSource.indexOf(
        'sourceMappingURL=data:application/json;charset=utf-8;base64,'
      ) === -1
    ).toBe(true);
    expect(sourceUrlInternalIndex === -1).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeUndefined();
    expect(stats.compilation.assets['test.worker.js.map']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "no-fallback" value and the "devtool" option ("source-map" value)', async () => {
    const compiler = getCompiler(
      './basic/entry.js',
      { inline: 'no-fallback' },
      { devtool: false }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeUndefined();
    expect(stats.compilation.assets['test.worker.js.map']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "fallback" value', async () => {
    const compiler = getCompiler('./basic/entry.js', { inline: 'fallback' });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "fallback" value and the "devtool" option ("source-map" value)', async () => {
    const compiler = getCompiler(
      './basic/entry.js',
      { inline: 'fallback' },
      { devtool: 'source-map' }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(stats.compilation.assets['test.worker.js.map']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "fallback" value and the "devtool" option ("source-map" value)', async () => {
    const compiler = getCompiler(
      './basic/entry.js',
      { inline: 'fallback' },
      { devtool: false }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(stats.compilation.assets['test.worker.js.map']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "no-fallback" value and "esModule" with "false" value', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: 'no-fallback',
      esModule: false,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "no-fallback" value and "esModule" with "true" value', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: 'no-fallback',
      esModule: true,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeUndefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "fallback" value and "esModule" with "false" value', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: 'fallback',
      esModule: false,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "fallback" value and "esModule" with "true" value', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: 'fallback',
      esModule: true,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
