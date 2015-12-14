var requireOptionalDependency = require('codependency').get('metalsmith-metafiles');

module.exports = {
  "JSON.parse": JSON.parse,

  "js-yaml": function(content, options) {
    var yaml = requireOptionalDependency('js-yaml');

    return yaml.safeLoad(content, {filename: options.path});
  }
};
