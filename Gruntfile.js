module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist:[
                'public/js/',
                'public/css/',
                'public/img/'
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
        uglify: {
            js: {
                src: ['public/js/yezbot.js'],
                dest: 'public/js/yezbot.js'
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-rollup');

    grunt.registerTask('default', ['watch']);

    grunt.registerTask('dev', [
        'clean',
        'compass:dev',
        'rollup'
    ]);

    grunt.registerTask('prod', [
        'clean',
        'copy',
        'compass:prod',
        'concat',
        'uglify'
    ]);
};