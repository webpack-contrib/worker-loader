import path from 'path';

import del from 'del';
import webpack from 'webpack';

export default function compiler(name, config = {}) {
  return del(path.resolve(__dirname, `../__expected__/${name}`)).then(() => {
    // eslint-disable-next-line no-param-reassign
    config = {
      target: config.target || 'web',
      context: path.resolve(__dirname, '../fixtures'),
      entry: `./${name}/entry.js`,
      output: {
        path: path.resolve(__dirname, `../__expected__/${name}`),
        filename: 'bundle.js',
      },
      optimization: {
        // To keep filename consistent
        chunkIds: 'natural',
      },
      module: {
        rules: [
          {
            test: config.loader ? config.loader.test : /worker\.js$/,
            use: {
              loader: '../../src',
              options: config.loader ? config.loader.options : {},
            },
          },
        ],
      },
    };

    // eslint-disable-next-line no-shadow
    const compiler = webpack(config);

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) reject(err);

        resolve(stats);
      });
    });
  });
}
