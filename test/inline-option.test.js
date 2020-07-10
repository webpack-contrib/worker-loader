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
    const compiler = getCompiler('./basic/entry.js', { inline: false });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "true" value', async () => {
    const compiler = getCompiler('./basic/entry.js', { inline: true });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    // TODO need fix absolute path
    // expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
    //   'module'
    // );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should not work with "false" value', async () => {
    const compiler = getCompiler('./basic/entry.js', { inline: false });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
