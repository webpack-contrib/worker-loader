import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('"name" option', () => {
  it('should work', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      name: 'my-custom-name.js',
    });
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
