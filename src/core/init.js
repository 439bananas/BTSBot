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

const child = new (forever.Monitor)('./src/core/createElements.js', {
    max: 1,
    silent: false,
    args: []
})

child.on('exit:code', function (code) {
    if (code == 1) {
        process.exit(1)
    }
    if (code == 2) {
        child.restart()
    }
});

child.start()