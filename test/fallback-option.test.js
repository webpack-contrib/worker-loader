import path from 'path';

import del from 'del';

import {
  compile,
  getCompiler,
  getErrors,
  // getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('"fallback" option', () => {
  beforeAll(() => del(path.resolve(__dirname, `outputs`)));

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
});
