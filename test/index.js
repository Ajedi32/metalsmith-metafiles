var assert = require('assert');
var Metalsmith = require('metalsmith');
var metafiles = require('../lib');

describe('metalsmith-metafiles', function(){
  it('should apply metadata from metadata files', function(done){
    Metalsmith('test/fixtures/basic')
      .use(metafiles())
      .build(function(err, files){
        if (err) return done(err);
        assert.equal(files["index.md"].testKey, "Some value");
        done();
      });
  });

  it('should remove metadata files', function(done){
    Metalsmith('test/fixtures/basic')
      .use(metafiles())
      .build(function(err, files){
        if (err) return done(err);
        assert.equal(files["index.md.meta.json"], undefined);
        done();
      });
  });

  // Regression test
  it("should not apply metadata from files with a postfix that isn't `.meta.json`, but has the same length", function(done){
    Metalsmith('test/fixtures/wrong_postfix')
      .use(metafiles())
      .build(function(err, files){
        if (err) return done(err);
        assert.equal(files["index.md"].testKey, undefined);
        done();
      });
  });

  context("when the deleteMetaFiles option is set to false", function(){
    it('should not remove metadata files', function(done){
      Metalsmith('test/fixtures/basic')
        .use(metafiles({
          deleteMetaFiles: false
        }))
        .build(function(err, files){
          if (err) return done(err);
          assert.notEqual(files["index.md.meta.json"], undefined);
          done();
        });
    });
  });

  context("when the postfix option is set to '.custom'", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/custom_postfix')
        .use(metafiles({
          postfix: '.custom'
        }));
    });

    it('should apply metadata from *.custom.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["index.md"].testKey, "Some value");
          done();
        });
    });

    it('should remove *.custom.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["index.md.custom.json"], undefined);
          done();
        });
    });

    it('should not apply metadata from *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["index.md"].otherKey, undefined);
          done();
        });
    });

    it('should not remove *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.notEqual(files["index.md.meta.json"], undefined);
          done();
        });
    });
  });

  context("when the prefix option is set to 'm-'", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/custom_prefix')
        .use(metafiles({
          prefix: 'm-'
        }));
    });

    it('should apply metadata from m-*.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["index.md"].testKey, "Correct value");
          done();
        });
    });

    it('should remove m-*.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["m-index.md.meta.json"], undefined);
          done();
        });
    });

    it('should not apply metadata from files without the "m-" prefix', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["index.md"].otherKey, undefined);
          done();
        });
    });

    it('should not remove files without the "m-" prefix', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.notEqual(files["index.md.meta.json"], undefined);
          done();
        });
    });
  });

  context("when another parser is enabled", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/yaml_metafiles')
        .use(metafiles({
          parsers: {
            ".yaml": true
          }
        }));
    });

    it('should apply metadata using the second parser', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_one.md"].testKey, "File one value");
        done();
      });
    });

    it('should remove metadata files for the second parser', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_one.md.meta.yaml"], undefined);
        done();
      });
    });

    it('should still apply json-formatted metadata from *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md"].testKey, "File two value");
        done();
      });
    });

    it('should still remove *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md.meta.json"], undefined);
        done();
      });
    });
  });


  context("when the .json parser is disabled", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/yaml_metafiles')
        .use(metafiles({
          parsers: {
            ".json": false
          }
        }));
    });

    it('should not apply metadata from *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md"].testKey, undefined);
        done();
      });
    });

    it('should not remove *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.notEqual(files["file_two.md.meta.json"], undefined);
        done();
      });
    });
  });

  context("with the extension .custom set to be parsed with js-yaml", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/custom_extension')
        .use(metafiles({
          parsers: {
            ".custom": 'js-yaml'
          }
        }));
    });

    it('should apply yaml-formatted metadata from *.meta.custom files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file.md"].testKey, "Test value");
        done();
      });
    });

    it('should remove *.meta.custom files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file.md.meta.custom"], undefined);
        done();
      });
    });
  });

  context("with the extension .custom set to a custom parser", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/custom_parser');
    });

    it('should pass the contents of the file to the custom parser function', function(done){
      this.metalsmith.use(metafiles({
        parsers: {
          ".custom": function(content) {
            assert.equal(content.toString(), "Random content\n");
            return {};
          }
        }
      })).build(function(err, files){
        if (err) return done(err);
        done();
      });
    });

    it('should pass the full path to the file to the custom parser function', function(done){
      this.metalsmith.use(metafiles({
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
      })).build(function(err, files){
        if (err) return done(err);
        done();
      });
    });

    it('should apply the metadata returned from the parser function', function(done){
      this.metalsmith.use(metafiles({
        parsers: {
          ".custom": function(content, options) {
            return {"testKey": "Test value"};
          }
        }
      })).build(function(err, files){
        if (err) return done(err);
        assert.equal(files["subdir/file.md"].testKey, "Test value");
        done();
      });
    });

    it('should remove *.meta.custom files', function(done){
      this.metalsmith.use(metafiles({
        parsers: {
          ".custom": function(content, options) {
            return {};
          }
        }
      })).build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file.md.meta.custom"], undefined);
        done();
      });
    });
  });

  context("with the extension .custom set to parse YAML metadata files with a custom prefix", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/per_parser_config')
        .use(metafiles({
          parsers: {
            '.custom': {
              parser: "js-yaml",
              prefix: 'm-',
            }
          },
        }));
    });

    it('should apply YAML metadata from m-*.meta.custom files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_one.md"].testKey, "File one value");
        done();
      });
    });

    it('should remove m-*.meta.custom files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["m-file_one.md.meta.custom"], undefined);
        done();
      });
    });

    it('should still apply json-formatted metadata from *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md"].testKey, "File two value");
        done();
      });
    });

    it('should still remove *.meta.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md.meta.json"], undefined);
        done();
      });
    });
  });

  describe("named parsers", function(){
    function testParser(parserName) {
      describe(parserName, function() {
        context("when " + parserName + " is set as the parser for *.meta.custom files", function() {
          beforeEach(function() {
            this.metalsmith = Metalsmith('test/fixtures/named_parsers/' + parserName)
              .use(metafiles({
                parsers: {
                  ".custom": parserName
                }
              }));
          });

          it('should apply correctly formatted metadata in *.meta.custom files', function(done){
            this.metalsmith.build(function(err, files){
              if (err) return done(err);
              assert.equal(files["file.md"].testKey, "Test value");
              done();
            });
          });

          it('should remove *.meta.custom files', function(done){
            this.metalsmith.build(function(err, files){
              if (err) return done(err);
              assert.equal(files["file.md.meta.custom"], undefined);
              done();
            });
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
    ].forEach(testParser);
  });

  describe("default parsers", function(){
    function testDefaultParser(extension) {
      describe("." + extension, function() {
        context("when the default parser for *.meta." + extension + " files is enabled", function() {
          beforeEach(function() {
            var enabledParsers = {};
            enabledParsers["." + extension] = true;

            this.metalsmith = Metalsmith('test/fixtures/default_parsers/' + extension)
              .use(metafiles({
                parsers: enabledParsers
              }));
          });

          it("should apply correctly formatted metadata in *.meta." + extension + " files", function(done){
            this.metalsmith.build(function(err, files){
              if (err) return done(err);
              assert.equal(files["file.md"].testKey, "Test value");
              done();
            });
          });

          it("should remove *.meta." + extension + " files", function(done){
            this.metalsmith.build(function(err, files){
              if (err) return done(err);
              assert.equal(files["file.md.meta." + extension], undefined);
              done();
            });
          });
        });
      });
    }

    [
      "json",
      "yaml",
      "js"
    ].forEach(testDefaultParser);
  });
});
