import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('"publicPath" option', () => {
  it('should use "__webpack_public_path__" by default', async () => {
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
});
