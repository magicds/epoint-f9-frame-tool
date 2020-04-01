/* eslint-env node, es6 */
module.exports = {
    sass: {
        watch: ['test/**/*.scss'],
        compileOptions: {},
        output: {
            // 是否同时输出带min的css 可直接配置为布尔值或根据 输入文件判断
            withMin: false,
            // withMin: function(inputFile) {
            //     // eg 主题的scss文件会生成其他则不生成 theme/主题名称/主题名称.scss
            //     if (/themes\/(\w+)\/\1\.scss/.test(inputFile)) {
            //         return true;
            //     }
            //     return false;
            // }
        }
    },
    js: {
        watch: ['test/**/*.js']
    },
    browserSync: true,
    browserSyncConfig: './bs-config.js'
};
