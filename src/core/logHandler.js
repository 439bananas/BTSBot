const colours = require('colors')

async function info(message) {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} ${message}`)
}

async function warn(message) {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'WARN: '.yellow} ${message}`)
}

async function error(message) {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'ERROR: '.red} ${message}`)
}

async function fatal(message) {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'FATAL:'.bgRed} ${message}`)
    process.exit(1)
}

module.exports = {info, warn, error, fatal};