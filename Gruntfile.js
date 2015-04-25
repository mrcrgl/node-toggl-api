'use strict';

var path = require('path');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-apimocker');

    var fileList = ['lib/**/*.js', 'test/**/*.js'];

    grunt.initConfig({
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: 'coverage/instrument'
            }
        },

        mochaTest: {
            unit: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/unit-*.js']
            },
            integration: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['test/integration-*.js']
            }
        },

        mocha_istanbul: {
            coverage: {
                src: ['test'],
                options: {
                    coverage: true,
                    coverageFolder: path.join('coverage', 'reports'),
                    mask: '*.js',
                    root: 'lib',
                    mochaOptions: ['-R', 'spec', '--recursive']
                }
            }
        },

        clean: {
            coverage: {
                src: ['coverage/']
            }
        },

        apimocker: {
            options: {
                configFile: 'fixtures/apimocker.json'
            }
        },

        instrument: {
            files: ['lib/**/*.js', 'data/*.js'],
            options: {
                lazy: true,
                basePath: 'coverage/instrument/'
            }
        },

        storeCoverage: {
            options: {
                dir: 'coverage/reports'
            }
        },

        makeReport: {
            src: 'coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'coverage/reports',
                print: 'detail'
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            all: fileList
        },

        jsdoc : {
            dist : {
                src: ['src/**/*.js'],
                jsdoc: './node_modules/.bin/jsdoc',
                options: {
                    destination: 'doc/api',
                    configure: './node_modules/grunt-jsdoc/node_modules/jsdoc/conf.json',
                    template: './node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'
                }
            }
        }
    });

    grunt.event.on('coverage', function (lcov, done) {
        require('coveralls').handleInput(lcov, function (err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    grunt.registerTask('test', [
        'jshint', 'apimocker', 'mochaTest:unit', 'mochaTest:integration'
    ]);

    grunt.registerTask('test:unit', [
        'jshint', 'mochaTest:unit'
    ]);

    grunt.registerTask('test:integration', [
        'jshint', 'apimocker', 'mochaTest:integration'
    ]);

    grunt.registerTask('coveralls', ['mocha_istanbul:coveralls']);
    grunt.registerTask('coverage', ['jshint', 'env:coverage', 'apimocker', 'mocha_istanbul:coverage',
        'makeReport']);
};
