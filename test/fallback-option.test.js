import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('"fallback" option', () => {
  it('should work by default', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: true,
      fallback: true,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    // expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
    //   'module'
    // );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should should work with "true" value', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: true,
      fallback: true,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    // expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
    //   'module'
    // );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should should work with "false" value', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: true,
      fallback: false,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    // expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
    //   'module'
    // );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "true" value and the "publicPath" options', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: true,
      fallback: true,
      publicPath: '/js/',
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    // // TODO need fix absolute path
    // expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
    //   'module'
    // );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "false" value and the "publicPath" options', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: true,
      fallback: false,
      publicPath: '/js/',
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    // // TODO need fix absolute path
    // expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
    //   'module'
    // );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
