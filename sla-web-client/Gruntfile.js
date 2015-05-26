'use strict';

module.exports = function(grunt) {
    var slaConfig = {
        app: 'src/',
        dist: 'dist/',
        scripts: 'src/scripts/',
        tsd: 'src/typings/'
    };

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sla: slaConfig,

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
                compile: true,
                comments: false,
                target: 'es5',
                declaration: false,
                sourceMap: false
            },
            clientMain: {
                src: '<%= sla.scripts %>app.ts'
            }
        },

        clean: {
            tsd: '<%= sla.tsd %>/**/*',
            dist: '<%= sla.dist %>**/*'
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= sla.app %>',
                    dest: '<%= sla.dist %>',
                    src: [
                        '**/*',
                        '!typings',
                        '!typings/**/*',
                        '!scripts/**/*.ts'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('setup', ['clean:tsd', 'tsd']);

    grunt.registerTask('build', ['clean:dist', 'ts:clientMain', 'copy:dist']);
    grunt.registerTask('default', ['build']);
};
