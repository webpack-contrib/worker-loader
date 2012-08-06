exports = module.exports = new (require("events").EventEmitter);
exports.title = "N/A";
exports.version = exports.arch = 
exports.execPath = "webpack";
exports.platform = "worker";
exports.argv = ["webpack", "browser"];
exports.pid = 1;
exports.nextTick = function (fn) {
	setTimeout(fn, 0);
};
exports.cwd = function() {
	return "/app";
}
exports.exit = exports.kill = 
exports.chdir = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};
exports.binding = function(str) {
	return {};
}