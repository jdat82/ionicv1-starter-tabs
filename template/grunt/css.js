'use strict';

//var sassFiles = {
//    '<%= pub %>/css/app.css': ['<%= tmp %>/**/*.scss']
//};

module.exports = function () {

    return {
        tasks: {

            //copy: {
            //    cssVendor: {
            //        files: [
            //            {
            //                dest: '<%= pub %>/css/',
            //                src: [],
            //                expand: true,
            //                flatten: true,
            //                cwd: 'vendor'
            //            }
            //        ]
            //    }
            //},

            // Generate the final CSS file.
            sass: {
                options: {
                    style: 'expanded',
                    sourceMap: true
                },
                app: {
                    files: {
                        '<%= pub %>/css/app.css': ['<%= tmp %>/app.scss']
                    }
                }
            },

            // Include all partials inside _partials.scss in order to have only one file to rule them all.
            sass_compile_imports: {
                app: {
                    options: {
                        removeExtension: true
                    },
                    target: '<%= tmp %>/_partials.scss',
                    files: [{
                        src: [
                            '<%= src %>/_ionic.app.scss',
                            '<%= src %>/**/_variables.scss',
                            '<%= src %>/common/fonts/*',
                            '<%= src %>/**/_*.scss'
                        ]
                    }]
                }
            },

            // Instrument the generated CSS file to add necessary vendor prefixes and remove the ones not needed for your scope.
            postcss: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
                            // We are using crosswalk 20 for android which is using chromium 50
                            browsers: ['iOS >= 8', 'Chrome >= 50']
                        })
                    ]
                },
                app: {
                    src: '<%= pub %>/css/app.css'
                }
            },

            // Watcher for css files
            chokidar: {
                cssApp: {
                    files: ['<%= src %>/**/*.scss'],
                    tasks: ['newer:replace', 'sass_compile_imports', 'sass', 'newer:postcss']
                }
            }
        }
    };
};
