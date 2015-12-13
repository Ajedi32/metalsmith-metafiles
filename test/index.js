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
        assert.equal(files["index.md.metadata.json"], undefined);
        done();
      });
  });

  // Regression test
  it("should not apply metadata from files with a postfix that isn't `.metadata.json`, but has the same length", function(done){
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
          assert.notEqual(files["index.md.metadata.json"], undefined);
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

    it('should not apply metadata from *.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["index.md"].otherKey, undefined);
          done();
        });
    });

    it('should not remove *.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.notEqual(files["index.md.metadata.json"], undefined);
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

    it('should apply metadata from m-*.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["index.md"].testKey, "Correct value");
          done();
        });
    });

    it('should remove m-*.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
          if (err) return done(err);
          assert.equal(files["m-index.md.metadata.json"], undefined);
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
          assert.notEqual(files["index.md.metadata.json"], undefined);
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

    it('should apply yaml-formatted metadata from *.metadata.yaml files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_one.md"].testKey, "File one value");
        done();
      });
    });

    it('should remove *.metadata.yaml files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_one.md.metadata.yaml"], undefined);
        done();
      });
    });

    it('should still apply json-formatted metadata from *.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md"].testKey, "File two value");
        done();
      });
    });

    it('should still remove *.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md.metadata.json"], undefined);
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

    it('should not apply metadata from *.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.equal(files["file_two.md"].testKey, undefined);
        done();
      });
    });

    it('should not remove *.metadata.json files', function(done){
      this.metalsmith.build(function(err, files){
        if (err) return done(err);
        assert.notEqual(files["file_two.md.metadata.json"], undefined);
        done();
      });
    });
  });
});
