/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: databaseManager.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

let lang = getlang()
log.info(translate(lang, 'log_initialisingdbm'))

require('./redisGlobaliser') // Globalise Redis and MySQL connections
require('./mySQLGlobaliser')
require('./updateDatabaseVersion') // Ensures that the database's content etc is up to date with the current version in pkg.version