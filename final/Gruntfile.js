/* global module:false */
module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // configurable vars
  var port = grunt.option('port') || 8000;
  var base = grunt.option('base') || '.';

  // Project configuration
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: port,
          base: base,
          livereload: true,
          open: true
        }
      }
    },

    watch: {
      js: {
        files: [ 'src/**/*.js' ]
      },
      css: {
        files: [ 'css/**/*.css' ]
      },
      html: {
        files: [ '*.html']
      },
      markdown: {
        files: [ '*.md' ]
      },
      options: {
        livereload: true
      }
    },

    jshint : {
      options : {
        jshintrc : '.jshintrc'
      },
      all : [
        'src/**/*.js',
        '!src/lib/**/*.js'
      ]
    }
  });

  // Default task
  grunt.registerTask( 'default', [ 'serve' ] );

  // Serve presentation locally
  grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

  // Tasks
  grunt.registerTask('check', [ 'jshint' ]);
};