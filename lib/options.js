"use strict";

class Options {
  constructor(options) {
    if (options === undefined) options = {};
    this.deleteMetaFiles = (options.deleteMetaFiles === undefined ? true : options.deleteMetaFiles);
    this.postfix = options.postfix || ".metadata";
    this.extension = ".json";
  }

  get fullPostfix() {
    return this.postfix + this.extension;
  }
}

module.exports = Options;
