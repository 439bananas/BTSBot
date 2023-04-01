/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File updateDatabaseVersion.js              //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const pkg = require('../../package.json')
const version = pkg.version.split('.')
lang = getlang()

async function updateDb() {
    try {
        let dbVersionResponse = await MySQLConnection.query('SELECT * FROM botconfig WHERE property="dbVersion";') // Get database version
        let dbVersion = dbVersionResponse[0][0].value.split('.')

        if (dbVersion[0] > version[0] || (dbVersion[0] >= version[0] && dbVersion[1] > version[1]) || (dbVersion[0] >= version[0] && dbVersion[1] >= version[1] && dbVersion[2] > version[2])) {
            log.fatal(translate(lang, "log_dbversiongreaterthanpkgpart1") + uniconf.projname + translate(lang, "log_dbversiongreaterthanpkgpart2")) // Fatal if DB version > bot version
        } else if (version[0] == dbVersion[0] && version[1] == dbVersion[1] && version[2] == dbVersion[2]) {
            require('./updateDatabase') // Update the database
        } else {
            log.warn(translate(lang, "log_upgradingdb"))
            switch (dbVersionResponse[0][0].value) {
                /*
                This is pretty TBD here.
                It's gonna be complicated when more and more updates require complex database changes
                The idea is to have a switch-case statement, the bot will perform the necessary SQL commands to update the database
                If an update needs a database change, each case will have a code update so that each database version will be upgraded to current
                */
            }
            log.warn(translate(lang, "log_updatingdbpart1") + uniconf.projname + translate(lang, "log_updatingdbpart2"))
            require('./updateDatabase') // Update the database
        }
    } catch (err) {
        log.error("************************************************")
        console.log(err)
        log.fatal(translate(lang, "log_queryingdbcolumnsfailedpart1") + err.code + translate(lang, "log_queryingdbcolumnsfailedpart2") + uniconf.projname + translate(lang, "log_queryingdbcolumnsfailedpart2"))
    }
}

require('./updateDatabase')
setTimeout(function () { updateDb() }, 5000)