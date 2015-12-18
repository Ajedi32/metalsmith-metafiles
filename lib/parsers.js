"use strict";

var requireOptionalDependency = require('codependency').get('metalsmith-metafiles');

module.exports = {
  "JSON.parse": JSON.parse,

  "js-yaml": function(content, options) {
    var yaml = requireOptionalDependency('js-yaml');

    return yaml.safeLoad(content, {filename: options.path});
  },

  "eval": function(str) {
    /* jshint evil:true */
    return eval(str.toString());
  },

  "eval-wrapped": function(str) {
    /* jshint evil:true */
    str = '(function() {return {' + str.toString() + '}; })()';
    return eval(str);
  },

  "require": function(str, options) {
    var Module = module.constructor;
    var mod = new Module();
    mod.paths = module.paths;
    mod._compile(str.toString(), options.path);
    return mod.exports;
  },

  "coffee-script": function(str, options) {
    var coffee = requireOptionalDependency('coffee-script');
    var result = coffee.eval(str.toString(), {filename: options.path});
    return result;
  },

  "toml": function(str) {
    return requireOptionalDependency('toml').parse(str);
  },
};
