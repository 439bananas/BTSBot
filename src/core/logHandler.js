/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//               File: logHandler.js               //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const colours = require('colors')

async function info(message) { // Log depending on function called
    console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} ${message}`)
}

async function warn(message) {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'WARN:'.yellow} ${message}`)
}

async function error(message) {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'ERROR:'.red} ${message}`)
}

async function fatal(message) {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'FATAL:'.bgRed} ${message}`) // Log and exit
    process.exit(1)
}

module.exports = {info, warn, error, fatal};