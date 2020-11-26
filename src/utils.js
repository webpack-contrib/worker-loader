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
  let workerConstructor;
  let workerOptions;

  if (typeof options.worker === 'undefined') {
    workerConstructor = 'Worker';
  } else if (typeof options.worker === 'string') {
    workerConstructor = options.worker;
  } else {
    ({ type: workerConstructor, options: workerOptions } = options.worker);
  }

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;
  const fnName = `${camelCase(workerFilename)}Worker`;

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

    return `
${
  esModule
    ? `import worker from ${InlineWorkerPath};`
    : `var worker = require(${InlineWorkerPath});`
}

${
  esModule ? 'export default' : 'module.exports ='
} function ${fnName}() {\n  return worker(${JSON.stringify(
      workerSource
    )}, ${JSON.stringify(workerConstructor)}, ${JSON.stringify(
      workerOptions
    )}, ${fallbackWorkerPath});\n}\n`;
  }

  return `${
    esModule ? 'export default' : 'module.exports ='
  } function ${fnName}() {\n  return new ${workerConstructor}(__webpack_public_path__ + ${JSON.stringify(
    workerFilename
  )}${workerOptions ? `, ${JSON.stringify(workerOptions)}` : ''});\n}\n`;
}

// Matches only the last occurrence of sourceMappingURL
const innerRegex = /\s*[#@]\s*sourceMappingURL\s*=\s*(.*?(?=[\s'"]|\\n|\*\/|$)(?:\\n)?)\s*/;

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

const sourceURLWebpackRegex = RegExp(
  '\\/\\/#\\ssourceURL=webpack-internal:\\/\\/\\/(.*?)\\\\n'
);
/* eslint-enable prefer-template */

/*
 * Based on sindresorhus/camelcase v6.2.0
 * License: https://github.com/sindresorhus/camelcase/blob/v6.2.0/license
 */
function camelCase(input1) {
  let input = input1;
  input = input.trim();

  if (input.length === 0) {
    return '';
  }

  if (input.length === 1) {
    return input.toLocaleLowerCase();
  }

  const hasUpperCase = input !== input.toLocaleLowerCase();

  if (hasUpperCase) {
    let isLastCharLower = false;
    let isLastCharUpper = false;
    let isLastLastCharUpper = false;

    for (let i = 0; i < input.length; i++) {
      const character = input[i];

      if (isLastCharLower && /[\p{Lu}]/u.test(character)) {
        input = `${input.slice(0, i)}-${input.slice(i)}`;
        isLastCharLower = false;
        isLastLastCharUpper = isLastCharUpper;
        isLastCharUpper = true;
        i += 1;
      } else if (
        isLastCharUpper &&
        isLastLastCharUpper &&
        /[\p{Ll}]/u.test(character)
      ) {
        input = `${input.slice(0, i - 1)}-${input.slice(i - 1)}`;
        isLastLastCharUpper = isLastCharUpper;
        isLastCharUpper = false;
        isLastCharLower = true;
      } else {
        isLastCharLower =
          character.toLocaleLowerCase() === character &&
          character.toLocaleUpperCase() !== character;
        isLastLastCharUpper = isLastCharUpper;
        isLastCharUpper =
          character.toLocaleUpperCase() === character &&
          character.toLocaleLowerCase() !== character;
      }
    }
  }

  input = input.replace(/^[_.\- ]+/, '');

  input = input.toLocaleLowerCase();

  return (
    input
      .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) =>
        p1.toLocaleUpperCase()
      )
      .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, (m) => m.toLocaleUpperCase())
      // NOTE: addition to replace `/` or `\` with ``.
      .replace(/(\/|\\)/g, '')
  );
}

export {
  getDefaultFilename,
  getDefaultChunkFilename,
  getExternalsType,
  workerGenerator,
  sourceMappingURLRegex,
  sourceURLWebpackRegex,
};
