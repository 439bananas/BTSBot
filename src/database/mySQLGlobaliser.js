/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: mySQLGlobaliser.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const mysql = require('mysql2')

let MySQLIntConnection = mysql.createConnection({
    host: conf.hostname,
    user: conf.dbusername,
    password: conf.dbpassword,
    database: conf.database
});

MySQLIntConnection.on('error', function (err) { // If there's an error, log and handle it, don't crash
    log.error(err);
});

global.MySQLConnection = MySQLIntConnection.promise()

MySQLConnection.connect()