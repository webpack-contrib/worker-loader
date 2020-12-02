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

describe('"name" option', () => {
  it('should work ("string")', async () => {
    const compiler = getCompiler("./chunks/entry.js", {
      chunkFilename: "test.worker.chunk.js",
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

  it('should work and respect the "output.chunkFilename" default value option', async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const compiler = getCompiler(
      "./chunks/entry.js",
      {},
      {
        output: {
          path: path.resolve(__dirname, "./outputs", `test_${nanoid()}`),
          filename: "[name].js",
          publicPath: "",
        },
        module: {
          rules: [
            {
              test: /worker\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, "../src"),
                },
              ],
            },
          ],
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

  it('should work and respect the "output.chunkFilename" option ("string")', async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const compiler = getCompiler(
      "./chunks/entry.js",
      {},
      {
        output: {
          path: path.resolve(__dirname, "./outputs", `test_${nanoid()}`),
          filename: "[name].js",
          chunkFilename: "[name].chunk.js",
          publicPath: "",
        },
        module: {
          rules: [
            {
              test: /worker\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, "../src"),
                },
              ],
            },
          ],
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

  it("should chunkFilename suffix be inserted before query parameters", async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const compiler = getCompiler(
      "./chunks/entry.js",
      {},
      {
        output: {
          path: path.resolve(__dirname, "./outputs", `test_${nanoid()}`),
          filename: "[name].js",
          chunkFilename: "[name].chunk.js?foo=bar&baz=bar",
          publicPath: "",
        },
        module: {
          rules: [
            {
              test: /worker\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, "../src"),
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    let hasChankName = false;

    Object.keys(stats.compilation.assets).forEach((asset) => {
      if (asset.endsWith("chunk.worker.js?foo=bar&baz=bar")) {
        hasChankName = true;
      }
    });

    expect(hasChankName).toBe(true);
    expect(result).toMatchSnapshot("result");
    expect(getModuleSource("./chunks/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
