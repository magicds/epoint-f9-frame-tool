const gulp = require('gulp');
// const sass = require('sass');
const postcss = require('gulp-postcss');
const sass = require('gulp-dart-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const path = require('path');
const fs = require('fs');

gulp.task('scss', function() {
    return gulp
        .src(['**/*.scss', '**/*.sass'])
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer]))
        .pipe();
});

function watchSass(globs) {
    var watcher = gulp.watch([...globs], {
        ignoreInitial: true,
        events: ['add', 'change']
    });

    watcher.on('all', function(filePath) {
        const outDir = path.dirname(filePath);
        const fileName = path.basename(filePath);
    });

    return watcher.close;
}
