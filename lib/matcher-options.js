"use strict";

var parsers = require('./parsers');
var defaultParsers = require('./default-parsers');

class MatcherOptions {
  constructor(options) {
    if (options === undefined) options = {};
    this.deleteMetaFiles = (options.deleteMetaFiles === undefined ? true : options.deleteMetaFiles);
    this.postfix = options.postfix || ".meta";
    this.prefix = options.prefix || "";
    this.onMissingMainFile = options.onMissingMainFile || "throw";
    this.extension = options.extension || ".json";
    this.parser = this._getParser(options.parser);

    this._validate();
  }

  _validate() {
    var validOnMissingMainFileValues = ['throw', 'ignore', 'delete'];
    if (validOnMissingMainFileValues.indexOf(this.onMissingMainFile) === -1) {
      throw new Error("Invalid option for onMissingMainFile: " + this.onMissingMainFile);
    }
  }

  _getParser(parser) {
    if (parser === true) {
       return parsers[defaultParsers[this.extension]];
    } else if (typeof parser === 'string') {
      return parsers[parser];
    } else if (typeof parser === 'function') {
      return parser;
    }
  }

  get fullPostfix() {
    return this.postfix + this.extension;
  }
}

module.exports = MatcherOptions;
