[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![chat][chat]][chat-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>SharedWorker Loader</h1>
  <p>This loader registers the script as <a href="https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker">Shared Worker</a>.<p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D sharedworker-loader
```

or

```bash
yarn add sharedworker-loader --dev
```

<h2 align="center"><a href="https://webpack.js.org/concepts/loaders">Usage</a></h2>

Import the worker file:

``` javascript
// main.js
var MyWorker = require("sharedworker-loader!./file.js");

var worker = new MyWorker();
worker.postMessage({a: 1});
worker.onmessage = function(event) {...};
worker.addEventListener("message", function(event) {...});
```

You can also inline the worker as a blob with the `inline` parameter:
``` javascript
var MyWorker = require("sharedworker-loader?inline!./myWorker.js");
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

[npm]: https://img.shields.io/npm/v/sharedworker-loader.svg
[npm-url]: https://npmjs.com/package/sharedworker-loader

[deps]: https://david-dm.org/kesne/sharedworker-loader.svg
[deps-url]: https://david-dm.org/kesne/sharedworker-loader

[test]: http://img.shields.io/travis/kesne/sharedworker-loader.svg
[test-url]: https://travis-ci.org/kesne/sharedworker-loader
