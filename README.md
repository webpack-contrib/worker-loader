# worker loader for webpack

## Usage

``` javascript
var MyWorker = require("worker!./file.js");

var worker = new MyWorker();
worker.postMessage({a: 1});
worker.onmessage = function(event) {...};
worker.addEventListener("message", function(event) {...});
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)