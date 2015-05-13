/*
 * grunt-zyg-link
 * https://github.com/zyg/grunt-zyg-link
 *
 * Copyright (c) 2015 zhou-yg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    zyg_link: {
      default_options: {
        options: {
          startTag:'<!-- links start -->',
          endTag:'<!-- links end -->',
          fileTmpLink:'<a href="%s">%t</a><br><br>'
        },
        files: {
          'test/fixtures/index.html': ['test/fixtures/form/*.html', 'test/fixtures/serverSendEvent/**/*.html'],
//          'test/fixtures/index.html': ['test/fixtures/serverSendEvent/**/*.html'],
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'zyg_link', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
