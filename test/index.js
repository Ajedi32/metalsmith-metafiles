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

  context("when the .yaml parser is enabled", function(){
    beforeEach(function() {
      this.metalsmith = Metalsmith('test/fixtures/yaml_metafiles')
        .use(metafiles({
          parsers: {
            ".yaml": true
          }
        }));
    });

    it('should apply yaml-formatted metadata from *.meta.yaml files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_one.md"].testKey, "File one value");
        done();
      });
    });

    it('should remove *.meta.yaml files', function(done){
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
});
