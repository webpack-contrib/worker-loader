/* eslint-disable multiline-ternary */
import path from 'path';

const getWorkerPath = (file, options) => {
  const publicPath = options.publicPath
    ? JSON.stringify(options.publicPath)
    : '__webpack_public_path__';

  return `${publicPath} + ${JSON.stringify(file)}`;
};

const getWorker = (file, content, options) => {
  const publicWorkerPath = getWorkerPath(file, options);

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(
      `!!${path.join(__dirname, 'InlineWorker.js')}`
    );

    const fallbackWorkerPath =
      options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${JSON.stringify(
      content
    )}, ${fallbackWorkerPath})`;
  }

  return `new Worker(${publicWorkerPath})`;
};

const getWorkerFactory = (file, content, options) => {
  const worker = getWorker(file, content, options);
  const workerPath = getWorkerPath(file, options);
  return `module.exports = function () {\n  return ${worker};\n};\nmodule.exports.url = '${workerPath}';`;
};

export default getWorkerFactory;
