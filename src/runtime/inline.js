/* eslint-env browser */
/* eslint-disable no-undef, no-use-before-define, new-cap */

module.exports = (content, workerConstructor, workerOptions, url) => {
  try {
    try {
      let blob;

      try {
        // New API
        blob = new window.Blob([content]);
      } catch (e) {
        // BlobBuilder = Deprecated, but widely implemented
        const BlobBuilder =
          window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      }
      
      const URL = window.URL || window.webkitURL;
      const objectURL = URL.createObjectURL(blob);
      const worker = new window[workerConstructor](objectURL, workerOptions);

      URL.revokeObjectURL(objectURL);

      return worker;
    } catch (e) {
      return new window[workerConstructor](
        `data:application/javascript,${encodeURIComponent(content)}`,
        workerOptions
      );
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new window[workerConstructor](url, workerOptions);
  }
};
