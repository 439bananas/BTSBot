/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File updateDatabaseVersion.js              //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { version as _version } from '../../package.json'
import globaliseRedis from './redisGlobaliser'
const version = _version.split('.')
const lang = await getlang()

async function updateDb() {
    try {
        let dbVersionResponse = await MySQLConnection.query('SELECT * FROM BotConfig WHERE property="dbVersion";') // Get database version
        if (dbVersionResponse[0][0]) {
            let dbVersion = dbVersionResponse[0][0].value.split('.')

            if (dbVersion[0] > version[0] || (dbVersion[0] >= version[0] && dbVersion[1] > version[1]) || (dbVersion[0] >= version[0] && dbVersion[1] >= version[1] && dbVersion[2] > version[2])) {
                log.fatal(translate(lang, "log_dbversiongreaterthanpkgpart1") + uniconf.projname + translate(lang, "log_dbversiongreaterthanpkgpart2")) // Fatal if DB version > bot version
            } else if (version[0] == dbVersion[0] && version[1] == dbVersion[1] && version[2] == dbVersion[2]) {
                import('./ensureRedisReady')
            } else {
                log.warn(translate(lang, "log_upgradingdbprecaution")) // Update the database
                setTimeout(async function () {
                    log.warn(translate(lang, "log_upgradingdb"))
                    switch (dbVersionResponse[0][0].value) {
                        /*
                        This is pretty TBD here.
                        It's gonna be complicated when more and more updates require complex database changes
                        The idea is to have a switch-case statement, the bot will perform the necessary SQL commands to update the database
                        If an update needs a database change, each case will have a code update so that each database version will be upgraded to current
                        */
                    }
                }, 60000)
                // CALL REDIS GLOBALISER AND SERVER AFTER EACH CASE
            }
        } else {
            import('./ensureRedisReady')
        }
    } catch (err) {
        log.error("************************************************")
        console.log(err)
        log.fatal(translate(lang, "log_queryingdbcolumnsfailedpart1") + err.code + translate(lang, "log_queryingdbcolumnsfailedpart2"))
    }
}

export default updateDb