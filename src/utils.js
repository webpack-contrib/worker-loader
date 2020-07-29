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

    let fallbackWorkerPath;

    if (options.inline === 'fallback') {
      fallbackWorkerPath = `__webpack_public_path__ + ${JSON.stringify(file)}`;
    }

    return `require(${InlineWorkerPath})(${JSON.stringify(
      content
    )}, ${JSON.stringify(workerConstructor)}, ${JSON.stringify(
      workerOptions
    )}, ${fallbackWorkerPath})`;
  }

  return `new ${workerConstructor}(__webpack_public_path__ + ${JSON.stringify(
    file
  )}${workerOptions ? `, ${JSON.stringify(workerOptions)}` : ''})`;
}

export {
  getDefaultFilename,
  getDefaultChunkFilename,
  getExternalsType,
  getWorker,
};
