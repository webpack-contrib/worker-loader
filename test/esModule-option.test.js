import {
  compile,
  getCompiler,
  getErrors,
  getModuleSource,
  getResultFromBrowser,
  getWarnings,
} from "./helpers";

describe('"esModule" option', () => {
  it("should work and generate ES module syntax by default", async () => {
    const compiler = getCompiler("./basic/entry.js");
    const stats = await compile(compiler);
    // const result = await getResultFromBrowser(stats);

    expect(getModuleSource("./basic/worker.js", stats)).toMatchSnapshot(
      "module"
    );
    // expect(result).toMatchSnapshot('result');
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work with "true" value', async () => {
    const compiler = getCompiler("./basic/entry.js", {
      esModule: true,
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

  it('should work with "false" value', async () => {
    const compiler = getCompiler("./basic/entry.js", {
      esModule: false,
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
});
