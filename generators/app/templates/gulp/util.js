'use strict';

module.exports = require('gulp-load-plugins')({
    DEBUG: true,
    lazy: true,
    pattern: [
        'gulp-*', 'gulp.*','main-bower-files','uglify-save-license',
        'less-plugin-autoprefix','browser-sync','browser-sync-spa',
        'wiredep', 'del'
    ],
    rename: { // a mapping of plugins to rename
        'del': 'del',
        'gulp-if': 'IF',
        'wiredep': 'wiredep',
        'browser-sync-spa': 'syncSpa',
        'browser-sync': 'browserSync',
        'main-bower-files': 'bowerFiles',
        'uglify-save-license': 'uglifyLicense',
        'less-plugin-autoprefix': 'lessAutoprefix'
    }
});
