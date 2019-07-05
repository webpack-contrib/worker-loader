// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

module.exports = function (content, url) {
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
        blob = new window.Blob([content]);
      }

      var URL = window.URL || window.webkitURL;
      var objectURL = URL.createObjectURL(blob);
      var worker = new window.Worker(objectURL);
      URL.revokeObjectURL(objectURL);

      return worker;
    } catch (e) {
      return new window.Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new window.Worker(url);
  }
};
