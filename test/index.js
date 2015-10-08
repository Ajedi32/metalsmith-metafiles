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
});
