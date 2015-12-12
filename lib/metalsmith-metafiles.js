"use strict";

var Options = require('./options');
var Metafile = require('./metafile');

// Not needed in Node 4.0+
if (!Object.assign) Object.assign = require('object-assign');

class MetalsmithMetafiles {
  constructor(options) {
    this.options = new Options(options);
  }

  // Main interface
  parseMetafiles(files) {
    for (var path in files) {
      var metafile = new Metafile(path, files[path], this.options);

      if (!metafile.isMetafile) continue;
      if (!files[metafile.mainFile]) continue;

      Object.assign(files[metafile.mainFile], metafile.metadata);
      if (this.options.deleteMetaFiles) delete files[metafile.path];
    }
  }
}

module.exports = MetalsmithMetafiles;
