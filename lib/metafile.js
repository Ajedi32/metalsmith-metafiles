"use strict";

var Options = require("./options");
var path = require("path");

class Metafile {
  constructor(path, file, options) {
    this.path = path;
    this.file = file;
    this.options = new Options(options);
  }

  get basename() {
    return path.basename(this.path);
  }

  get dirname() {
    return path.dirname(this.path);
  }

  get fullPostfix() {
    return this.path.slice(-this.options.fullPostfix.length);
  }

  get prefix() {
    return this.basename.slice(0, this.options.prefix.length);
  }

  get isMetafile() {
    return (
      this.fullPostfix === this.options.fullPostfix &&
      this.prefix === this.options.prefix
    );
  }

  get mainFile() {
    if (!this.isMetafile) return null;
    return path.join(
      this.dirname,
      this.basename.slice(
        this.options.prefix.length,
        -this.options.fullPostfix.length
      )
    );
  }

  get metadata() {
    if (!this.isMetafile) return null;
    return JSON.parse(this.file.contents);
  }
}

module.exports = Metafile;
