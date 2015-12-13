// Register module for requiring optional dependencies
require('codependency').register(module);

var MetalsmithMetafiles = require('./metalsmith-metafiles');

/**
 * Metalsmith plugin to read file metadata from separate files
 *
 * @param {Object} options
 * @param {String} [options.postfix=".metadata"] - The postfix added to filenames to indicate they are metadata files
 * @param {String} [options.prefix=""] - The prefix added to filenames to indicate they are metadata files
 * @param {boolean} [options.deleteMetaFiles=true] - Whether to delete metadata files from the built site
 * @param {Object} [options.parsers={".json":true}] - Configuration details for the parsers used for different metadata formats
 * @return {Function}
 */

function metafiles(options) {
  metalsmithMetafiles = new MetalsmithMetafiles(options);

  return function(files, metalsmith) {
    metalsmithMetafiles.parseMetafiles(files);
  };
}

module.exports = metafiles;
