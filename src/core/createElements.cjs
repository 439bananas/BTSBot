/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: createElements.cjs                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

global.path = require('path') // Define anything to be globally used here
global.uniconf = require('../configs/uniconf.json')
global.pkg = require('../../package.json')
global.translate = require('./getLanguageString.cjs')
global.log = require('./logHandler.cjs')
global.restart = require('./restartProcess.cjs')
global.getlang = require('./getLanguageJSON.cjs')

require('./warnUserIfNoConf.cjs') // Check if conf.json exists and if not, send a warning to the console

//require('../bot/createBot.cjs') // Start the bot

// CREATE BOT MUST ONLY BE CALLED IN DATABASE MANAGER

/*process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    console.log(reason.stack)
    // application specific logging, throwing an error, or other logic here
})*/