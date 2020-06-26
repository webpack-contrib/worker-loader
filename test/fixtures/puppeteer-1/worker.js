onmessage = function(event) {
  const workerResult = event.data;

  workerResult.worker = 'passed';

  postMessage(workerResult);
}
