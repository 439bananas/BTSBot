/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                  File: init.js                  //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const forever = require('forever-monitor')
const fs = require('fs')
const strip = require('strip-color');
const log = require('./logHandler')

const child = new (forever.Monitor)('./src/core/createElements.js', { // Define calling createElements
    max: 0, // Unlimited times the script should run
    silent: false, // Log every output to the console
    args: [] // No args
})

log.initLog() // Create logs directory if it doesn't exist and create this session's log file

log.getLogFile().then(file => { // Get this session's log file and declare it as a variable
    var logFile = file
})

child.on('exit:code', function (code) { // When createElements exits, grab the code
    if (code == 1) { // If hard crash, exit
        process.exit(1)
    }
    if (code == 2) { // If code is 2, restart
        child.restart()
    }
});

child.on('stdout', function (data) {
    fs.appendFile('logs/' + logFile, strip(data.toString()), (err) => {
        if (err) {
            log.error(err);
            log.warn("The log handler threw an error! The log may not be saved during this session.")
        }
    });
});

child.start() // Run the script itself