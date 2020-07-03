// const pkg = require('./package.json');
// const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const { error, warning, gray, success, prefix, log } = require('./log.js');

const filesContentMap = {
    normal: `
    files: [
        // eslint-disable-next-line
        // 默认监控所有
        '**/*.html',
        '**/*.js',
        '**/*.css',

        // f9 建议根据实际使用情况修改 仅监控需要位置的文件变化 因为框架文件太多 直接全部监控占用资源太多
        // 'frame/projects/**/*.html',
        // 'frame/projects/**/*.js',
        // 'frame/projects/**/*.css',
        // 'frame/fui/**/*.html',
        // 'frame/fui/**/*.js',
        // 'frame/fui/**/*.css'
    ]`,
    F9Frame: `
    files: [
        // eslint-disable-next-line
        // 默认监控所有
        // '**/*.html',
        // '**/*.js',
        // '**/*.css',

        // f9 建议根据实际使用情况修改 仅监控需要位置的文件变化 因为框架文件太多 直接全部监控占用资源太多
        'frame/projects/**/*.html',
        'frame/projects/**/*.js',
        'frame/projects/**/*.css',
        'frame/fui/**/*.html',
        'frame/fui/**/*.js',
        'frame/fui/**/*.css'
    ]`
};

const serverContentMap = {
    normal: `
    server: {
        baseDir: './',
        directory: true,
        startPath: '/',
        routes: {
            // 可在此配置自定义路由 如 F9 启动需要一个虚拟目录 若打开 webapp 则可如下配置:
            // 即访问 /webapp 将是指当前目录下
            // '/webapp': './'
        },
        middleware: function (req, res, next) {
            // 可以自行书写中间件 以下示例为 POST 请求静态文件导致的 method not allow 错误
            if (/\.json|\.txt/.test(req.url) && req.method.toUpperCase() == 'POST') {
                // console.log(req);
                console.log('[BrowserSync] [POST => GET] : ' + req.url);
                req.method = 'GET';
                // console.log(res);
            }
            next();
        }
    }`,
    F9Frame: `
    server: {
        baseDir: './',
        directory: true,
        routes: {
            // 可在此配置自定义路由 如 F9 启动需要一个虚拟目录 若打开 webapp 则可如下配置:
            '/webapp': './'
        },
        middleware: function (req, res, next) {
            // 可以自行书写中间件 以下示例为 POST 请求静态文件导致的 method not allow 错误
            if (/\.json|\.txt/.test(req.url) && req.method.toUpperCase() == 'POST') {
                // console.log(req);
                console.log('[BrowserSync] [POST => GET] : ' + req.url);
                req.method = 'GET';
                // console.log(res);
            }
            next();
        }
    }`
};

module.exports = function initConfig() {
    const pkgDir = path.resolve(__dirname, '../');
    const aimDir = process.cwd();

    let bsConfig = fs.readFileSync(path.join(pkgDir, 'bs-config.tpl'), 'utf-8');

    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'dirType',
                message: '请选择配置类型',
                choices: ['[normal] 常规目录', '[F9Frame] F9框架']
            }
        ])
        .then(answers => {
            const type = answers.dirType.match(/\[(.+)\]/)[1];
            // 替换监控文件 配置
            bsConfig = bsConfig.replace(/\{\{files\}\}/, filesContentMap[type]);
            // 替换 server 配置
            bsConfig = bsConfig.replace(/\{\{server\}\}/, serverContentMap[type]);

            // 替换其他配置
            if (type == 'F9Frame') {
                bsConfig = bsConfig.replace(/\{\{extConfig\}\}/, [`startPath: '/webapp/frame/fui/'`].join(','));
            } else {
                bsConfig = bsConfig.replace(/\{\{extConfig\}\}/, [`startPath: '/'`].join(','));
            }

            // fs.copyFileSync(path.join(pkgDir, 'bs-config.js'), path.join(aimDir, 'bs-config.js'));
            fs.copyFileSync(path.join(pkgDir, 'epoint.config.demo.js'), path.join(aimDir, 'epoint.config.js'));

            fs.copyFileSync(path.join(pkgDir, '.browserslistrc'), path.join(aimDir, '.browserslistrc'));

            fs.writeFileSync(path.join(aimDir, 'bs-config.js'), bsConfig);

            log(
                [
                    '\n',
                    '配置文件初始化完成，请检查:',
                    '[epoint.config.js]  js和css自动化配置',
                    '[browserslistrc]  补全前缀浏览器配置',
                    '[bs-config.js] BrowserSync 详细配置',
                    '\n'
                ].join('\n')
            );
        });
};
