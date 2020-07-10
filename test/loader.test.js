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
});
