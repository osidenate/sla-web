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
                src: '<%= sla.dist %>components/**/*.ts'
            }
        },

        clean: {
            tsd: '<%= sla.tsd %>**/*',
            dist: '<%= sla.dist %>**/*',
            package: [
                '<%= sla.dist %>typings',
                '<%= sla.dist %>components/**/*.css',
                '<%= sla.dist %>components/**/*.ts',
                '<%= sla.dist %>components/**/*.js',
                '<%= sla.dist %>bower_components',
                '<%= sla.dist %>index.htm',
                '.tmp'
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
            // Grabs a copy of the concatenated JS and CSS before they are minified
            concat: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/',
                    src: [
                        'latency-monitor.min.js',
                        'latency-monitor.min.css'
                    ],
                    dest: '<%= sla.dist %>/',
                    rename: function(dest, src) {
                        return dest + src.replace('.min', '');
                    }
                }]
            }
        },

        useminPrepare: {
            html: '<%= sla.dist %>index.htm'
        },

        usemin: {
            html: '<%= sla.dist %>index.htm'
        }
    });

    grunt.registerTask('setup', ['clean:tsd', 'tsd']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'ts:dist']);
    grunt.registerTask('server', ['build', 'connect:dev', 'watch:server']);
    grunt.registerTask('package', [
        'build',
        'useminPrepare',
        'concat:generated',
        'copy:concat',
        'cssmin:generated',
        'uglify:generated',
        'usemin',
        'clean:package'
    ]);
};
