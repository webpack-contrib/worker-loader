function getDefaultFilename(filename) {
  if (typeof filename === 'function') {
    return filename;
  }

  return filename.replace(/\.([a-z]+)(\?.+)?$/i, '.worker.$1$2');
}

function getDefaultChunkFilename(chunkFilename) {
  return chunkFilename.replace(/\.([a-z]+)(\?.+)?$/i, '.worker.$1$2');
}

function getExternalsType(compilerOptions) {
  // For webpack@4
  if (compilerOptions.output.libraryTarget) {
    return compilerOptions.output.libraryTarget;
  }

  // For webpack@5
  if (compilerOptions.externalsType) {
    return compilerOptions.externalsType;
  }

  if (compilerOptions.output.library) {
    return compilerOptions.output.library.type;
  }

  if (compilerOptions.output.module) {
    return 'module';
  }

  return 'var';
}

function getWorker(file, content, options) {
  const publicWorkerPath = `__webpack_public_path__ + ${JSON.stringify(file)}`;

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

export {
  getDefaultFilename,
  getDefaultChunkFilename,
  getExternalsType,
  getWorker,
};
