import foo from 'my-custom-module';

onmessage = function(event) {
  const workerResult = event.data;

  workerResult.onmessage = true;

  postMessage(workerResult);
};
