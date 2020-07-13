onmessage = async function(event) {
  const workerResult = event.data;

  const wasm = await import('./add.wasm');

  workerResult.onmessage = wasm.add(10, 20);

  postMessage(workerResult);
};
