const chalk = require('chalk');
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const gray = chalk.gray;
const success = chalk.green;
const prefix = chalk.bgGreen.black;

function log() {
    return console.log(prefix('[epoint tool]'), ...arguments);
}

module.exports = {
    error,
    warning,
    gray,
    success,
    prefix,
    log
};
