import path from "path";

import { customAlphabet } from "nanoid";

import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from "./helpers";

describe('"publicPath" option', () => {
  it('should work and use "__webpack_public_path__" by default', async () => {
    const compiler = getCompiler("./chunks/entry.js");
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and respect the "publicPath" option ("string")', async () => {
    const compiler = getCompiler("./chunks/entry.js", {
      publicPath: "/public-path-static/",
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and respect the "publicPath" option ("function")', async () => {
    const compiler = getCompiler("./chunks/entry.js", {
      publicPath: () => `/public-path-static/`,
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and respect the "output.publicPath" option default value', async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const compiler = getCompiler(
      "./chunks/entry.js",
      {},
      {
        output: {
          path: path.resolve(__dirname, "./outputs", `test_${nanoid()}`),
          filename: "[name].bundle.js",
          chunkFilename: "[name].chunk.js",
          publicPath: "",
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and respect the "output.publicPath" option value ("string")', async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const compiler = getCompiler(
      "./chunks/entry.js",
      {},
      {
        output: {
          publicPath: "/public-path-static/",
          path: path.resolve(__dirname, "./outputs", `test_${nanoid()}`),
          filename: "[name].bundle.js",
          chunkFilename: "[name].chunk.js",
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and respect the "output.publicPath" option value ("function")', async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const compiler = getCompiler(
      "./chunks/entry.js",
      {},
      {
        output: {
          publicPath: () => "/public-path-static/",
          path: path.resolve(__dirname, "./outputs", `test_${nanoid()}`),
          filename: "[name].bundle.js",
          chunkFilename: "[name].chunk.js",
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and respect "filename" and "chunkFilename" option values', async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const compiler = getCompiler(
      "./chunks/entry.js",
      {},
      {
        module: {
          rules: [
            {
              test: /worker\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, "./../src"),
                },
              ],
            },
          ],
        },
        output: {
          publicPath: "/public-path-static-other/",
          path: path.resolve(__dirname, "./outputs", `test_${nanoid()}`),
          filename: "other-static/js/[name].bundle.js",
          chunkFilename: "other-static/js/[name].chunk.js",
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and respect "filename" and "chunkFilename" option values', async () => {
    const compiler = getCompiler("./chunks/entry.js", {
      publicPath: "/public-path-static-other/",
      filename: "other-static/js/[name].worker.js",
      chunkFilename: "other-static/js/[name].chunk.worker.js",
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
