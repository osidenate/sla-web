'use strict';

module.exports = function(grunt) {
    var slaConfig = {
        src: 'src/',
        dist: 'dist/',
        scripts: 'src/components/',
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
                sourceMap: false,
                module: 'amd'
            },
            dist: {
                src: '<%= sla.dist %>components/app.ts'
            }
        },

        clean: {
            tsd: '<%= sla.tsd %>**/*',
            dist: '<%= sla.dist %>**/*',
            package: [
                '<%= sla.dist %>typings',
                '<%= sla.dist %>components/**/*.ts',
                '<%= sla.dist %>bower_components'
            ]
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= sla.src %>',
                    src: '**/*',
                    dest: '<%= sla.dist %>'
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: '<%= sla.src %>bower_components/bootstrap/dist/fonts/',
                    src: '**/*',
                    dest: '<%= sla.dist %>fonts/'
                }]
            }
        },

        useminPrepare: {
            html: '<%= sla.dist %>latency-monitor-demo.htm'
        },

        usemin: {
            html: '<%= sla.dist %>latency-monitor-demo.htm'
        }
    });

    grunt.registerTask('setup', ['clean:tsd', 'tsd']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'ts:dist']);
    grunt.registerTask('server', ['build', 'connect:dev', 'watch:server']);
    grunt.registerTask('package', ['build', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin', 'copy:fonts', 'clean:package']);
    grunt.registerTask('default', ['build']);
};
