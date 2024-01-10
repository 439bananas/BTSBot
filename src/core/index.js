/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: index.js                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: You should never call restart() within this file; the script stops while the server and bot continue to run

global.uniconf = require('../configs/uniconf.json')
global.log = require('./logHandler');
global.translate = require('./getLanguageString')
global.getlang = require('./getLanguageJSON')

getlang(true).then(lang => { // Get language and then get translation string
    log.info(`${translate(lang, 'log_startingbtsbot', "express-engine-jsx")}${uniconf.projname}...`)
})

require('./compileProject') // This is where the real magic happens