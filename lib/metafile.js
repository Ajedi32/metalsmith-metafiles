"use strict";

var Options = require("./options");

class Metafile {
  constructor(path, file, options) {
    this.path = path;
    this.file = file;
    this.options = new Options(options);
  }

  get fullPostfix() {
    return this.path.slice(-this.options.fullPostfix.length);
  }

  get isMetafile() {
    return this.fullPostfix && this.fullPostfix === this.options.fullPostfix;
  }

  get mainFile() {
    if (!this.isMetafile) return null;
    return this.path.slice(0, -this.options.fullPostfix.length);
  }

  get metadata() {
    if (!this.isMetafile) return null;
    return JSON.parse(this.file.contents);
  }
}

module.exports = Metafile;
