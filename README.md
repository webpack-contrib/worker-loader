<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# worker-loader

worker loader module for webpack

## Getting Started

To begin, you'll need to install `worker-loader`:

```console
$ npm install worker-loader --save-dev
```

### Inlined

**App.js**

```js
import Worker from "worker-loader!./Worker.js";
```

### Config

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
    ],
  },
};
```

**App.js**

```js
import Worker from "./file.worker.js";

const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = function (event) {};

worker.addEventListener("message", function (event) {});
```

And run `webpack` via your preferred method.

## Options

|                 Name                  |            Type             |             Default             | Description                                                                       |
| :-----------------------------------: | :-------------------------: | :-----------------------------: | :-------------------------------------------------------------------------------- |
|        **[`worker`](#worker)**        |     `{String\|Object}`      |            `Worker`             | Allows to set web worker constructor name and options                             |
|    **[`publicPath`](#publicpath)**    |    `{String\|Function}`     |  based on `output.publicPath`   | specifies the public URL address of the output files when referenced in a browser |
|      **[`filename`](#filename)**      |    `{String\|Function}`     |   based on `output.filename`    | The filename of entry chunks for web workers                                      |
| **[`chunkFilename`](#chunkfilename)** |         `{String}`          | based on `output.chunkFilename` | The filename of non-entry chunks for web workers                                  |
|        **[`inline`](#inline)**        | `'no-fallback'\|'fallback'` |           `undefined`           | Allow to inline the worker as a `BLOB`                                            |
|      **[`esModule`](#esmodule)**      |         `{Boolean}`         |             `true`              | Use ES modules syntax                                                             |

### `worker`

Type: `String|Object`
Default: `Worker`

Set the worker type.

#### `String`

Allows to set web worker constructor name.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          worker: "SharedWorker",
        },
      },
    ],
  },
};
```

#### `Object`

Allow to set web worker constructor name and options.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          worker: {
            type: "SharedWorker",
            options: {
              type: "classic",
              credentials: "omit",
              name: "my-custom-worker-name",
            },
          },
        },
      },
    ],
  },
};
```

### `publicPath`

Type: `String|Function`
Default: based on `output.publicPath`

The `publicPath` specifies the public URL address of the output files when referenced in a browser.
If not specified, the same public path used for other webpack assets is used.

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          publicPath: "/scripts/workers/",
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          publicPath: (pathData, assetInfo) => {
            return `/scripts/${pathData.hash}/workers/`;
          },
        },
      },
    ],
  },
};
```

### `filename`

Type: `String|Function`
Default: based on `output.filename`, adding `worker` suffix, for example - `output.filename: '[name].js'` value of this option will be `[name].worker.js`

The filename of entry chunks for web workers.

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          filename: "[name].[contenthash].worker.js",
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          filename: (pathData) => {
            if (
              /\.worker\.(c|m)?js$/i.test(pathData.chunk.entryModule.resource)
            ) {
              return "[name].custom.worker.js";
            }

            return "[name].js";
          },
        },
      },
    ],
  },
};
```

### `chunkFilename`

Type: `String`
Default: based on `output.chunkFilename`, adding `worker` suffix, for example - `output.chunkFilename: '[id].js'` value of this option will be `[id].worker.js`

The filename of non-entry chunks for web workers.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          chunkFilename: "[id].[contenthash].worker.js",
        },
      },
    ],
  },
};
```

### `inline`

Type: `'fallback' | 'no-fallback'`
Default: `undefined`

Allow to inline the worker as a `BLOB`.

Inline mode with the `fallback` value will create file for browsers without support web workers, to disable this behavior just use `no-fallback` value.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          inline: "fallback",
        },
      },
    ],
  },
};
```

### `esModule`

Type: `Boolean`
Default: `true`

By default, `worker-loader` generates JS modules that use the ES modules syntax.

You can enable a CommonJS modules syntax using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
};
```

## Examples

### Basic

The worker file can import dependencies just like any other file:

**index.js**

```js
import Worker from "./my.worker.js";

var worker = new Worker();

var result;

worker.onmessage = function (event) {
  if (!result) {
    result = document.createElement("div");
    result.setAttribute("id", "result");

    document.body.append(result);
  }

  result.innerText = JSON.stringify(event.data);
};

const button = document.getElementById("button");

button.addEventListener("click", function () {
  worker.postMessage({ postMessage: true });
});
```

**my.worker.js**

```js
onmessage = function (event) {
  var workerResult = event.data;

  workerResult.onmessage = true;

  postMessage(workerResult);
};
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
};
```

### Integrating with ES6+ features

You can even use ES6+ features if you have the [`babel-loader`](https://github.com/babel/babel-loader) configured.

**index.js**

```js
import Worker from "./my.worker.js";

const worker = new Worker();

let result;

worker.onmessage = (event) => {
  if (!result) {
    result = document.createElement("div");
    result.setAttribute("id", "result");

    document.body.append(result);
  }

  result.innerText = JSON.stringify(event.data);
};

const button = document.getElementById("button");

button.addEventListener("click", () => {
  worker.postMessage({ postMessage: true });
});
```

**my.worker.js**

```js
onmessage = function (event) {
  const workerResult = event.data;

  workerResult.onmessage = true;

  postMessage(workerResult);
};
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        use: [
          {
            loader: "worker-loader",
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
};
```

### Integrating with TypeScript

To integrate with TypeScript, you will need to define a custom module for the exports of your worker.

**typings/worker-loader.d.ts**

```typescript
declare module "worker-loader!*" {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends Worker {
    constructor();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}
```

**my.worker.ts**

```typescript
const ctx: Worker = self as any;

// Post data to parent thread
ctx.postMessage({ foo: "foo" });

// Respond to message from parent thread
ctx.addEventListener("message", (event) => console.log(event));
```

**index.ts**

```typescript
import Worker from "worker-loader!./Worker";

const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = (event) => {};

worker.addEventListener("message", (event) => {});
```

### Cross-Origin Policy

[`WebWorkers`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) are restricted by a [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy), so if your `webpack` assets are not being served from the same origin as your application, their download may be blocked by your browser.
This scenario can commonly occur if you are hosting your assets under a CDN domain.
Even downloads from the `webpack-dev-server` could be blocked.

There are two workarounds:

Firstly, you can inline the worker as a blob instead of downloading it as an external script via the [`inline`](#inline) parameter

**App.js**

```js
import Worker from "./file.worker.js";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: "worker-loader",
        options: { inline: "fallback" },
      },
    ],
  },
};
```

Secondly, you may override the base download URL for your worker script via the [`publicPath`](#publicpath) option

**App.js**

```js
// This will cause the worker to be downloaded from `/workers/file.worker.js`
import Worker from "./file.worker.js";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: "worker-loader",
        options: { publicPath: "/workers/" },
      },
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/worker-loader.svg
[npm-url]: https://npmjs.com/package/worker-loader
[node]: https://img.shields.io/node/v/worker-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/worker-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/worker-loader
[tests]: https://github.com/webpack-contrib/worker-loader/workflows/worker-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/worker-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/worker-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/worker-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=worker-loader
[size-url]: https://packagephobia.now.sh/result?p=worker-loader
