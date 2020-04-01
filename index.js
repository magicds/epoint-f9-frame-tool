#!/usr/bin/env node

const pkg = require('./package.json');
const yargs = require('yargs');

const chalkAnimation = require('chalk-animation');
const path = require('path');

const fs = require('fs');
run();

function run() {
    yargs
        .command('start', 'start epoint tool')
        .command('init', 'init an config file')
        .command('copytheme', 'copy a theme files')
        // .version(function() {
        //     return pkg.version;
        // })
        .epilogue(
            [
                // prettier-ignore
                'you can run this blow command:',
                '  $0 start',
                '',
                '  $0 init'
            ].join('\n')
        );

    const argv = yargs.argv;

    // if (argv) {
    //     console.log('argv');
    //     Object.keys(argv).forEach(k => console.log(k, argv[k]));
    // }

    const command = argv._[0];

    console.log('use command', command);
    if (command == 'start') {
        // 开始执行的命令
        yargs.reset();
        var out = yargs
            .option({
                config: {
                    alias: 'c',
                    desc: '配置文件',
                    default: 'epoint.config.js'
                }
            })
            .default('cwd', function() {
                return process.cwd();
            })
            .help().argv;

        let configFilePath = out.config;
        if (configFilePath) {
            configFilePath = path.resolve(process.cwd(), configFilePath);

            if (!fs.existsSync(configFilePath)) {
                console.log('配置文件不存在，请使用 init 命令初始化或使用 -config 配置项传入');
            }

            console.log('do start ', configFilePath);

            require('./compile.js')(require(configFilePath));
        }
        return;
    }

    if (command == 'init') {
        // 初始化配置文件
        // console.log('__dirname', __dirname);

        // console.log('process.cwd()', process.cwd());
        copyConfigFile();
        return;
    }

    if (command == 'copytheme') {
        require('./copyFui.js')();
        return;
    }

    yargs.showHelp();
}

function copyConfigFile() {
    const pkgDir = __dirname;
    const aimDir = process.cwd();

    fs.copyFileSync(path.join(pkgDir, 'epoint.config.demo.js'), path.join(aimDir, 'epoint.config.js'));

    fs.copyFileSync(path.join(pkgDir, 'bs-config.js'), path.join(aimDir, 'bs-config.js'));
    fs.copyFileSync(path.join(pkgDir, '.browserslistrc'), path.join(aimDir, '.browserslistrc'));

    console.log(['配置文件初始化完成，请检查:', '[epoint.config.js]  js和css自动化配置', '[bs-config.js] BrowserSync 详细配置'].join('\n'));
}
