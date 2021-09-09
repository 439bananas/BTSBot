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
const fs = require('fs')
const path = require('path')

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

function initLog() {
    info('Checking for log directory...')
    if (!fs.existsSync('./logs')) { // Check for directory named "logs" in the root, if it doesn't exist, create it
        info('Logs directory doesn\'t exist; Creating!')
        fs.mkdirSync('logs')
    }
    info('Creating this session\'s log file')
    var iteration = 1 // Start at 1 and if the file exists, continue until incrementing until a file doesn't exist
    if (new Date().getDate().toString().length == 1) { // Uniform all the dates so if the length of the date or the month is 1 prepend with a 0
        var date = (0).toString() + (new Date().getDate()).toString()
    } else var date = (new Date().getDate()).toString()

    if (new Date().getMonth().toString().length == 1) {
        var month = (0).toString() + (new Date().getMonth() + 1).toString()
    } else var month = (new Date().getMonth() + 1).toString()

    var alreadyExists = true // Declare as true so the next piece of code will definitely run
    while (alreadyExists == true) { // While the log file in question exists, run through every number until one doesn't and create the file with fancy text inside
        global.logFile = date + month + new Date().getFullYear().toString() + iteration.toString() + '.log' // Declare log file format
        if (fs.existsSync('./logs/' + logFile)) {
            iteration += 1
        } else {
            var alreadyExists = false
            var filename = '// ' // Generate the line that mentions the file name, start off with //
            var spaces = (47 - (('File: ' + logFile).length)) / 2 // 47 is the length of the text part of the leader, count the spaces by subtracting the phrase "File: " and log file's length, subtracting from 47 and dividing by two
            if (spaces % 1 !== 0) { // If the answer is not an integer, subtract 0.5 so that the text goes ever so slightly to the left by a space, no big deal
                spaces -= 0.5
            }
            for (let i = 0; i < spaces; i++) { // For every space counted, append to "filename" a soace
                var filename = filename + " "
            }
            var filename = filename + "File: " + logFile // Add file name to this line
            var spaces = 47 - ("File: " + logFile).length - spaces // Dictate the remaining spaces by subtracting the number of existing spaces and the length of the aforementioned file name phrase from 47
            for (let i = 0; i < spaces; i++) { // Line 62
                var filename = filename + " "
            }
            var filename = filename + " //" // Add // to make it look pretty
            fs.writeFile('./logs/' + logFile, '/////////////////////////////////////////////////////\n//                                                 //\n//                     BTS Bot                     //\n//                                                 //\n' + filename + '\n//                                                 //\n//              Written by: Automatic              //\n//                                                 //\n//                                                 //\n//                                                 //\n/////////////////////////////////////////////////////\n', function (err) {
                if (err) throw err; // ^^ Make the log file with the content including the file name
                info(`Log file saved to ${path.join(__dirname, '..', '..', 'logs', logFile)}`)
            })
        }
    }
}

async function getLogFile() {
    return logFile;
}

module.exports = { info, warn, error, fatal, initLog, getLogFile };