function getWorker(file, content, options) {
  const publicPath =
    typeof options.publicPath === 'undefined'
      ? '__webpack_public_path__'
      : JSON.stringify(options.publicPath);
  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  let workerConstructor;
  let workerOptions;

  if (typeof options.worker === 'undefined') {
    workerConstructor = 'Worker';
  } else if (typeof options.worker === 'string') {
    workerConstructor = options.worker;
  } else {
    ({ type: workerConstructor, options: workerOptions } = options.worker);
  }

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(
      `!!${require.resolve('./runtime/inline.js')}`
    );

    const fallbackWorkerPath =
      options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${JSON.stringify(
      content
    )}, ${fallbackWorkerPath}, ${JSON.stringify(
      workerConstructor
    )}, ${JSON.stringify(workerOptions)})`;
  }

  return `new ${workerConstructor}(${publicWorkerPath}${
    workerOptions ? `, ${JSON.stringify(workerOptions)}` : ''
  })`;
}

// eslint-disable-next-line import/prefer-default-export
export { getWorker };
