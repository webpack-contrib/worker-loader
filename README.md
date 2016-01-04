# worker loader for webpack

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Import the worker file:

``` javascript
// main.js
var MyWorker = require("worker!./file.js");

var worker = new MyWorker();
worker.postMessage({a: 1});
worker.onmessage = function(event) {...};
worker.addEventListener("message", function(event) {...});
```

The worker file can import dependencies just like any other file:

``` javascript
// file.js
var _ = require('lodash')

var o = {foo: 'foo'}

_.has(o, 'foo') // true
```

You can even use ES6 modules if you have the babel-loader configured:

``` javascript
// file.js
import _ from 'lodash'

let o = {foo: 'foo'}

_.has(o, 'foo') // true
```

## Service Workers

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


### __assets__

Service Workers may need to know the list of files Webpack produced. See [Introduction to Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) for an example of how the worker could cache your site.

If your Service Worker needs an array of filenames webpack produced you can reference the magic value `__assets__` inside the worker. This will *not* work inside your main application as it depends on a Worker-only feature ([`importScripts`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Importing_scripts_and_libraries))


## License

MIT (http://www.opensource.org/licenses/mit-license.php)
