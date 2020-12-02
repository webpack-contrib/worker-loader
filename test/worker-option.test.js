import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from "./helpers";

describe('"workerType" option', () => {
  it('should use "Worker" by default', async () => {
    const compiler = getCompiler("./basic/entry.js");
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./basic/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should support the "Worker" string value', async () => {
    const compiler = getCompiler("./basic/entry.js", { worker: "Worker" });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./basic/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should support the "Worker" object value', async () => {
    const compiler = getCompiler("./basic/entry.js", {
      worker: {
        type: "Worker",
        options: {
          type: "classic",
          name: "worker-name",
        },
      },
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./basic/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should support the "Worker" object value for inline workers with fallback', async () => {
    const compiler = getCompiler("./basic/entry.js", {
      inline: "fallback",
      worker: {
        type: "Worker",
        options: {
          type: "classic",
          name: "worker-name",
        },
      },
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    const moduleSource = getModuleSource("./basic/worker.js", stats);

    expect(moduleSource.indexOf("inline.js") > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') > 0
    ).toBe(true);
    expect(stats.compilation.assets["test.worker.js"]).toBeDefined();
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should support the "Worker" object value for inline workers without fallback', async () => {
    const compiler = getCompiler("./basic/entry.js", {
      inline: "no-fallback",
      worker: {
        type: "Worker",
        options: {
          type: "classic",
          name: "worker-name",
        },
      },
    });
    const stats = await compile(compiler);
    const result = await getResultFromBrowser(stats);

    const moduleSource = getModuleSource("./basic/worker.js", stats);

    expect(moduleSource.indexOf("inline.js") > 0).toBe(true);
    expect(
      moduleSource.indexOf('__webpack_public_path__ + "test.worker.js"') === -1
    ).toBe(true);
    expect(stats.compilation.assets["test.worker.js"]).toBeUndefined();
    expect(result).toMatchSnapshot("result");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
