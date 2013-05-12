/*global module:false*/
module.exports = function(grunt) {

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');

  // Project configuration.
  grunt.initConfig({
    aws: grunt.file.readJSON('grunt-aws.json'),
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/html/',
          src: ['**'],
          dest: 'build/'
        }]
      }
    },
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: 'drhayes.io',
        access: 'public-read'
      },
      main: {
        upload: [{
          src: 'build/**/*.*',
          dest: '/'
        }]
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        browser: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'jshint');

  grunt.registerTask('build', ['jshint', 'copy', 's3'])
};
