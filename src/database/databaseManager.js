/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: databaseManager.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const addTables = require('./updateDatabase') // Ensures that the database's content etc is up to date with the current version in pkg.version
let lang = getlang()
log.info(translate(lang, 'log_initialisingdbm'))

addTables()