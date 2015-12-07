var Options = require('./options');

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
  options = new Options(options);

  return function(files, metalsmith) {
    for (var metaFile in files) {
      var currentFullPostfix = metaFile.slice(-options.fullPostfix.length);
      if (!currentFullPostfix || currentFullPostfix != options.fullPostfix) continue;

      var mainFile = metaFile.slice(0, -options.fullPostfix.length);
      if (!files[mainFile]) continue;

      Object.assign(files[mainFile], JSON.parse(files[metaFile].contents));
      if (options.deleteMetaFiles) delete files[metaFile];
    }
  };
}
