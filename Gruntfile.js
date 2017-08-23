module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist:[
                'public'
            ]
        },
        compass: {
            dev: {
                options: {
                    specify: 'src/scss/*.scss',
                    sassDir: 'src/scss/',
                    cssDir: 'public/css/',
                    imagesDir: 'public/img/',
                    fontsDir: 'public/fonts/',
                    spriteLoadPath: 'src/img/',
                    httpGeneratedImagesPath: "../img/",
                    httpFontsPath: "../fonts/",
                }
            },
            prod: {
                options: {
                    sassDir: 'src/scss/',
                    cssDir: 'public/css/',
                    imagesDir: 'public/img/',
                    fontsDir: 'public/fonts/',
                    spriteLoadPath: 'src/img/',
                    httpGeneratedImagesPath: "../img/",
                    httpFontsPath: "../fonts/",
                    environment: 'production'
                }
            }
        },
        rollup: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/js/',
                    src: '*',
                    dest: 'public/js/',
                    filter: 'isFile'
                }]
            }
        },
        copy: {
            tpl: {
                files: [{
                    expand: true,
                    cwd: 'src/tpl/',
                    src: '*',
                    dest: 'public/'
                }]
            }
        },
        uglify: {
            js: {
                src: 'public/js/yezbot.js',
                dest: 'public/js/yezbot.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-rollup');

    grunt.registerTask('default', ['dev']);

    grunt.registerTask('dev', [
        'clean',
        'compass:dev',
        'rollup',
        'copy'
    ]);

    grunt.registerTask('prod', [
        'clean',
        'compass:prod',
        'concat',
        'uglify'
    ]);
};