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
                    sassDir: 'src/scss/',
                    cssDir: 'public/css/',
                    imagesDir: 'public/img/',
                    fontsDir: 'public/fonts/',
                    spriteLoadPath: 'src/img/',
                    httpGeneratedImagesPath: "../img/",
                    httpFontsPath: "../fonts/",
                    specify: 'src/scss/yehbot.scss'
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
                    specify: 'src/scss/yehbot.scss',
                    environment: 'production'
                }
            }
        },
        concat: {
            dist: {
                files: [{
                    src: ['src/js/**'],
                    dest: 'public/js/yehbot.js',
                    filter: 'isFile'
                }]
            }
        },
        uglify: {
            js: {
                src: ['public/js/yehbot.js'],
                dest: 'public/js/yehbot.js'
            }
        },
        watch: {
            css: {
                files: ['src/**/*.scss'],
                tasks: ['compass:dev']
            },
            img: {
                files: [
                    'src/**/*.jpg',
                    'src/**/*.png'
                ],
                tasks: ['copy']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);

    grunt.registerTask('dev', [
        'clean',
        'compass:dev',
        'concat'
    ]);

    grunt.registerTask('prod', [
        'clean',
        'copy',
        'compass:prod',
        'concat',
        'uglify'
    ]);
};