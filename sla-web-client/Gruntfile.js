'use strict';

module.exports = function(grunt) {
    var slaConfig = {
        src: 'src/',
        dist: 'dist/',
        scripts: 'src/scripts/',
        tsd: 'src/typings/'
    };

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sla: slaConfig,

        connect: {
            dev: {
                options: {
                    port: 3200,
                    base: {
                        path: 'dist',
                        options: {
                            index: 'index.htm'
                        }
                    }
                }
            }
        },

        watch: {
            // Rebuild project every time a file changes
            server: {
                files: ['<%= sla.src %>**/*'],
                tasks: ['build']
            }
        },

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
                    cwd: '<%= sla.src %>',
                    dest: '<%= sla.dist %>',
                    src: '**/*'
                }]
            }
        }
    });

    grunt.registerTask('setup', ['clean:tsd', 'tsd']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'ts:dist']);
    grunt.registerTask('server', ['build', 'connect:dev', 'watch:server']);
    grunt.registerTask('package', ['build', 'clean:package']);
    grunt.registerTask('default', ['build']);
};
