var requireOptionalDependency = require('codependency').get('metalsmith-metafiles');

module.exports = {
  ".json": JSON.parse,

  ".yaml": function(content, options) {
    var yaml = requireOptionalDependency('js-yaml');

    return yaml.safeLoad(content, {filename: options.path});
  }
};
