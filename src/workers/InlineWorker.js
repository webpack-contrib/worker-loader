// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

/* eslint-env browser */
/* eslint-disable no-var, vars-on-top, prefer-template */

var URL = window.URL || window.webkitURL;

function CreateWorker(url, options, workerType) {
  switch (workerType) {
    case 'SharedWorker':
      return new SharedWorker(url, options);
    case 'ServiceWorker':
      return new ServiceWorker(url, options);
    default:
      return new Worker(url, options);
  }
}

module.exports = function inlineWorker(content, url, options, workerType) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder =
          window.BlobBuilder ||
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

      return CreateWorker(URL.createObjectURL(blob), options, workerType);
    } catch (e) {
      return CreateWorker(
        'data:application/javascript,' + encodeURIComponent(content),
        options,
        workerType
      );
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return CreateWorker(url, options, workerType);
  }
};
