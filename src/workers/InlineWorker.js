// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

/* eslint-env browser */
/* eslint-disable no-var, vars-on-top, prefer-template, no-undef, no-use-before-define */
var URL = URL || webkitURL;

function CreateWorker(url, workerType) {
  switch (workerType) {
    case 'SharedWorker':
      return new SharedWorker(url);
    case 'ServiceWorker':
      return new ServiceWorker(url);
    default:
      return new Worker(url);
  }
}

module.exports = function inlineWorker(content, url, workerType) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder =
          BlobBuilder || WebKitBlobBuilder || MozBlobBuilder || MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // The proposed API
        blob = new Blob([content]);
      }

      var objectURL = URL.createObjectURL(blob);
      var worker = CreateWorker(objectURL, workerType);

      URL.revokeObjectURL(objectURL);

      return worker;
    } catch (e) {
      return CreateWorker(
        'data:application/javascript,' + encodeURIComponent(content),
        workerType
      );
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return CreateWorker(url, workerType);
  }
};
