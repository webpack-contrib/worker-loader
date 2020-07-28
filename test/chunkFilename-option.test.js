import path from 'path';

import { customAlphabet } from 'nanoid';

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
    const compiler = getCompiler('./chunks/entry.js', {
      chunkFilename: 'test.worker.chunk.js',
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./chunks/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work and respect the "output.chunkFilename" default value option', async () => {
    const nanoid = customAlphabet('1234567890abcdef', 10);
    const compiler = getCompiler(
      './chunks/entry.js',
      {},
      {
        output: {
          path: path.resolve(__dirname, './outputs', `test_${nanoid()}`),
          filename: '[name].js',
        },
        module: {
          rules: [
            {
              test: /worker\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, '../src'),
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./chunks/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work and respect the "output.chunkFilename" option value', async () => {
    const nanoid = customAlphabet('1234567890abcdef', 10);
    const compiler = getCompiler(
      './chunks/entry.js',
      {},
      {
        output: {
          path: path.resolve(__dirname, './outputs', `test_${nanoid()}`),
          filename: '[name].js',
          chunkFilename: '[name].chunk.js',
        },
        module: {
          rules: [
            {
              test: /worker\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, '../src'),
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource('./chunks/worker.js', stats)).toMatchSnapshot(
      'module'
    );
    expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
