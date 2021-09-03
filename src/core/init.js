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

const child = new (forever.Monitor)('./src/core/createElements.js', { // Define calling createElements
    max: 0, // Unlimited times the script should run
    silent: false, // Log every output to the console
    args: [] // No args
})

child.on('exit:code', function (code) { // When createElements exits, grab the code
    if (code == 1) { // If hard crash, exit
        process.exit(1)
    }
    if (code == 2) { // If code is 2, restart
        child.restart()
    }
});

child.start() // Run the script itself