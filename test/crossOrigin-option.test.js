import getPort from 'get-port';

import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from './helpers';

describe('"crossOrigin" option', () => {
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

  it('should work with crossOrigin enabled', async () => {
    const port = await getPort();
    const compiler = getCompiler('./basic/entry.js', {
      crossOrigin: `http://localhost:${port}/public-path-static/`,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats, port);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('crossOrigin.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(
      moduleSource.indexOf(
        `"http://localhost:${port}/public-path-static/" + "test.worker.js"`
      ) > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with crossOrigin enabled and "esModule" with "false" value', async () => {
    const port = await getPort();
    const compiler = getCompiler('./basic/entry.js', {
      crossOrigin: `http://localhost:${port}/public-path-static/`,
      esModule: false,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats, port);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('crossOrigin.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(
      moduleSource.indexOf(
        `"http://localhost:${port}/public-path-static/" + "test.worker.js"`
      ) > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with crossOrigin enabled and "esModule" with "true" value', async () => {
    const port = await getPort();
    const compiler = getCompiler('./basic/entry.js', {
      crossOrigin: `http://localhost:${port}/public-path-static/`,
      esModule: true,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats, port);
    const moduleSource = getModuleSource('./basic/worker.js', stats);

    expect(moduleSource.indexOf('crossOrigin.js') > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(
      moduleSource.indexOf(
        `"http://localhost:${port}/public-path-static/" + "test.worker.js"`
      ) > 0
    ).toBe(true);
    expect(stats.compilation.assets['test.worker.js']).toBeDefined();
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
