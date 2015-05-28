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
            dist: {
                src: '<%= sla.dist %>/scripts/app.ts'
            }
        },

        clean: {
            tsd: '<%= sla.tsd %>/**/*',
            dist: '<%= sla.dist %>**/*',
            package: [
                '<%= sla.dist %>typings',
                '<%= sla.dist %>scripts/**/*.ts'
            ]
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= sla.app %>',
                    dest: '<%= sla.dist %>',
                    src: '**/*'

                }]
            }
        }
    });

    grunt.registerTask('setup', ['clean:tsd', 'tsd']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'ts:dist']);
    grunt.registerTask('default', ['build']);
};
