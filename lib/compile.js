/* eslint-env node, es6 */
const gulp = require('gulp');
// const sass = require('sass');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-dart-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const path = require('path');
const fs = require('fs');

const uglify = require('gulp-uglify');

const chalkAnimation = require('chalk-animation');

// const chalk = require('chalk');
// const error = chalk.bold.red;
// const warning = chalk.keyword('orange');
// const gray = chalk.gray;
// const success = chalk.green;
// const prefix = chalk.bgGreen.black;

// function log() {
//     return console.log(prefix('[epoint tool]'), ...arguments);
// }

const { error, warning, gray, success, prefix, log } = require('./log.js');

const GLOBAL_IGNORES = ['!**/node_modules'];

function renderSass(input, opt, output) {
    var p = gulp
        .src(input)
        .pipe(sass(opt).on('error', sass.logError))
        .pipe(postcss([autoprefixer, cssnano]))
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest('./'))
        .on('finish', function () {
            log(gray(input), success('compile success'));
        });

    const withMin = typeof output.withMin == 'function' ? output.withMin(input) : output.withMin;
    if (withMin) {
        p.pipe(
            rename({
                suffix: '.min',
                extname: '.css',
            })
        ).pipe(gulp.dest('./'));
    }
    return p;
}

function onUglifyError(err) {
    log(error(err));
    // log(error(`\nfileName: ${err.fileName} \nline: ${err.line} \ncol: ${err.col} \npos: ${err.pos} \nmessage: ${err.message} \ncause: ${err.cause}`));
    this.end();
}

function miniJs(input) {
    var p = gulp
        .src(input)
        .pipe(
            uglify({
                ie8: true,
            })
        )
        .on('error', onUglifyError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./'))
        .on('finish', function () {
            log(gray(input), success('minify success'));
        });

    return p;
}

function watchSass(
    globs = ['**/*.scss'],
    opt = {},
    output = {
        withMin: true,
    }
) {
    if (!Array.isArray(globs)) {
        globs = [globs];
    }
    // globs.forEach(item => log(item));
    // chalkAnimation.rainbow('sass watching');

    globs.push(...GLOBAL_IGNORES);

    var watcher = gulp.watch(globs, {
        ignoreInitial: true,
        events: ['add', 'change'],
    });

    watcher.on('all', function (type, filePath) {
        log(gray(type), filePath);
        return renderSass(filePath, opt, output);
    });

    return watcher.close;
}

function watchJs(globs = ['**/*.js']) {
    if (!Array.isArray(globs)) {
        globs = [globs];
    }

    // globs.forEach(item => log(item));
    // chalkAnimation.rainbow('JavaScript watching');

    globs.push(...GLOBAL_IGNORES);

    var watcher = gulp.watch(globs, {
        ignoreInitial: true,
        events: ['add', 'change'],
    });

    watcher.on('all', function (type, filePath) {
        if (/\.min\.js/.test(filePath)) {
            return;
        }
        log(gray(type), filePath);
        return miniJs(filePath);
    });

    return watcher.close;
}

module.exports = {
    runCompile: function runCompile(config) {
        const sassOpt = config.sass;
        const jsOpt = config.js;

        // scss  watch
        if (sassOpt && sassOpt.watch.length) {
            log(success('sass 监控已启用'));
            watchSass(sassOpt.watch, sassOpt.compileOptions, sassOpt.output);
        } else {
            log(gray('sass 监控未启用'));
        }
        // js watch
        if (jsOpt && jsOpt.watch.length) {
            log(success('js 监控已启用'));
            watchJs(jsOpt.watch, jsOpt.option);
        } else {
            log(gray('js 监控未启用'));
        }

        // BrowserSync
        if (config.browserSync && config.browserSyncConfig) {
            config.browserSyncConfig = path.resolve(process.cwd(), config.browserSyncConfig);
            if (fs.existsSync(config.browserSyncConfig)) {
                const bsConfig = require(config.browserSyncConfig);
                const bs = require('browser-sync').create();
                // .init starts the server
                bs.init(bsConfig);
            } else {
                log(gray('BrowserSync 必要的配置文件缺失，请重新运行init命令生成'));
            }
        } else {
            log(gray('BrowserSync 未启用'));
        }
    },
    renderSass: function (input, min) {
        return renderSass(input, {}, { withMin: min });
    },
};
