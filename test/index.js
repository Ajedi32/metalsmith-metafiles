var assert = require('assert');
var Metalsmith = require('metalsmith');
var metafiles = require('../lib');

function runMetalsmithMetafiles(dir, options, immediateCallback) {
  return new Promise(function(resolve, reject) {
    Metalsmith(dir)
    .use(metafiles(options))
      .build(function(err, files){
        if (err) return reject(err);
        resolve(files);
      });
  });
}

function runMetalsmithMetafilesBeforeEach(dir, options) {
  beforeEach(function() {
    var _this = this;
    return runMetalsmithMetafiles(dir, options).then(function(files) {
      _this.result = files;
    }.bind(this)); // Eventually use an arrow function here instead
  });
}

describe('metalsmith-metafiles', function() {
  it('should apply metadata from metadata files', function() {
    return runMetalsmithMetafiles('test/fixtures/basic').then(function(files) {
      assert.equal(files["index.md"].testKey, "Some value");
    });
  });

  it('should remove metadata files', function() {
    return runMetalsmithMetafiles('test/fixtures/basic').then(function(files) {
      assert.equal(files["index.md.meta.json"], undefined);
    });
  });

  // Regression test
  it("should not apply metadata from files with a postfix that isn't `.meta.json`, but has the same length", function() {
    return runMetalsmithMetafiles('test/fixtures/wrong_postfix').then(function(files) {
      assert.equal(files["index.md"].testKey, undefined);
    });
  });

  it('should throw an error for metadata files with no corresponding main file', function(done) {
    runMetalsmithMetafiles('test/fixtures/missing_main_file').then(function(files) {
      done(new Error("Expected build to fail, but it succeeded!"));
    }, function(err) {
      done();
    });
  });

  context("when the onMissingMainFile option is set to 'ignore'", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/missing_main_file', {
      onMissingMainFile: 'ignore',
    });

    it('should ignore metadata files with no corresponding main file', function() {
      assert(this.result); // No errors
    });
    it('should not delete metadata files with no corresponding main file', function() {
      assert.notEqual(this.result['index.md.meta.json'], undefined);
    });
  });

  context("when the onMissingMainFile option is set to 'delete'", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/missing_main_file', {
      onMissingMainFile: 'delete',
    });

    it('should ignore metadata files with no corresponding main file', function() {
      assert(this.result); // No errors
    });
    it('should delete metadata files with no corresponding main file', function() {
      assert.equal(this.result['index.md.meta.json'], undefined);
    });
  });

  context("when the onMissingMainFile option is set to 'throw'", function() {
    it('should throw an error for metadata files with no corresponding main file', function(done) {
      runMetalsmithMetafiles('test/fixtures/missing_main_file', {
        onMissingMainFile: 'throw',
      }).then(function(files) {
        done(new Error("Expected build to fail, but it succeeded!"));
      }, function(err) {
        done();
      });
    });
  });

  context("when the onMissingMainFile option is set to an invalid value", function() {
    it('should throw an error', function(done) {
      runMetalsmithMetafiles('test/fixtures/basic', {
        onMissingMainFile: 'asdf',
      }).then(function(files) {
        done(new Error("Expected build to fail, but it succeeded!"));
      }, function(err) {
        done();
      });
    });
  });

  context("when the deleteMetaFiles option is set to false", function() {
    it('should not remove metadata files', function() {
      return runMetalsmithMetafiles('test/fixtures/basic', {
        deleteMetaFiles: false,
      }).then(function(files) {
        assert.notEqual(files["index.md.meta.json"], undefined);
      });
    });
  });

  context("when the postfix option is set to '.custom'", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/custom_postfix', {
        postfix: '.custom'
    });

    it('should apply metadata from *.custom.json files', function() {
      assert.equal(this.result["index.md"].testKey, "Some value");
    });

    it('should remove *.custom.json files', function() {
      assert.equal(this.result["index.md.custom.json"], undefined);
    });

    it('should not apply metadata from *.meta.json files', function() {
      assert.equal(this.result["index.md"].otherKey, undefined);
    });

    it('should not remove *.meta.json files', function() {
      assert.notEqual(this.result["index.md.meta.json"], undefined);
    });
  });

  context("when the prefix option is set to 'm-'", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/custom_prefix', {
      prefix: 'm-'
    });

    it('should apply metadata from m-*.meta.json files', function() {
      assert.equal(this.result["index.md"].testKey, "Correct value");
    });

    it('should remove m-*.meta.json files', function() {
      assert.equal(this.result["m-index.md.meta.json"], undefined);
    });

    it('should not apply metadata from files without the "m-" prefix', function() {
      assert.equal(this.result["index.md"].otherKey, undefined);
    });

    it('should not remove files without the "m-" prefix', function() {
      assert.notEqual(this.result["index.md.meta.json"], undefined);
    });
  });

  context("when another parser is enabled", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/yaml_metafiles', {
      parsers: {
        ".yaml": true
      }
    });

    it('should apply metadata using the second parser', function() {
      assert.equal(this.result["file_one.md"].testKey, "File one value");
    });

    it('should remove metadata files for the second parser', function() {
      assert.equal(this.result["file_one.md.meta.yaml"], undefined);
    });

    it('should still apply json-formatted metadata from *.meta.json files', function() {
      assert.equal(this.result["file_two.md"].testKey, "File two value");
    });

    it('should still remove *.meta.json files', function() {
      assert.equal(this.result["file_two.md.meta.json"], undefined);
    });
  });


  context("when the .json parser is disabled", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/yaml_metafiles', {
      parsers: {
        ".json": false
      }
    });

    it('should not apply metadata from *.meta.json files', function() {
      assert.equal(this.result["file_two.md"].testKey, undefined);
    });

    it('should not remove *.meta.json files', function() {
      assert.notEqual(this.result["file_two.md.meta.json"], undefined);
    });
  });

  context("with the extension .custom set to be parsed with js-yaml", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/custom_extension', {
      parsers: {
        ".custom": 'js-yaml'
      }
    });

    it('should apply yaml-formatted metadata from *.meta.custom files', function() {
      assert.equal(this.result["file.md"].testKey, "Test value");
    });

    it('should remove *.meta.custom files', function() {
      assert.equal(this.result["file.md.meta.custom"], undefined);
    });
  });

  context("with the extension .custom set to a custom parser", function() {
    var fixture = 'test/fixtures/custom_parser';

    it('should pass the contents of the file to the custom parser function', function() {
      return runMetalsmithMetafiles(fixture, {
        parsers: {
          ".custom": function(content) {
            assert.equal(content.toString(), "Random content\n");
            return {};
          }
        }
      });
    });

    it('should pass the full path to the file to the custom parser function', function() {
      return runMetalsmithMetafiles(fixture, {
        parsers: {
          ".custom": function(content, options) {
            assert(
              options,
              "Should pass options object"
            );
            assert(
              options.path,
              "Options object should have path property"
            );
            assert(
              options.path.match(/^subdir\/file\.md\.meta\.custom$/),
              "Path '" + options.path + "' should contain the path to the file"
            );
            return {};
          }
        }
      });
    });

    it('should apply the metadata returned from the parser function', function() {
      return runMetalsmithMetafiles(fixture, {
        parsers: {
          ".custom": function(content, options) {
            return {"testKey": "Test value"};
          }
        }
      }).then(function(files) {
        assert.equal(files["subdir/file.md"].testKey, "Test value");
      });
    });

    it('should remove *.meta.custom files', function() {
      return runMetalsmithMetafiles(fixture, {
        parsers: {
          ".custom": function(content, options) {
            return {};
          }
        }
      }).then(function(files){
        assert.equal(files["file.md.meta.custom"], undefined);
      });
    });
  });

  context("with the extension .custom set to parse YAML metadata files with a custom prefix", function() {
    runMetalsmithMetafilesBeforeEach('test/fixtures/per_parser_config', {
      parsers: {
        '.custom': {
          parser: "js-yaml",
          prefix: 'm-',
        }
      },
    });

    it('should apply YAML metadata from m-*.meta.custom files', function() {
      assert.equal(this.result["file_one.md"].testKey, "File one value");
    });

    it('should remove m-*.meta.custom files', function() {
      assert.equal(this.result["m-file_one.md.meta.custom"], undefined);
    });

    it('should still apply json-formatted metadata from *.meta.json files', function() {
      assert.equal(this.result["file_two.md"].testKey, "File two value");
    });

    it('should still remove *.meta.json files', function() {
      assert.equal(this.result["file_two.md.meta.json"], undefined);
    });
  });

  describe("named parsers", function() {
    function testParser(parserName) {
      describe(parserName, function() {
        context("when " + parserName + " is set as the parser for *.meta.custom files", function() {
          runMetalsmithMetafilesBeforeEach('test/fixtures/named_parsers/' + parserName, {
            parsers: {
              ".custom": parserName
            }
          });

          it('should apply correctly formatted metadata in *.meta.custom files', function() {
            assert.equal(this.result["file.md"].testKey, "Test value");
          });

          it('should remove *.meta.custom files', function() {
            assert.equal(this.result["file.md.meta.custom"], undefined);
          });
        });
      });
    }

    [
      "JSON.parse",
      "js-yaml",
      "eval",
      "require",
      "eval-wrapped",
      "coffee-script",
      "toml",
    ].forEach(testParser);
  });

  describe("default parsers", function() {
    function testDefaultParser(extension) {
      describe("." + extension, function() {
        context("when the default parser for *.meta." + extension + " files is enabled", function() {
          // In the future, use ES6 computed property names instead
          var enabledParsers = {};
          enabledParsers["." + extension] = true;

          runMetalsmithMetafilesBeforeEach('test/fixtures/default_parsers/' + extension, {
            parsers: enabledParsers
          });

          it("should apply correctly formatted metadata in *.meta." + extension + " files", function() {
            assert.equal(this.result["file.md"].testKey, "Test value");
          });

          it("should remove *.meta." + extension + " files", function() {
            assert.equal(this.result["file.md.meta." + extension], undefined);
          });
        });
      });
    }

    [
      "json",
      "yaml",
      "yml",
      "js",
      "coffee",
      "cson",
      "toml",
    ].forEach(testDefaultParser);
  });
});
