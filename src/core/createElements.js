/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: createElements.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

global.path = require('path') // Define anything to be globally used here
global.uniconf = require('../configs/uniconf.json')
global.translate = require('./getLanguageString')
global.log = require('./logHandler')
global.restart = require('./restartProcess')
global.getlang = require('./getLanguageJSON')
const checkConf = require('./checkConfExists')

require('./warnUserIfNoConf') // Check if conf.json exists and if not, send a warning to the console
//require('../bot/createBot') // Start the bot

require('../server/createServer') // Start the dashboard