module.exports = metafiles;

// Not needed in Node 4.0+
if (!Object.assign) Object.assign = require('object-assign');

/**
 * Metalsmith plugin to read file metadata from separate files
 *
 * @param {Object} options
 * @param {boolean} [options.deleteMetaFiles=true] - Whether to delete metadata files from the built site
 * @return {Function}
 */

function metafiles(options) {
  options = options || {};

  var deleteMetaFiles = (options.deleteMetaFiles === undefined ? true : options.deleteMetaFiles);
  var extension = ".metadata.json";

  return function(files, metalsmith) {
    for (var metaFile in files) {
      if (!metaFile.slice(-extension.length)) continue;

      var mainFile = metaFile.slice(0, -extension.length);
      if (!files[mainFile]) continue;

      Object.assign(files[mainFile], JSON.parse(files[metaFile].contents));
      if (deleteMetaFiles) delete files[metaFile];
    }
  };
}
