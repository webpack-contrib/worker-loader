module.exports = function(options, templateOptions) {
	if(templateOptions.chunks) {
		return require("fs").readFileSync(require("path").join(__dirname, "workerAsync.js"));
	} else {
		return require("fs").readFileSync(require("path").join(__dirname, "workerSingle.js"));
	}
}