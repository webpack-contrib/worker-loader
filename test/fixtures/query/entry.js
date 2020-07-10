const Worker = require('!../../../src?name=test.worker.js!./my-worker-name.js');

const worker = new Worker();

worker.onmessage = function (event) {
  document.getElementById('result').innerText = JSON.stringify(event.data)
};

const button = document.getElementById('button');

button.addEventListener('click', () => {
  worker.postMessage({ postMessage: true })
});
