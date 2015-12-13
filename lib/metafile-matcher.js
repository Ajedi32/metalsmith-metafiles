"use strict";

var MatcherOptions = require('./matcher-options.js');
var Metafile = require('./metafile.js');

class MetafileMatcher {
  constructor(options) {
    this.options = new MatcherOptions(options);
  }

  metafile(path, file) {
    return new Metafile(path, file, this.options);
  }

  get deleteMetaFiles() {
    return this.options.deleteMetaFiles;
  }
}

module.exports = MetafileMatcher;
