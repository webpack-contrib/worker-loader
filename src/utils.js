import { stringifyRequest } from 'loader-utils';

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

function workerGenerator(loaderContext, workerFilename, workerSource, options) {
  let workerCode;
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
    const InlineWorkerPath = stringifyRequest(
      loaderContext,
      `!!${require.resolve('./runtime/inline.js')}`
    );

    let fallbackWorkerPath;

    if (options.inline === 'fallback') {
      fallbackWorkerPath = `__webpack_public_path__ + ${JSON.stringify(
        workerFilename
      )}`;
    }

    workerCode = `require(${InlineWorkerPath})(${JSON.stringify(
      workerSource
    )}, ${JSON.stringify(workerConstructor)}, ${JSON.stringify(
      workerOptions
    )}, ${fallbackWorkerPath})`;
  } else {
    workerCode = `new ${workerConstructor}(__webpack_public_path__ + ${JSON.stringify(
      workerFilename
    )}${workerOptions ? `, ${JSON.stringify(workerOptions)}` : ''})`;
  }

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  return `${
    esModule ? 'export default' : 'module.exports ='
  } function() {\n  return ${workerCode};\n};\n`;
}

// Matches only the last occurrence of sourceMappingURL
const innerRegex = /\s*[#@]\s*sourceMappingURL\s*=\s*([^\s'"]*)\s*/;

/* eslint-disable prefer-template */
const sourceMappingURLRegex = RegExp(
  '(?:' +
    '/\\*' +
    '(?:\\s*\r?\n(?://)?)?' +
    '(?:' +
    innerRegex.source +
    ')' +
    '\\s*' +
    '\\*/' +
    '|' +
    '//(?:' +
    innerRegex.source +
    ')' +
    ')' +
    '\\s*'
);
/* eslint-enable prefer-template */

export {
  getDefaultFilename,
  getDefaultChunkFilename,
  getExternalsType,
  workerGenerator,
  sourceMappingURLRegex,
};
