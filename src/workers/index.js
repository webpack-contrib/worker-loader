/* eslint-disable multiline-ternary */

const getWorker = (file, content, options) => {
  const publicPath = options.publicPath
    ? JSON.stringify(options.publicPath)
    : '__webpack_public_path__';

  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  return `new SharedWorker(${publicWorkerPath}, ${options.name})`;
};

export default getWorker;
