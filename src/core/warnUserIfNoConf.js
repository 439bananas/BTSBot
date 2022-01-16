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
const checkConf = require('./checkConfExists')
const uniconf = require('../configs/uniconf.json')
const translate = require('./getLanguageString')
const getlang = require('./getLanguageJSON')

getlang().then(lang => {
    log.info(translate(lang, 'log_checkforconf'))
    checkConf().catch(err => {// Check the configuration file, if anything other than true is returned, warn the user
        if (err == false) {
            log.warn(translate(lang, 'log_noconfpart1') + uniconf.projname + translate(lang, 'log_noconfpart2') + "localhost:" + uniconf.port + translate(lang, 'log_noconfpart3'))
        }
        else if (err == 'INCORRECT_CREDENTIALS') {
            log.warn(translate(lang, 'log_dbbadcredspart1') + 'localhost:' + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
        }
        else if (err == 'ACCESS_DENIED') {
            log.warn(translate(lang, 'log_dbaccessdenied'))
        }
        else if (err == 'TOKEN_INVALID') {
            log.warn(translate(lang, 'log_invalidtoken') + "localhost:" + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
        }
        else if (err == 'CANNOT_CONNECT_TO_DISCORD') {
            log.warn(uniconf.projname + translate(lang, 'log_cannotconnecttodiscordpart1') + uniconf.projname + translate(lang, 'log_cannotconnecttodiscordpart2'))
        }
        else if (err == 'CONNECTION_REFUSED') {
            log.warn(uniconf.projname + translate(lang, 'log_dbconnectionrefusedpart1') + "localhost:" + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
        }
        else if (err == 'UNKNOWN_ERROR') {
            log.warn(translate(lang, 'log_unknownerror') + uniconf.discord)
        }
        else if (err == 'MISSING_FIELDS' || err == 'MISSING_DISCORD_FIELDS') {
            log.warn(translate(lang, 'log_missingfieldswarn') + 'localhost:' + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
        }
    })
})