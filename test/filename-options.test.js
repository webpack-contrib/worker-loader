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

describe('"filename" option', () => {
  it('should work ("string")', async () => {
    const compiler = getCompiler('./chunks/entry.js', {
      filename: '[name].custom.worker.js',
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

  it('should work ("function")', async () => {
    const compiler = getCompiler('./chunks/entry.js', {
      filename: () => '[name].custom.worker.js',
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

  it('should work and respect the "output.filename" default value option', async () => {
    const nanoid = customAlphabet('1234567890abcdef', 10);
    const compiler = getCompiler(
      './chunks/entry.js',
      {},
      {
        output: {
          path: path.resolve(__dirname, './outputs', `test_${nanoid()}`),
          chunkFilename: '[name].chunk.js',
          publicPath: '',
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

  it('should work and respect the "output.filename" option ("string")', async () => {
    const nanoid = customAlphabet('1234567890abcdef', 10);
    const compiler = getCompiler(
      './chunks/entry.js',
      {},
      {
        output: {
          path: path.resolve(__dirname, './outputs', `test_${nanoid()}`),
          filename: '[name].custom.js',
          chunkFilename: '[name].chunk.js',
          publicPath: '',
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

  it('should work and respect the "output.filename" option ("function")', async () => {
    const nanoid = customAlphabet('1234567890abcdef', 10);
    const compiler = getCompiler(
      './chunks/entry.js',
      {},
      {
        output: {
          path: path.resolve(__dirname, './outputs', `test_${nanoid()}`),
          filename: (pathData) => {
            if (/worker\.js$/.test(pathData.chunk.entryModule.resource)) {
              return '[name].custom.worker.js';
            }

            return '[name].js';
          },
          publicPath: '',
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
