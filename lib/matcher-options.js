"use strict";

var parsers = require('./parsers');

class MatcherOptions {
  constructor(options) {
    if (options === undefined) options = {};
    this.deleteMetaFiles = (options.deleteMetaFiles === undefined ? true : options.deleteMetaFiles);
    this.postfix = options.postfix || ".metadata";
    this.prefix = options.prefix || "";
    this.extension = options.extension || ".json";
    this.parser = options.parser || parsers[this.extension];
  }

  get fullPostfix() {
    return this.postfix + this.extension;
  }
}

module.exports = MatcherOptions;
