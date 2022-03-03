/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                      File: init.js                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const forever = require('forever-monitor')
const fs = require('fs')
const strip = require('strip-color');
const log = require('./logHandler')
const translate = require('./getLanguageString')
const getlang = require('./getLanguageJSON')

const child = new (forever.Monitor)('./src/core/createElements.js', { // Define calling createElements
    max: 0, // Unlimited times the script should run
    silent: false, // Log every output to the console
    args: [] // No args
})

log.initLog().then(file => { // Create logs directory if it doesn't exist and create and get this session's log file
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
            getlang(true).then(lang => {
                log.warn(translate(lang, 'log_errorsavinglog'))
            })
        }
    });
});

child.start() // Run the script itself