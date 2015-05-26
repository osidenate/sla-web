'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        tsd: {
            refresh: {
                options: {
                    // execute a command
                    command: 'reinstall',

                    //optional: always get from HEAD
                    latest: true,

                    // specify config file
                    config: 'tsd.json',

                    // experimental: options to pass to tsd.API
                    opts: {
                        // props from tsd.Options
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-tsd');

    grunt.registerTask('build', ['tsd']);
    grunt.registerTask('default', ['build']);

};
