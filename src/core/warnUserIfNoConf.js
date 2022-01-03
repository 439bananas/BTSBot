/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: warnUserIfNoConf.js            //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('./logHandler')
const checkconf = require('./checkConfExists')
const uniconf = require('../configs/uniconf.json')
const translate = require('./getLanguageString')
const getlang = require('./getLanguageJSON')

getlang().then(lang => {
    log.info(translate(lang, 'log_checkforconf'))
    checkconf().catch(err => {// Check the configuration file, if anything other than true is returned, warn the user
        if (err == false) {
            log.warn(translate(lang, 'log_noconfpart1') + uniconf.projname + translate(lang, 'log_noconfpart2') + "localhost:" + uniconf.port + translate(lang, 'log_noconfpart3'))
        }
        if (err == 'INCORRECT_CREDENTIALS') {
            log.warn(translate(lang, 'log_dbbadcredspart1') + 'localhost:' + uniconf.port + translate(lang, 'dblog_badcredspart2'))
        }
        if (err == 'ACCESS_DENIED') {
            log.warn(translate(lang, 'log_dbaccessdenied'))
        }
        if (err == 'CONNECTION_REFUSED') {
            log.warn(unicoonf.projname + translate(lang, 'log_dbconnectionrefusedpart1') + "localhost:" + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
        }
        if (err == 'UNKNOWN_ERROR') {
            log.warn(translate(lang, 'log_unknownerror') + uniconf.discord)
        }
        if (err == 'MISSING_FIELDS' || err == 'MISSING_DISCORD_FIELDS') {
            log.warn(translate(lang, 'log_missingfieldswarn') + 'localhost:' + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
        }
    })
})