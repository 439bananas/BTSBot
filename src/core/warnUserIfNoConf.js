/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: warnUserIfNoConf.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('./checkConfExists')

getlang().then(lang => {
    log.info(translate(lang, 'log_checkforconf'))
    checkConf().then(result => {
        global.conf = require('../configs/conf.json')
    }).catch(err => { // Check the configuration file, if anything other than true is returned, warn the user
        switch (err) {
            case false:
                log.warn(translate(lang, 'log_noconfpart1') + uniconf.projname + translate(lang, 'log_noconfpart2') + "localhost:" + uniconf.port + translate(lang, 'log_noconfpart3'))
                break;
            case 'INCORRECT_CREDENTIALS':
                log.warn(translate(lang, 'log_dbbadcredspart1') + 'localhost:' + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'ACCESS_DENIED':
                log.warn(translate(lang, 'log_dbaccessdenied'))
                break;
            case 'TOKEN_INVALID':
                log.warn(translate(lang, 'log_invalidtoken') + "localhost:" + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'CANNOT_CONNECT_TO_DISCORD':
                log.warn(uniconf.projname + translate(lang, 'log_cannotconnecttodiscordpart1') + uniconf.projname + translate(lang, 'log_cannotconnecttodiscordpart2'))
                break;
            case 'CONNECTION_REFUSED':
                log.warn(uniconf.projname + translate(lang, 'log_dbconnectionrefusedpart1') + "localhost:" + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'MISSING_FIELDS':
                log.warn(translate(lang, 'log_missingfieldswarn') + 'localhost:' + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                break;
            default:
                log.warn(translate(lang, 'log_unknownerror') + uniconf.discord)
                break;
        }
    })
})