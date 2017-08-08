[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![chat][chat]][chat-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>Worker Loader</h1>
  <p>This loader registers the script as <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">Web Worker</a>.<p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D worker-loader
```

or

```bash
yarn add worker-loader --dev
```

<h2 align="center"><a href="https://webpack.js.org/concepts/loaders">Usage</a></h2>

Import the worker file:

``` javascript
// main.js
var MyWorker = require("worker-loader!./file.js");

var worker = new MyWorker();
worker.postMessage({a: 1});
worker.onmessage = function(event) {...};
worker.addEventListener("message", function(event) {...});
```

You can also inline the worker as a blob with the `inline` parameter:
``` javascript
var MyWorker = require("worker-loader?inline!./myWorker.js");
```

Inline mode will also create chunks for browsers without supporting of inline workers,
to disable this behavior just set `fallback` parameter as `false`:

``` javascript
var MyWorker = require("worker-loader?inline&fallback=false!./myWorker.js");
```

To set a custom name for the output script, use the `name` parameter. The name may contain the string `[hash]`,
which will be replaced with a content-dependent hash for caching purposes. For example:

``` javascript
var MyWorker = require("worker-loader?name=outputWorkerName.[hash].js!./myWorker.js");
```


The worker file can import dependencies just like any other file:

``` javascript
// file.js
var _ = require('lodash')

var o = {foo: 'foo'}

_.has(o, 'foo') // true

// Post data to parent thread
self.postMessage({foo: 'foo'}) 

// Respond to message from parent thread
self.addEventListener('message', function(event){ console.log(event); });  
```

You can even use ES6 modules if you have the babel-loader configured:

``` javascript
// file.js
import _ from 'lodash'

let o = {foo: 'foo'}

_.has(o, 'foo') // true

// Post data to parent thread
self.postMessage({foo: 'foo'}) 

// Respond to message from parent thread
self.addEventListener('message', (event) => { console.log(event); });
```

### Service Workers

Note: Service workers cannot use the `inline` option. `require('worker?service&inline!./worker')` the `inline` here is ignored.

``` javascript
// main.js
var MyWorker = require("worker?service!./worker.js");

// Options passed here become the 2nd parameter to navigator.serviceWorker.register
MyWorker({ scope: '/' }).then((registration) => {
    console.log('registration successful')
}).catch((err) => {
    console.log('registration failed', err)
})
```

See [navigator.serviceWorker.register](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) for available options. At the time of this writing it appears the only option is `scope`.

### Shared Workers

Note: Shared workers cannot use the `inline` option. `require('worker?shared&inline!./worker')` the `inline` here is ignored.

``` javascript
// main.js
var MyWorker = require("worker?shared!./worker.js");
var worker = new MyWorker("name"); //if no name parameter is supplied, it will default to "untitled" in chrome
worker.port.onmessage = function(event) {
  ...
};
worker.port.postMessage("blah");
```

### Integrating with TypeScript

To integrate with TypeScript, you will need to define a custom module for the exports of your worker. You will also need to cast the new worker as the `Worker` type:

**typings/custom.d.ts**
```
declare module "worker-loader!*" {
  const content: any;
  export = content;
}
```

**App.ts**
```
import * as MyWorker from "worker-loader!../../worker";
const worker: Worker = new MyWorker();
```

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/sokra">
          <img width="150" height="150" src="https://github.com/sokra.png?s=150">
        </a>
        <br />
        <a href="https://github.com/sokra">Tobias Koppers</a>
      </td>
      <td align="center">
        <a href="https://github.com/d3viant0ne">
          <img width="150" height="150" src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </a>
        <br />
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <a href="https://github.com/TrySound">
          <img width="150" height="150" src="https://avatars3.githubusercontent.com/u/5635476?v=3&s=150">
        </a>
        <br />
        <a href="https://github.com/TrySound">Bogdan Chadkin</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/worker-loader.svg
[npm-url]: https://npmjs.com/package/worker-loader

[deps]: https://david-dm.org/webpack-contrib/worker-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/worker-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/worker-loader.svg
[test-url]: https://travis-ci.org/webpack-contrib/worker-loader
