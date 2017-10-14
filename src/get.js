/* eslint-disable multiline-ternary */
import path from 'path';

const getWorker = (file, content, options) => {
  const publicWorkerPath = `__webpack_public_path__ + ${JSON.stringify(file)}`;

  if (options.mode) {
    if (options.mode === 'shared') {
      return `new SharedWorker(${publicWorkerPath}, options)`;
    }

    if (options.mode === 'service') {
      return `('serviceWorker' in navigator)
  ? navigator.serviceWorker.register(${publicWorkerPath}, options)
  : Promise.reject(
    new Error('navigator.serviceWorker is not supported in this browser')
  )
`;
    }
  }

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(`!!${
      path.join(__dirname, 'workers', 'InlineWorker.js')
    }`);

    const fallbackWorkerPath = options.fallback === false
      ? 'null'
      : publicWorkerPath;

    return `require(${InlineWorkerPath})(${JSON.stringify(content)}, ${fallbackWorkerPath})`;
  }

  return `new Worker(${publicWorkerPath})`;
};

export default getWorker;
