// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

(function (w) {
	var URL = w.URL || w.webkitURL;
	module.exports = function(content, url) {
		try {
			try {
				var blob;
				try { // BlobBuilder = Deprecated, but widely implemented
					var BlobBuilder = w.BlobBuilder || w.WebKitBlobBuilder || w.MozBlobBuilder || w.MSBlobBuilder;
					blob = new BlobBuilder();
					blob.append(content);
					blob = blob.getBlob();
				} catch(e) { // The proposed API
					blob = new Blob([content]);
				}
				return new Worker(URL.createObjectURL(blob));
			} catch(e) {
				return new Worker('data:application/javascript,' + encodeURIComponent(content));
			}
		} catch(e) {
			return new Worker(url);
		}
	}
}(this));
