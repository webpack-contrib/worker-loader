import path from 'path';

const getWorker = (file, content, options) => {
  const publicPath = options.publicPath
    ? JSON.stringify(options.publicPath)
    : '__webpack_public_path__';

  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(
      `!!${path.join(__dirname, 'InlineWorker.js')}`
    );

    const fallbackWorkerPath =
      options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${JSON.stringify(
      content
    )}, ${fallbackWorkerPath}, ${options.workerType})`;
  }

  let worker = 'Worker';
  switch (options.workerType) {
    case 'SharedWorker':
      worker = 'SharedWorker';
      break;
    case 'ServiceWorker':
      worker = 'ServiceWorker';
      break;
    default:
      worker = 'Worker';
  }

  return `new ${worker}(${publicWorkerPath})`;
};

export default getWorker;
