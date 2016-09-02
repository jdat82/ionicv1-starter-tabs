'use strict';

module.exports = function () {

    return {

        tasks: {

            // Utility so useful for versioning
            bump: {
                options: {
                    files: ['package.json', 'config.xml'],
                    commitFiles: ['package.json', 'config.xml', 'CHANGELOG.md'],
                    pushTo: 'origin',
                    tagName: 'v%VERSION%',
                    commitMessage: 'Release v%VERSION%'
                }
            },

            conventionalChangelog: {
                options: {
                    // conventional-changelog options go here
                    changelogOpts: {
                        preset: 'angular'
                    },
                    // context goes here
                    context: {},
                    // git-raw-commits options go here
                    gitRawCommitsOpts: {},
                    // conventional-commits-parser options go here
                    parserOpts: {},
                    // conventional-changelog-writer options go here
                    writerOpts: {}
                },
                release: {
                    src: 'CHANGELOG.md'
                }
            },

            // Generate an apk for play store.
            // Use a local keystore.
            // To be customized per project: keystore location, zipalign location, apk filename, …
            shell: {
                dist: {
                    command: [
                        'grunt dist',
                        'cordova build --release android',
                        'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <your_keystore>.keystore \ ' +
                        'platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk <alias_name>',
                        'rm -f <apk_filename>',
                        '$ANDROID_HOME/build-tools/current/zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk \ ' +
                        '<apk_filename>'
                    ].join(' && ')
                }
            }

        }
    };

};
