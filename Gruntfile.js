/*global module:false*/
module.exports = function(grunt) {

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    aws: grunt.file.readJSON('grunt-aws.json'),
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      main: {
        src: ['src/js/main.js'],
        dest: 'build/js/main.js'
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/html/',
          src: ['**'],
          dest: 'deploy/'
        }]
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/js/**/*.js'],
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
          src: 'deploy/**/*.*',
          dest: '/',
          rel: 'deploy/'
        }]
      }
    },
    sass: {
      options: {
        style: 'compressed'
      },
      main: {
        files: {
          'deploy/css/style.css': 'src/scss/style.scss'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '(c) David Hayes - ' +
                'Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      main: {
        files: {
          'deploy/js/main.min.js': ['build/js/main.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/js/**/*.js', 'src/scss/**/*.scss', 'src/html/**/*.html'],
        tasks: ['build']
      }
    }
  });

  // Default task.
  grunt.registerTask('build', ['jshint', 'copy', 'sass', 'browserify', 'uglify']);
  grunt.registerTask('deploy', ['build', 's3']);
};
