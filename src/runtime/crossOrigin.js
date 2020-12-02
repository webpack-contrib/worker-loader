/* eslint-env browser */
/* eslint-disable no-undef, no-use-before-define, new-cap */
// initial solution by Benohead's Software Blog https://benohead.com/blog/2017/12/06/cross-domain-cross-browser-web-workers/

module.exports = (workerConstructor, workerOptions, workerUrl) => {
  let worker = null;
  let blob;

  try {
    blob = new Blob([`importScripts('${workerUrl}');`], {
      type: 'application/javascript',
    });
  } catch (e) {
    const BlobBuilder =
      window.BlobBuilder ||
      window.WebKitBlobBuilder ||
      window.MozBlobBuilder ||
      window.MSBlobBuilder;

    blobBuilder = new BlobBuilder();

    blobBuilder.append(`importScripts('${workerUrl}');`);

    blob = blobBuilder.getBlob('application/javascript');
  }

  const URL = window.URL || window.webkitURL;
  const blobUrl = URL.createObjectURL(blob);
  worker = new window[workerConstructor](blobUrl, workerOptions);

  URL.revokeObjectURL(blobUrl);

  return worker;
};
