/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                 File: index.js                  //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

// NOTES: You should never call restart() within this file; the script stops while the server and bot continue to run

const log = require('./logHandler');
const translate = require('./getLanguageString')
const getlang = require('./getLanguageJSON')
const uniconf = require('../configs/uniconf.json')

getlang(true).then(lang => { // Get language and then get translation string
    log.info(`${translate(lang, 'log_startingbtsbot')}${uniconf.projname}...`)
})
const start = require('./init') // This is where the real magic happens