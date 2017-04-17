var assert = require('assert');
var set = require('mocha-let');
var Metalsmith = require('metalsmith');
var metafiles = require('../lib');
require('co-mocha');

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
  set('result', function() {
    return runMetalsmithMetafiles(this.fixture, this.options);
  });
  set('options', undefined);
  set('fixture', 'test/fixtures/basic');

  it('should apply metadata from metadata files', function*() {
    var files = yield this.result;
    assert.equal(files["index.md"].testKey, "Some value");
  });

  it('should remove metadata files', function*() {
    var files = yield this.result;
    assert.equal(files["index.md.meta.json"], undefined);
  });

  // Regression test
  it("should not apply metadata from files with a postfix that isn't `.meta.json`, but has the same length", function*() {
    this.fixture = 'test/fixtures/wrong_postfix';
    var files = yield this.result;
    assert.equal(files["index.md"].testKey, undefined);
  });

  context("when encountering a metadata file with no corresponding main file", function() {
    set('fixture', 'test/fixtures/missing_main_file');

    it('should throw an error', function*() {
      try {
        yield this.result;
      } catch (e) {
        return; // Success! Expected error.
      }
      throw new Error("Expected build to fail, but it succeeded!");
    });

    context("when the onMissingMainFile option is set to 'ignore'", function() {
      set('options', {
        onMissingMainFile: 'ignore',
      });

      it('should ignore the file', function() {
        return this.result; // No errors
      });
      it('should not delete the file', function*() {
        var files = yield this.result;
        assert.notEqual(files['index.md.meta.json'], undefined);
      });
    });

    context("when the onMissingMainFile option is set to 'delete'", function() {
      set('options', {
        onMissingMainFile: 'delete',
      });

      it('should ignore the file', function() {
        return this.result; // No errors
      });
      it('should delete the file', function*() {
        var files = yield this.result;
        assert.equal(files['index.md.meta.json'], undefined);
      });
    });

    context("when the onMissingMainFile option is set to 'throw'", function() {
      set('options', {
        onMissingMainFile: 'throw',
      });

      it('should throw an error', function*() {
        try {
          yield this.result;
        } catch (e) {
          return; // Success! Expected error.
        }
        throw new Error("Expected build to fail, but it succeeded!");
      });
    });
  });

  context("when the onMissingMainFile option is set to an invalid value", function() {
    set('options', {
      onMissingMainFile: 'asdf',
    });

    it('should throw an error', function*() {
      try {
        yield this.result;
      } catch (e) {
        return; // Success! Expected error.
      }
      throw new Error("Expected build to fail, but it succeeded!");
    });
  });

  context("when the deleteMetaFiles option is set to false", function() {
    set('options', {
      deleteMetaFiles: false,
    });

    it('should not remove metadata files', function*() {
      var files = yield this.result;
      assert.notEqual(files["index.md.meta.json"], undefined);
    });
  });

  context("when the postfix option is set to '.custom'", function() {
    set('fixture', 'test/fixtures/custom_postfix');
    set('options', {
      postfix: '.custom',
    });

    it('should apply metadata from *.custom.json files', function*() {
      var files = yield this.result;
      assert.equal(files["index.md"].testKey, "Some value");
    });

    it('should remove *.custom.json files', function*() {
      var files = yield this.result;
      assert.equal(files["index.md.custom.json"], undefined);
    });

    it('should not apply metadata from *.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["index.md"].otherKey, undefined);
    });

    it('should not remove *.meta.json files', function*() {
      var files = yield this.result;
      assert.notEqual(files["index.md.meta.json"], undefined);
    });
  });

  context("when the prefix option is set to 'm-'", function() {
    set('fixture', 'test/fixtures/custom_prefix');
    set('options', {
      prefix: 'm-',
    });

    it('should apply metadata from m-*.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["index.md"].testKey, "Correct value");
    });

    it('should remove m-*.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["m-index.md.meta.json"], undefined);
    });

    it('should not apply metadata from files without the "m-" prefix', function*() {
      var files = yield this.result;
      assert.equal(files["index.md"].otherKey, undefined);
    });

    it('should not remove files without the "m-" prefix', function*() {
      var files = yield this.result;
      assert.notEqual(files["index.md.meta.json"], undefined);
    });
  });

  context("when another parser is enabled", function() {
    set('fixture', 'test/fixtures/yaml_metafiles');
    set('options', {
      parsers: {
        ".yaml": true
      }
    });

    it('should apply metadata using the second parser', function*() {
      var files = yield this.result;
      assert.equal(files["file_one.md"].testKey, "File one value");
    });

    it('should remove metadata files for the second parser', function*() {
      var files = yield this.result;
      assert.equal(files["file_one.md.meta.yaml"], undefined);
    });

    it('should still apply json-formatted metadata from *.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["file_two.md"].testKey, "File two value");
    });

    it('should still remove *.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["file_two.md.meta.json"], undefined);
    });
  });


  context("when the .json parser is disabled", function() {
    set('fixture', 'test/fixtures/yaml_metafiles');
    set('options', {
      parsers: {
        ".json": false
      }
    });

    it('should not apply metadata from *.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["file_two.md"].testKey, undefined);
    });

    it('should not remove *.meta.json files', function*() {
      var files = yield this.result;
      assert.notEqual(files["file_two.md.meta.json"], undefined);
    });
  });

  context("with the extension .custom set to be parsed with js-yaml", function() {
    set('fixture', 'test/fixtures/custom_extension');
    set('options', {
      parsers: {
        ".custom": 'js-yaml'
      }
    });

    it('should apply yaml-formatted metadata from *.meta.custom files', function*() {
      var files = yield this.result;
      assert.equal(files["file.md"].testKey, "Test value");
    });

    it('should remove *.meta.custom files', function*() {
      var files = yield this.result;
      assert.equal(files["file.md.meta.custom"], undefined);
    });
  });

  context("with the extension .custom set to a custom parser", function() {
    set('fixture', 'test/fixtures/custom_parser');
    set('options', function() {
      return {
        parsers: {
          ".custom": this.customParserFunction
        }
      };
    });
    set('customParserFunction', function() {
      return function(content, options) {
        return {};
      };
    });

    it('should pass the contents of the file to the custom parser function', function*() {
      this.customParserFunction = function(content) {
        assert.equal(content.toString(), "Random content\n");
        return {};
      };
      yield this.result;
    });

    it('should pass the full path to the file to the custom parser function', function*() {
      this.customParserFunction = function(content, options) {
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
      };
      yield this.result;
    });

    it('should apply the metadata returned from the parser function', function*() {
      this.customParserFunction = function(content, options) {
        return {"testKey": "Test value"};
      };
      var files = yield this.result;
      assert.equal(files["subdir/file.md"].testKey, "Test value");
    });

    it('should remove *.meta.custom files', function*() {
      var files = yield this.result;
      assert.equal(files["file.md.meta.custom"], undefined);
    });
  });

  context("with the extension .custom set to parse YAML metadata files with a custom prefix", function() {
    set('fixture', 'test/fixtures/per_parser_config');
    set('options', {
      parsers: {
        '.custom': {
          parser: "js-yaml",
          prefix: 'm-',
        }
      },
    });

    it('should apply YAML metadata from m-*.meta.custom files', function*() {
      var files = yield this.result;
      assert.equal(files["file_one.md"].testKey, "File one value");
    });

    it('should remove m-*.meta.custom files', function*() {
      var files = yield this.result;
      assert.equal(files["m-file_one.md.meta.custom"], undefined);
    });

    it('should still apply json-formatted metadata from *.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["file_two.md"].testKey, "File two value");
    });

    it('should still remove *.meta.json files', function*() {
      var files = yield this.result;
      assert.equal(files["file_two.md.meta.json"], undefined);
    });
  });

  describe("named parsers", function() {
    function testParser(parserName) {
      describe(parserName, function() {
        context("when " + parserName + " is set as the parser for *.meta.custom files", function() {
          set('fixture', 'test/fixtures/named_parsers/' + parserName);
          set('options', {
            parsers: {
              ".custom": parserName
            }
          });

          it('should apply correctly formatted metadata in *.meta.custom files', function*() {
            var files = yield this.result;
            assert.equal(files["file.md"].testKey, "Test value");
          });

          it('should remove *.meta.custom files', function*() {
            var files = yield this.result;
            assert.equal(files["file.md.meta.custom"], undefined);
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

          set('fixture', 'test/fixtures/default_parsers/' + extension);
          set('options', {
            parsers: enabledParsers
          });

          it("should apply correctly formatted metadata in *.meta." + extension + " files", function*() {
            var files = yield this.result;
            assert.equal(files["file.md"].testKey, "Test value");
          });

          it("should remove *.meta." + extension + " files", function*() {
            var files = yield this.result;
            assert.equal(files["file.md.meta." + extension], undefined);
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
