const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

function colorConsoleOutput(ansiColorCode, str) {
    myConsole.log(`\x1b[${ansiColorCode}m${str}\x1b[0m`);
}

module.exports = {
    colorConsoleOutput,
    myConsole
};
