import { sourceMappingURLRegex } from "../src/utils";

describe("source-map-loader", () => {
  const cases = [
    "/*#sourceMappingURL=absolute-sourceRoot-source-map.map*/",
    "/*  #sourceMappingURL=absolute-sourceRoot-source-map.map  */",
    "//#sourceMappingURL=absolute-sourceRoot-source-map.map",
    "//@sourceMappingURL=absolute-sourceRoot-source-map.map",
    " //  #sourceMappingURL=absolute-sourceRoot-source-map.map",
    " //  #  sourceMappingURL  =   absolute-sourceRoot-source-map.map  ",
    "// #sourceMappingURL = http://sampledomain.com/external-source-map2.map",
    "// #sourceMappingURL = //sampledomain.com/external-source-map2.map",
    "// @sourceMappingURL=data:application/source-map;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lLXNvdXJjZS1tYXAuanMiLCJzb3VyY2VzIjpbImlubGluZS1zb3VyY2UtbWFwLnR4dCJdLCJzb3VyY2VzQ29udGVudCI6WyJ3aXRoIFNvdXJjZU1hcCJdLCJtYXBwaW5ncyI6IkFBQUEifQ==",
    `
    with SourceMap

    // #sourceMappingURL = /sample-source-map.map
    // comment
    `,
    "onmessage = function(event) {\n  const workerResult = event.data;\n\n  workerResult.onmessage = true;\n\n  postMessage(workerResult);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9iYXNpYy93b3JrZXIuanM/OGFiZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EiLCJmaWxlIjoiLi9iYXNpYy93b3JrZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJvbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICBjb25zdCB3b3JrZXJSZXN1bHQgPSBldmVudC5kYXRhO1xuXG4gIHdvcmtlclJlc3VsdC5vbm1lc3NhZ2UgPSB0cnVlO1xuXG4gIHBvc3RNZXNzYWdlKHdvcmtlclJlc3VsdCk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./basic/worker.js\n",
  ];

  cases.forEach((item) => {
    it(`should work with "${item}" url`, async () => {
      const result = item.replace(sourceMappingURLRegex, "REPLASED");

      expect(result.indexOf("REPLASED") !== -1).toBe(true);
      expect(result).toMatchSnapshot("result");
    });
  });
});
