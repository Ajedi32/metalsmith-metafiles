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
});
