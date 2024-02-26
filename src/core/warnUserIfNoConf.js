/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: warnUserIfNoConf.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import checkConf from './checkConfExists'

getlang().then(async lang => {
    log.info(await translate(lang, 'log_checkforconf'))
    checkConf().then(async result => {
        global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
        import('../database/databaseManager')
    }).catch(async err => { // Check the configuration file, if anything other than true is returned, warn the user
        import('../server/createServer') // Create server when there is no config; if there is then wait until database updates are complete
        switch (err) {
            case false:
                log.warn(await translate(lang, 'log_noconfpart1') + uniconf.projname + await translate(lang, 'log_noconfpart2') + "localhost:" + uniconf.port + await translate(lang, 'log_noconfpart3'))
                break;
            case 'INCORRECT_CREDENTIALS':
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.warn(await translate(lang, 'log_dbbadcredspart1') + 'localhost:' + uniconf.port + await translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'ACCESS_DENIED':
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.warn(await translate(lang, 'log_dbaccessdenied'))
                break;
            case 'TOKEN_INVALID':
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.warn(await translate(lang, 'log_invalidtoken') + "localhost:" + uniconf.port + await translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'CANNOT_CONNECT_TO_DISCORD':
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.warn(uniconf.projname + await translate(lang, 'log_cannotconnecttodiscordpart1') + uniconf.projname + await translate(lang, 'log_cannotconnecttodiscordpart2'))
                break;
            case 'CONNECTION_REFUSED':
                log.warn(uniconf.projname + await translate(lang, 'log_dbconnectionrefusedpart1') + "localhost:" + uniconf.port + await translate(lang, 'log_dbbadcredspart2'))
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                break;
            case 'MISSING_FIELDS':
                log.warn(await translate(lang, 'log_missingfieldswarn') + 'localhost:' + uniconf.port + await translate(lang, 'log_dbbadcredspart2'))
                break;
            case 'REDIS_CONNECTION_REFUSED':
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.warn(uniconf.projname + await translate(lang, 'log_redisconnectionrefusedpart1') + "localhost:" + uniconf.port + await translate(lang, 'log_redisconnectionrefusedpart2'))
                break;
            case 'WRONGPASS':
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.warn(await translate(lang, 'log_redisbadcredspart1') + 'localhost:' + uniconf.port + await translate(lang, 'log_redisbadcredspart2'))
                break;
            case 'BAD_DATABASE':
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.warn(await translate(lang, 'log_redisbaddbpart1') + 'localhost:' + uniconf.port + await translate(lang, 'log_redisbaddbpart2'))
                break;
            default:
                global.conf = (await import('../../configs/conf.json', { assert: { type: "json" } })).default
                log.error(err)
                log.warn(await translate(lang, 'log_unknownerror') + uniconf.discord)
                break;
        }
    })
})