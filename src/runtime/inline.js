/* eslint-env browser */
/* eslint-disable no-undef, no-use-before-define, new-cap */

module.exports = (content, workerConstructor, workerOptions, url) => {
  const globalScope = self || window;
  try {
    try {
      let blob;

      try {
        // New API
        blob = new globalScope.Blob([content]);
      } catch (e) {
        // BlobBuilder = Deprecated, but widely implemented
        const BlobBuilder =
          globalScope.BlobBuilder ||
          globalScope.WebKitBlobBuilder ||
          globalScope.MozBlobBuilder ||
          globalScope.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      }

      const URL = globalScope.URL || globalScope.webkitURL;
      const objectURL = URL.createObjectURL(blob);
      const worker = new globalScope[workerConstructor](
        objectURL,
        workerOptions
      );

      // URL.revokeObjectUrl shouldn't be called immediately after Worker creation on IE and Edge legacy.
      // Worker will be forked but the script will not be executed and there are no error event or runtime exceptions for this.
      if (globalScope.setImmediate) {
        globalScope.setImmediate(() => URL.revokeObjectURL(objectURL));
      } else {
        URL.revokeObjectURL(objectURL);
      }

      return worker;
    } catch (e) {
      return new globalScope[workerConstructor](
        `data:application/javascript,${encodeURIComponent(content)}`,
        workerOptions
      );
    }
  } catch (e) {
    if (!url) {
      throw Error("Inline worker is not supported");
    }

    return new globalScope[workerConstructor](url, workerOptions);
  }
};
