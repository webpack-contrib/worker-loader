import path from 'path';

import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (fixture, loaderOptions = {}, config = {}) => {
  const fullConfig = {
    mode: 'development',
    devtool: config.devtool || false,
    context: path.resolve(__dirname, '../fixtures'),
    entry: path.resolve(__dirname, '../fixtures', fixture),
    output: {
      path: path.resolve(__dirname, '../outputs', path.dirname(fixture)),
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
    },
    module: {
      rules: [
        {
          test: /worker\.js$/i,
          rules: [
            {
              loader: path.resolve(__dirname, '../../src'),
              options: { name: 'test.worker.js', ...loaderOptions },
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

  return webpack(fullConfig);
};
