'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        tsd: {
            refresh: {
                options: {
                    command: 'reinstall',
                    latest: true,
                    config: 'tsd.json'
                }
            }
        },
        ts: {
            options: {
                compile: true,                  // perform compilation. [true (default) | false]
                comments: false,                // same as !removeComments. [true | false (default)]
                target: 'es5',                  // target javascript language. [es3 (default) | es5]
                declaration: false              // generate a declaration .d.ts file for every output js file. [true | false (default)]
            },
            clientMain: {
                src: 'src/scripts/app.ts',
                out: 'src/scripts/app.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tsd');

    grunt.registerTask('setup', ['tsd']);
    grunt.registerTask('build', ['ts:clientMain']);
    grunt.registerTask('default', ['build']);
};
