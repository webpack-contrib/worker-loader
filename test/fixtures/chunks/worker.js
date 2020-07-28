async function loadChunk() {
  return import(/* webpackMode: "lazy" */ './chunk');
}

onmessage = async function(event) {
  const { returnTrue } = await loadChunk();

  const workerResult = event.data;

  workerResult.onmessage = returnTrue();

  postMessage(workerResult);
};
