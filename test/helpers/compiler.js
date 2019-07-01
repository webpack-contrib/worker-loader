/* eslint-disable
  import/order,
  comma-dangle,
  arrow-parens,
  multiline-ternary,
  no-param-reassign
*/
import del from 'del';
import path from 'path';
import webpack from 'webpack';

export default function(name, config = {}) {
  return del(path.resolve(__dirname, `../__expected__/${name}`)).then(() => {
    config = {
      target: config.target || 'web',
      context: path.resolve(__dirname, '../fixtures'),
      entry: `./${name}/entry.js`,
      output: {
        path: path.resolve(__dirname, `../__expected__/${name}`),
        filename: 'bundle.js',
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

    const compiler = webpack(config);

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          reject(err);
        } else if (stats.hasWarnings()) {
          const warnings = stats.compilation.warnings.slice(0);
          stats.compilation.children.forEach((child) => {
            warnings.push(...child.warnings);
          });
          reject(warnings.join('\n'));
        } else if (stats.hasErrors()) {
          const errors = stats.compilation.errors.slice(0);
          stats.compilation.children.forEach((child) => {
            errors.push(...child.errors);
          });
          reject(errors.join('\n'));
        } else {
          resolve(stats);
        }
      });
    });
  });
}
