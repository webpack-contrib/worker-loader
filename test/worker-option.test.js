import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('"workerType" option', () => {
  it('should use "Worker" by default', async () => {
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

  it('should support the "Worker" string value', async () => {
    const compiler = getCompiler('./basic/entry.js', { worker: 'Worker' });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should support the "Worker" object value', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      worker: {
        type: 'Worker',
        options: {
          type: 'classic',
          name: 'worker-name',
        },
      },
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

  it('should support the "Worker" object value for inline workers', async () => {
    const compiler = getCompiler('./basic/entry.js', {
      inline: true,
      worker: {
        type: 'Worker',
        options: {
          type: 'classic',
          name: 'worker-name',
        },
      },
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    // TODO fix
    // expect(getModuleSource('./basic/worker.js', stats)).toMatchSnapshot(
    //   'module'
    // );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
