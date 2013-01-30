var WebWorkerTemplatePlugin = require("webpack/lib/WebWorkerTemplatePlugin");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
var path = require("path");

module.exports = function() {};
module.exports.pitch = function(request) {
	if(!this.webpack) throw new Error("Only usable with webpack");
	var callback = this.async();
	var workerCompiler = this._compilation.createChildCompiler("worker", {
		filename: "[hash].worker.js",
		chunkFilename: "[i].[hash].worker.js",
		namedChunkFilename: null
	});
	workerCompiler.apply(new WebWorkerTemplatePlugin());
	workerCompiler.apply(new SingleEntryPlugin(this.context, "!!" + request, "main"));
	workerCompiler.runAsChild(function(err, entries, compilation) {
		if(err) return callback(err);
		var workerFile = entries[0].files[0];
		var constructor = "new Worker(__webpack_public_path__ + " + JSON.stringify(workerFile) + ")";
		return callback(null, "module.exports = function() {\n\treturn "+constructor+";\n};");
	});
}