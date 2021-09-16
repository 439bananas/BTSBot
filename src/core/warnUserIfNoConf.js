/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: warnUserIfNoConf.js            //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('./logHandler')
const checkconf = require('./checkConfExists')
const uniconf = require('../configs/uniconf.json')

log.info(`Checking for a conf.json file...`)
checkconf().catch(err => {// Check the configuration file, if anything other than true is returned, warn the user
    if (err == false) {
        log.warn(`There does not seem to be a conf.json file, that ${uniconf.projname} can access, for it to properly function. Please follow the steps by navigating to localhost:${uniconf.port} in your web browser of choice to rectify this and generate one.`)
    }
    if (err == 'INCORRECT_CREDENTIALS') {
        log.warn(`The credentials entered in the conf.json file were not recognised as valid. Please follow the steps by navigating to localhost:${uniconf.port} in your web browser of choice to rectify this and regenerate the conf.json file.`)
    }
    if (err == 'ACCESS_DENIED') {
        log.warn(`The specified user does not have the necessary permissions to acess the MySQL database in question. Please rectify this error by connecting to the MySQL server using the MySQL client and granting preferably all permissions on the configured database to the configured user.`)
    }
    if (err == 'CONNECTION_REFUSED') {
        log.warn(`BTS Bot cannot connect to the MySQL server that is configured in the conf.json file. Please follow the steps by navigating to localhost:${uniconf.port} in your web browser of choice to rectify this and regenerate the conf.json file.`)
    }
    if (err == 'UNKNOWN_ERROR') {
        log.warn(`An unknown error has occurred. Please refer to the log for more information. As always, the help channel is always available within our Discord server: ${uniconf.discord}`)
    }
    if (err == 'MISSING_FIELDS' || err == 'MISSING_DISCORD_FIELDS') {
        log.warn(`There are necessary settings in the conf.json file that are blank. Please follow the steps by navigating to localhost:${uniconf.port} in your web browser of choice to rectify this and regenerate the conf.json file.`)
    }
})