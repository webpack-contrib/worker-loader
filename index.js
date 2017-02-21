var WebWorkerTemplatePlugin = require("webpack/lib/webworker/WebWorkerTemplatePlugin");
var ConstDependency = require('webpack/lib/dependencies/ConstDependency');
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
var path = require("path");

var loaderUtils = require("loader-utils");
module.exports = function() {};
module.exports.pitch = function(request) {
	if(!this.webpack) throw new Error("Only usable with webpack");
	this.cacheable(false);
	var callback = this.async();
	var query = loaderUtils.parseQuery(this.query);
	var filename = loaderUtils.interpolateName(this, query.name || "[hash].worker.js", {
		context: query.context || this.options.context,
		regExp: query.regExp
	});
	var outputOptions = {
		filename: filename,
		chunkFilename: "[id]." + filename,
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

	// If the user doesn't include the magic `__assets__` anywhere, there is no
	// need to produce an asset file.
	var includeAssets = false

	// I don't know how to register this in webpack to get a hashed filename.
	// This is my temporary hack to use while I try to find a good solution.
	var BAD_HASH = Math.random().toString(36).substring(2, 10)
	// Service workers won't update if the file hasn't changed, so it's
	// important that __assets__ changes any time the list of assets has
	// changed. Ideally it would not change if the list of assets hasn't
	// changed.
	var assetListFilename = "assets." + BAD_HASH + ".js"

	workerCompiler.parser.plugin("expression __assets__" , function(expr) {
		includeAssets = true;
		// importScripts can only be used inside a worker and it's much like a `<script>` tag.
		const dep = new ConstDependency("(importScripts("  + JSON.stringify(assetListFilename) + "), __asset_list)", expr.range);
		dep.loc = expr.loc;
		this.state.current.addDependency(dep);
		return true
	})

	// I know this is hacky, but I don't know how else to do this. In my (weak)
	// defense... it is documented
	// http://webpack.github.io/docs/loaders.html#_compiler
	this._compiler.plugin('emit', function(compilation, callback) {
		if (includeAssets) {
			var fileContent = "__asset_list = " + JSON.stringify(
				Object.keys(compilation.assets).sort()
			)

			compilation.assets[assetListFilename] = {
				source: function() {
					return fileContent;
				},
				size: function() {
					return fileContent.length;
				}
			};
		}

		callback()
	});

	workerCompiler.runAsChild(function(err, entries, compilation) {
		if(err) return callback(err);
		if (entries[0]) {
			var workerFile = entries[0].files[0];
			var constructor
			if(query.service) {
				constructor = "navigator.serviceWorker.register(__webpack_public_path__ + " + JSON.stringify(workerFile) + ", options);"
			} else {
				constructor = "new Worker(__webpack_public_path__ + " + JSON.stringify(workerFile) + ")";
				if(query.inline) {
					constructor = "require(" + JSON.stringify("!!" + path.join(__dirname, "createInlineWorker.js")) + ")(" +
					JSON.stringify(compilation.assets[workerFile].source()) + ", __webpack_public_path__ + " + JSON.stringify(workerFile) + ")";
				}
			}
			return callback(null, "module.exports = function(options) {\n\treturn " + constructor + ";\n};");
		} else {
			return callback(null, null);
		}
	});
};
