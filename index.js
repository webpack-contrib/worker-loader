var webpack = require("webpack");
var clone = require("clone");
var path = require("path");

module.exports = function(source) {
	var loaderSign = this.request.indexOf("!");
	var remReq = this.request.substr(loaderSign);
	var options = clone(this.options);
	options.cache = this.options.cache;
	options.watch = false;
	var workerWrites = [];
	options.output = "[hash].worker.js";
	options.outputPostfix = ".[hash].worker.js";
	options.emitFile = function(filename, content) {
		workerWrites.push([filename, content]);
	};
	options.template = require("./templates/worker");
	var newBuildin = path.join(__dirname, "buildin");
	options.resolve.paths.unshift(newBuildin);
	if(this.options.worker) {
		if(typeof this.options.worker.webpack == "object") {
			for(var name in this.options.worker.webpack) {
				options[name] = this.options.worker.webpack[name];
			}
		}
	}
	var self = this;
	var callback = this.async();
	webpack(remReq, options, function(err, stats) {
		if(err) return callback(err);
		var worker = null;
		workerWrites.forEach(function(write) {
			self.emitFile(write[0].replace(/\[hash\]/g, stats.hash), write[1]);
		});
		stats.request = remReq;
		self.emitSubStats(stats);
		callback(null, "module.exports = function() {\n"+
			"  return new Worker(" + require("webpack/api/getPublicPrefix") + " + " + 
				JSON.stringify(stats.hash + ".worker.js") + ");\n" + "}");
	});
}