module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    mochaTest: {
      test: {
        src: ['test/**/*.js']
      }
    },
    jshint: {
      code: ['Gruntfile.js', 'lib/**/*.js'],
      tests: ['test/**/*.js'],
      options: {
        jshintrc: true,
      },
    }
  });

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('default', ['test', 'lint']);
};
