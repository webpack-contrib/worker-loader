// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;

module.exports = function (content, url, shared) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // The proposed API
        blob = new Blob([content]);
      }

      if(shared) {
        return function(name) { new SharedWorker(URL.createObjectURL(blob), name); };
      } else {
        return function() { new Worker(URL.createObjectURL(blob)); };
      }
    } catch (e) {
      if(shared) {
        return function(name) { new SharedWorker('data:application/javascript,' + encodeURIComponent(content), name); };
      } else {
        return function() { new Worker('data:application/javascript,' + encodeURIComponent(content)); };
      }
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    if (options.shared) {
      return function(name) { new SharedWorker(url, name); };
    } else {
      return function() { new Worker(url); };
    }
  }
};
