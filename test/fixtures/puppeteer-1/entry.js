const Worker = require('./worker.js');

const worker = new Worker();

worker.onmessage = function (event) {
  document.getElementById('result').innerText = JSON.stringify(event.data)
};

const button = document.getElementById('button');

button.addEventListener('click', () => {
  worker.postMessage({a:1})
})
