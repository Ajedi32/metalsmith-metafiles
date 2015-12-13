"use strict";

var path = require("path");

class Metafile {
  constructor(path, file, options) {
    this.path = path;
    this.file = file;
    this.options = options;
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
    return this.options.parser(this.file.contents, {
      path: this.path,
    });
  }
}

module.exports = Metafile;
