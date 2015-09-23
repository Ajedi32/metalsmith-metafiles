module.exports = metafiles;

/**
 * Assign all iterable properties in `source` to `target`.
 *
 * In ECMAScript 6, this function can be replaced with `Object.assign`.
 *
 * @param {Object} target
 * @param {Object} source
 */

function mergeProperties(target, source) {
  for (var propertyName in source) {
    target[propertyName] = source[propertyName];
  }
}

/**
 * Metalsmith plugin to read file metadata from separate files
 *
 * @param {Object} options
 * @return {Function}
 */

function metafiles(options) {
  var extension = ".metadata.json"

  return function(files, metalsmith) {
    for (var metaFile in files) {
      if (!metaFile.slice(-extension.length)) continue;

      var mainFile = metaFile.slice(0, -extension.length)
      if (!files[mainFile]) continue;

      mergeProperties(files[mainFile], JSON.parse(files[metaFile].contents))
      delete files[metaFile];
    }
  };
}
