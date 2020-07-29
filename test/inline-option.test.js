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

  it('should not work with "no-fallback" value', async () => {
    const compiler = getCompiler('./basic/entry.js', { inline: 'no-fallback' });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('inline.js') > 0).toBe(true);
    expect(moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeUndefined();
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
    expect(moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') > 0).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
