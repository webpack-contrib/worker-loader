var WebWorkerTemplatePlugin = require("webpack/lib/webworker/WebWorkerTemplatePlugin");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
var path = require("path");

var loaderUtils = require("loader-utils");
module.exports = function() {};
module.exports.pitch = function(request) {
	if(!this.webpack) throw new Error("Only usable with webpack");
	var callback = this.async();
	var query = loaderUtils.parseQuery(this.query);
	var outputOptions = {
		filename: "[hash].worker.js",
		chunkFilename: "[id].[hash].worker.js",
		namedChunkFilename: null
	};
	if(this.options && this.options.worker && this.options.worker.output) {
		for(var name in this.options.worker.output) {
			outputOptions[name] = this.options.worker.output[name];
		}
	}
	var workerCompiler = this._compilation.createChildCompiler("worker", outputOptions);
	workerCompiler.apply(new WebWorkerTemplatePlugin(outputOptions));
	workerCompiler.apply(new SingleEntryPlugin(this.context, "!!" + request, "main"));
	if(this.options && this.options.worker && this.options.worker.plugins) {
		this.options.worker.plugins.forEach(function(plugin) {
			workerCompiler.apply(plugin);
		});
	}
	var subCache = "subcache " + __dirname + " " + request;
	workerCompiler.plugin("compilation", function(compilation) {
		if(compilation.cache) {
			if(!compilation.cache[subCache])
				compilation.cache[subCache] = {};
			compilation.cache = compilation.cache[subCache];
		}
	});
	workerCompiler.runAsChild(function(err, entries, compilation) {
		if(err) return callback(err);
		var workerFile = entries[0].files[0];
		var constructor = "new Worker(__webpack_public_path__ + " + JSON.stringify(workerFile) + ")";
		if(query.inline) {
			constructor = "require(" + JSON.stringify("!!" + path.join(__dirname, "createInlineWorker.js")) + ")(" +
				JSON.stringify(compilation.assets[workerFile].source()) + ", __webpack_public_path__ + " + JSON.stringify(workerFile) + ")"
		}
		return callback(null, "module.exports = function() {\n\treturn "+constructor+";\n};");
	});
}