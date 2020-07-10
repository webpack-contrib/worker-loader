/* eslint-env browser */
/* eslint-disable no-undef, no-use-before-define, new-cap */

module.exports = function inline(
  content,
  url,
  workerConstructor,
  workerOptions
) {
  try {
    try {
      let blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        const BlobBuilder =
          BlobBuilder || WebKitBlobBuilder || MozBlobBuilder || MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // New API
        blob = new Blob([content]);
      }

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
