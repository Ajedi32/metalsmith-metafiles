var Options = require('./options');
var Metafile = require('./metafile');

module.exports = metafiles;

// Not needed in Node 4.0+
if (!Object.assign) Object.assign = require('object-assign');

/**
 * Metalsmith plugin to read file metadata from separate files
 *
 * @param {Object} options
 * @param {String} [options.postfix=".metadata"] - The postfix added to filenames to indicate they are metadata files
 * @param {String} [options.prefix=""] - The prefix added to filenames to indicate they are metadata files
 * @param {boolean} [options.deleteMetaFiles=true] - Whether to delete metadata files from the built site
 * @return {Function}
 */

function metafiles(options) {
  options = new Options(options);

  return function(files, metalsmith) {
    for (var path in files) {
      var metafile = new Metafile(path, files[path], options);

      if (!metafile.isMetafile) continue;
      if (!files[metafile.mainFile]) continue;

      Object.assign(files[metafile.mainFile], metafile.metadata);
      if (options.deleteMetaFiles) delete files[metafile.path];
    }
  };
}
