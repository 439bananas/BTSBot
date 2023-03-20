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

getlang().then(async lang => {
    log.info(translate(lang, 'log_checkforconf'))
    try {
        let result = await checkConf()
        log.temp("test")
        log.tempinfo(result)
    } catch (err) {
        void err
    }
    checkConf().then(result => {
        log.tempinfo(result)
        global.conf = require('../../configs/conf.json')
        require('../database/databaseManager')
    }).catch(err => { // Check the configuration file, if anything other than true is returned, warn the user
        switch (err) {
            case false:
                log.warn(translate(lang, 'log_noconfpart1') + uniconf.projname + translate(lang, 'log_noconfpart2') + "localhost:" + uniconf.port + translate(lang, 'log_noconfpart3'))
                break;
            case 'INCORRECT_CREDENTIALS':
                global.conf = require('../../configs/conf.json')
                log.warn(translate(lang, 'log_dbbadcredspart1') + 'localhost:' + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'ACCESS_DENIED':
                global.conf = require('../../configs/conf.json')
                log.warn(translate(lang, 'log_dbaccessdenied'))
                break;
            case 'TOKEN_INVALID':
                global.conf = require('../../configs/conf.json')
                log.warn(translate(lang, 'log_invalidtoken') + "localhost:" + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'CANNOT_CONNECT_TO_DISCORD':
                global.conf = require('../../configs/conf.json')
                log.warn(uniconf.projname + translate(lang, 'log_cannotconnecttodiscordpart1') + uniconf.projname + translate(lang, 'log_cannotconnecttodiscordpart2'))
                break;
            case 'CONNECTION_REFUSED':
                log.warn(uniconf.projname + translate(lang, 'log_dbconnectionrefusedpart1') + "localhost:" + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                global.conf = require('../../configs/conf.json')
                break;
            case 'MISSING_FIELDS':
                log.warn(translate(lang, 'log_missingfieldswarn') + 'localhost:' + uniconf.port + translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'REDIS_CONNECTION_REFUSED':
                global.conf = require('../../configs/conf.json')
                log.warn(uniconf.projname + translate(lang, 'log_redisconnectionrefusedpart1') + "localhost:" + uniconf.port + translate(lang, 'log_redisconnectionrefusedpart2'))
                break;
            case 'WRONGPASS':
                global.conf = require('../../configs/conf.json')
                log.warn(translate(lang, 'log_redisbadcredspart1') + 'localhost:' + uniconf.port + translate(lang, 'log_redisbadcredspart2'))
                break;
            case 'BAD_DATABASE':
                global.conf = require('../../configs/conf.json')
                log.warn(translate(lang, 'log_redisbaddbpart1') + 'localhost:' + uniconf.port + translate(lang, 'log_redisbaddbpart2'))
                break;
            default:
                global.conf = require('../../configs/conf.json')
                log.error(err)
                log.warn(translate(lang, 'log_unknownerror') + uniconf.discord)
                break;
        }
        if (typeof(conf) != "undefined") console.log(conf)
    })
})