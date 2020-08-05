import path from 'path';

import webpack from 'webpack';
import { customAlphabet } from 'nanoid';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (fixture, loaderOptions = {}, config = {}) => {
  const nanoid = customAlphabet('1234567890abcdef', 10);

  const fullConfig = {
    mode: 'development',
    devtool: config.devtool || false,
    context: path.resolve(__dirname, '../fixtures'),
    entry: path.resolve(__dirname, '../fixtures', fixture),
    output: {
      path: path.resolve(__dirname, '../outputs', `test_${nanoid()}`),
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
    },
    module: {
      rules: [
        {
          test: /(worker|TypeDetection)\.js$/i,
          rules: [
            {
              loader: path.resolve(__dirname, '../../src'),
              options: { filename: 'test.worker.js', ...loaderOptions },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          '../fixtures',
          path.dirname(fixture),
          'index.html'
        ),
      }),
    ],
    ...config,
  };

  if (webpack.version[0] === '5') {
    if (!fullConfig.experiments) {
      fullConfig.experiments = {};
    }

    fullConfig.experiments.importAsync = true;
    fullConfig.experiments.importAwait = true;
    fullConfig.experiments.asyncWebAssembly = true;
  }

  return webpack(fullConfig);
};
