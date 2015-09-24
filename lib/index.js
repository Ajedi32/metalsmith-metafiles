module.exports = metafiles;

// Not needed in Node 4.0+
if (!Object.assign) Object.assign = require('object-assign');

/**
 * Metalsmith plugin to read file metadata from separate files
 *
 * @param {Object} options
 * @return {Function}
 */

function metafiles(options) {
  var extension = ".metadata.json";

  return function(files, metalsmith) {
    for (var metaFile in files) {
      if (!metaFile.slice(-extension.length)) continue;

      var mainFile = metaFile.slice(0, -extension.length);
      if (!files[mainFile]) continue;

      Object.assign(files[mainFile], JSON.parse(files[metaFile].contents));
      delete files[metaFile];
    }
  };
}
