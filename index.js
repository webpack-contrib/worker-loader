var webpack = require("webpack");
var clone = require("clone");
var path = require("path");
var EventEmitter = require("events").EventEmitter;

module.exports = function(source) {
	var loaderSign = this.request.indexOf("!");
	var remReq = this.request.substr(loaderSign);
	var options = clone(this.options);
	var constructor = "new Worker";
	options.cache = this.options.cache;
	options.watch = false;
	options.noWrite = true;
	var workerWrites = [];
	options.output = "[hash].worker.js";
	options.outputPostfix = ".[hash].worker.js";
	options.emitFile = function(filename, content) {
		workerWrites.push([filename, content]);
	};
	options.template = require("./templates/worker");
	var newBuildin = path.join(__dirname, "buildin");
	options.resolve.paths.unshift(newBuildin);
	options.events = new EventEmitter();
	options.events.on("module", this.options.events.emit.bind(this.options.events, "module"));
	options.events.on("context-enum", this.options.events.emit.bind(this.options.events, "context-enum"));
	options.events.on("context", this.options.events.emit.bind(this.options.events, "context"));
	options.events.on("task", this.options.events.emit.bind(this.options.events, "task-end"));
	if(this.options.worker) {
		if(typeof this.options.worker.webpack == "object") {
			for(var name in this.options.worker.webpack) {
				options[name] = this.options.worker.webpack[name];
			}
		}
	}
	var inlineWorker = this.options.worker.inline
	var self = this;
	var callback = this.async();
	webpack(remReq, options, function webpackFinishedInWorkerLoader(err, stats) {
		if(err) return callback(err);
		var worker = null;
		var workerMainContent = null;
		workerWrites.forEach(function(write) {
			self.emitFile(write[0].replace(/\[hash\]/g, stats.hash), write[1]);
			if(inlineWorker && write[0] == options.output && write[1]) {
				constructor = "require(" + JSON.stringify(path.join(__dirname, "createInlineWorker.js")) + ")";
				workerMainContent = write[1];
			}
		});
		stats.request = remReq;
		self.emitSubStats(stats);
		stats.dependencies.forEach(function(dep) {
			self.dependency && self.dependency(dep);
		});
		stats.loaders.forEach(function(dep) {
			self.loaderDependency && self.loaderDependency(dep);
		});
		callback(null, "module.exports = function() {\n"+
			"  return " + constructor + "(" +
				(workerMainContent ? JSON.stringify(workerMainContent) + ", " : "") +
				require("webpack/api/getPublicPrefix") + " + " +
				JSON.stringify(options.output.replace(/\[hash\]/g, stats.hash)) + ");\n" + "}");
	});
}