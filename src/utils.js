import { stringifyRequest } from "loader-utils";

function getDefaultFilename(filename) {
  if (typeof filename === "function") {
    return filename;
  }

  return filename.replace(/\.([a-z]+)(\?.+)?$/i, ".worker.$1$2");
}

function getDefaultChunkFilename(chunkFilename) {
  return chunkFilename.replace(/\.([a-z]+)(\?.+)?$/i, ".worker.$1$2");
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
    return "module";
  }

  return "var";
}

function workerGenerator(loaderContext, workerFilename, workerSource, options) {
  let workerConstructor;
  let workerOptions;

  if (typeof options.worker === "undefined") {
    workerConstructor = "Worker";
  } else if (typeof options.worker === "string") {
    workerConstructor = options.worker;
  } else {
    ({ type: workerConstructor, options: workerOptions } = options.worker);
  }

  const esModule =
    typeof options.esModule !== "undefined" ? options.esModule : true;
  const fnName = `${workerConstructor}_fn`;

  const publicPath = options.publicPath ? JSON.stringify(options.publicPath) : '__webpack_public_path__';

  if (options.inline) {
    const InlineWorkerPath = stringifyRequest(
      loaderContext,
      `!!${require.resolve("./runtime/inline.js")}`
    );

    let fallbackWorkerPath;

    if (options.inline === "fallback") {
      fallbackWorkerPath = `${publicPath} + ${JSON.stringify(
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
  esModule ? "export default" : "module.exports ="
} function ${fnName}() {\n  return worker(${JSON.stringify(
      workerSource
    )}, ${JSON.stringify(workerConstructor)}, ${JSON.stringify(
      workerOptions
    )}, ${fallbackWorkerPath});\n}\n`;
  }

  return `${loaderContext.target === 'node'
    ? esModule
      ? "import {Worker} from 'worker_threads'\n"
      : "var {Worker} = require('worker_threads')\n"
    : ''}${
    esModule ? "export default" : "module.exports ="
  } function ${fnName}() {\n  return new ${workerConstructor}(${publicPath} + ${JSON.stringify(
    workerFilename
  )}${workerOptions ? `, ${JSON.stringify(workerOptions)}` : ""});\n}\n`;
}

// Matches only the last occurrence of sourceMappingURL
const innerRegex =
  /\s*[#@]\s*sourceMappingURL\s*=\s*(.*?(?=[\s'"]|\\n|\*\/|$)(?:\\n)?)\s*/;

/* eslint-disable prefer-template */
const sourceMappingURLRegex = RegExp(
  "(?:" +
    "/\\*" +
    "(?:\\s*\r?\n(?://)?)?" +
    "(?:" +
    innerRegex.source +
    ")" +
    "\\s*" +
    "\\*/" +
    "|" +
    "//(?:" +
    innerRegex.source +
    ")" +
    ")" +
    "\\s*"
);

const sourceURLWebpackRegex = RegExp(
  "\\/\\/#\\ssourceURL=webpack-internal:\\/\\/\\/(.*?)\\\\n"
);
/* eslint-enable prefer-template */

export {
  getDefaultFilename,
  getDefaultChunkFilename,
  getExternalsType,
  workerGenerator,
  sourceMappingURLRegex,
  sourceURLWebpackRegex,
};
