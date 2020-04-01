const inquirer = require('inquirer');
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chalkAnimation = require('chalk-animation');
const { error, warning, gray, success, prefix, log } = require('./log.js');

function getDT() {
    const date = new Date();
    let m = (date.getMonth() + 1 + '').padStart(2, '0');
    let d = (date.getDate() + '').padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
}

async function zipFile(name, themeDir, outputFile) {
    const fuiPath = path.resolve(themeDir, '../../../');
    const cssPath = path.resolve(fuiPath, 'css/themes', name);
    const jsPath = path.resolve(fuiPath, 'js/miniui/themes', name);

    var tempDir = path.join(outputFile, '../.zipTemp');
    if (!fse.existsSync(tempDir)) {
        fse.mkdirSync(tempDir);
    }
    await fse.copy(themeDir, path.join(tempDir, 'pages/themes/' + name));
    await fse.copy(cssPath, path.join(tempDir, 'css/themes/' + name));
    await fse.copy(jsPath, path.join(tempDir, 'js/miniui/themes/' + name));

    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputFile);
        output.on('close', function() {
            // console.log('output close');

            resolve(outputFile);
        });

        output.on('end', function() {
            // console.log('output end');
            // post('/', 'D:/Code/so/file-receiver/testOutput', outputFile);
        });
        const zip = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        zip.on('warning', function(ev) {
            // console.log(ev);
        });

        zip.on('end', function() {
            // console.log('zip end');
        });

        zip.pipe(output);

        zip.directory(tempDir, false);

        zip.finalize()
            .then(() => {
                return fse.removeSync(tempDir);
            })
            .catch(err => {
                log(error(err));
                reject(err);
            });
    });
}

/**
 *
 *
 * @param {string} name 主题名称
 * @param {string} themeDir 主题路径
 */
async function doCopy(name, themeDir) {
    const outputFile = path.join(process.cwd(), `${name}-${getDT()}.zip`);

    if (fse.existsSync(outputFile)) {
        fse.unlinkSync(outputFile);
    }

    await zipFile(name, themeDir, outputFile);
    const r = chalkAnimation.rainbow(`选定的 ${name} 已经拷贝到 ${outputFile}`);

    setTimeout(() => {
        r.stop();
    }, 1000);
}

module.exports = function runCopy() {
    const themePath = ['frame/fui/pages/themes', 'fui/pages/themes'];

    let themeDir = null;

    for (const t of themePath) {
        const p = path.resolve(process.cwd(), t);

        if (fse.existsSync(p)) {
            themeDir = p;
        }
    }

    if (!themeDir) {
        log(error(`当前目录下找不到 ${themePath.join(' 或 ')}， 无法完成复制操作`));
        return;
    }

    // 列出所有主题
    const theme = {};

    fse.readdirSync(themeDir).forEach(themeName => {
        theme[themeName] = path.join(themeDir, themeName);
    });

    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'theme',
                message: '请选择要提取的主题',
                choices: Object.keys(theme)
            }
        ])
        .then(async answers => {
            // console.log('你选择了' + answers.theme);
            let str = `正在拷贝${answers.theme}主题`;
            const rainbow = chalkAnimation.rainbow(str);
            const t = setInterval(() => {
                rainbow.replace((str += '.'));
            }, 17);
            await doCopy(answers.theme, theme[answers.theme]);
            clearInterval(t);
        })
        .catch(error => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });
};
