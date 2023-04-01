/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: createElements.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

global.path = require('path') // Define anything to be globally used here
global.uniconf = require('../configs/uniconf.json')
global.pkg = require('../../package.json')
global.translate = require('./getLanguageString')
global.log = require('./logHandler')
global.restart = require('./restartProcess')
global.getlang = require('./getLanguageJSON')

require('./warnUserIfNoConf') // Check if conf.json exists and if not, send a warning to the console

require('../server/createServer') // Start the dashboard
//require('../bot/createBot') // Start the bot

/*process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    console.log(reason.stack)
    // application specific logging, throwing an error, or other logic here
})*/