function testRuntimeFunction(publicWorkerPath) {
	return '/some/other/proxy/' + publicWorkerPath;
}

const Worker = require('./worker.js');