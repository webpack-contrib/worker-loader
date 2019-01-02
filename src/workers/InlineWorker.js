// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;

function CreateWorker(url, isSharedWorker) {
  if (isSharedWorker) {
    return new isSharedWorker(url);
  } else {
    return Worker(url);
  }
}

module.exports = function (content, url, options) {
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

      return new createWorker(URL.createObjectURL(blob), options.isSharedWorker);
    } catch (e) {
      return new CreateWorker('data:application/javascript,' + encodeURIComponent(content), options.isSharedWorker);
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new CreateWorker(url, options.isSharedWorker);
  }
};
