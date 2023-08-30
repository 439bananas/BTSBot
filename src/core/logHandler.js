/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: logHandler.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const colours = require('colors')
const fs = require('fs')
const path = require('path')

/**
 * Logs information to the console with a green "INFO"
 * @param {string} message - The message to log
 */
function info(message) { // Log depending on function called
    getlang(true).then(lang => {
        if (path.basename(process.argv[1]) == "index.js") { // Tell translate() where the i18n file is depending on if we're in the server or not
            translateMode = "express-engine-jsx"
        } else translateMode = undefined
        console.info(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_info', translateMode)}:`.green} ${message}`)
    })
}

/**
 * Sends a warning to the console with a yellow "WARN"
 * @param {string} message - The message to warn with
 */
function warn(message) {
    getlang(true).then(lang => {
        if (path.basename(process.argv[1]) == "index.js") {
            translateMode = "express-engine-jsx"
        } else translateMode = undefined
        console.warn(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_warn', translateMode)}:`.yellow} ${message}`)
    })
}

/**
 * Sends, you guessed it, an error to the console with a red "ERROR"
 * @param {string} message - The message to error with
 */
function error(message, line) {
    const e = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/
    const match = regex.exec(e.stack.split("\n")[2]);
    getlang(true).then(lang => {
        if (path.basename(process.argv[1]) == "index.js") {
            translateMode = "express-engine-jsx"
        } else translateMode = undefined
        if (line) {
            console.error(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_error', translateMode)}:`.red} ${message} at ${__filename}:${line[2]}:${line[3]}`)
        } else if (match) {
            console.error(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_error', translateMode)}:`.red} ${message} at ${__filename}:${match[2]}:${match[3]}`)
        } else {
            console.error(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_error', translateMode)}:`.red} ${message}`)
        }
    })
}

function err(message) { // Quick alias for error because I'm an idiot
    const e = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/
    const match = regex.exec(e.stack.split("\n")[2]);
    error(message, match)
}

function temp(message) {  // This is used for assertions and logging information to ensure a function works as intended. Each assertion should NOT end up in final releases
    getlang(true).then(lang => {
        if (path.basename(process.argv[1]) == "index.js") {
            translateMode = "express-engine-jsx"
        } else translateMode = undefined
        console.log(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_temp', translateMode)}:`.brightMagenta} ${message}`)
    })
}

function tempinfo(message) { // Tells the user information they may need to know (ie x warning is safe to ignore), where the logging will be removed after the problem is fixed
    getlang(true).then(lang => {
        if (path.basename(process.argv[1]) == "index.js") {
            translateMode = "express-engine-jsx"
        } else translateMode = undefined
        console.log(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_tempinfo', translateMode)}:`.magenta} ${message}`)
    })
}

function fatal(message) {
    getlang(true).then(lang => { // Log and exit
        if (path.basename(process.argv[1]) == "index.js") {
            translateMode = "express-engine-jsx"
        } else translateMode = undefined
        console.error(`${colours.cyan(`${new Date()}`)} - ${`${translate(lang, 'loghandler_fatal', translateMode)}:`.bgRed} ${message}`)
        process.exit(1)
    })
}

function initLog() { // Create the log file
    return new Promise(function (resolve, reject) {
        getlang(true).then(lang => {
            info(translate(lang, "log_loghandlercheckingforlogdir", "express-engine-jsx"))
            if (!fs.existsSync('./logs')) { // Check for directory named "logs" in the root, if it doesn't exist, create it
                info(translate(lang, 'log_nologdir', "express-engine-jsx"))
                fs.mkdirSync('logs')
            }
            info(translate(lang, "log_loghandlercreatinglogfile", "express-engine-jsx"))
            var iteration = 1 // Start at 1 and if the file exists, continue until incrementing until a file doesn't exist
            if (new Date().getDate().toString().length == 1) { // Uniform all the dates so if the length of the date or the month is 1 prepend with a 0
                var date = (0).toString() + (new Date().getDate()).toString()
            } else var date = (new Date().getDate()).toString()

            if ((new Date().getMonth() + 1).toString().length == 1) {
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
                    var spaces = (55 - (('File: ' + logFile).length)) / 2 // 55 is the length of the text part of the leader, count the spaces by subtracting the phrase "File: " and log file's length, subtracting from 55 and dividing by two
                    if (spaces % 1 !== 0) { // If the answer is not an integer, subtract 0.5 so that the text goes ever so slightly to the left by a space, no big deal
                        spaces -= 0.5
                    }
                    for (let i = 0; i < spaces; i++) { // For every space counted, append to "filename" a space
                        var filename = filename + " "
                    }
                    var filename = filename + "File: " + logFile // Add file name to this line
                    var spaces = 55 - ("File: " + logFile).length - spaces // Dictate the remaining spaces by subtracting the number of existing spaces and the length of the aforementioned file name phrase from 55
                    for (let i = 0; i < spaces; i++) { // Line 85
                        var filename = filename + " "
                    }
                    var filename = filename + " //" // Add // to make it look pretty
                    fs.writeFile('./logs/' + logFile, '/////////////////////////////////////////////////////////////\n//                                                         //\n//                         BTS Bot                         //\n//                                                         //\n' + filename + '\n//                                                         //\n//                                                         //\n//                                                         //\n//                                                         //\n//                                                         //\n/////////////////////////////////////////////////////////////\n', function (err) {
                        if (err) throw err; // ^^ Create the log file with the content including the file name
                        info(translate(lang, 'log_filesaved', "express-engine-jsx") + path.join(__dirname, '..', '..', 'logs', logFile))
                    })
                }
            }
            resolve(logFile);
        })
    })
}

module.exports = { info, warn, error, err, fatal, temp, tempinfo, initLog };