/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: mySQLGlobaliser.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const mysql = require('mysql2')

async function globaliseMySQL() {
    let newPort
    if (!conf.port) {
        newPort = 3306
    } else {
        newPort = conf.port
    }
    let MySQLIntConnection = mysql.createPool({
        host: conf.hostname,
        user: conf.dbusername,
        password: conf.dbpassword,
        database: conf.database,
        port: newPort
    });

    MySQLIntConnection.on('error', function (err) { // If there's an error, log and handle it, don't crash
        log.error(err);
    });

    global.MySQLConnection = MySQLIntConnection.promise()

    MySQLIntConnection.on('end', function (msg) {
        console.log(msg)
    })

    let re = {protocolVersion: "b"}//await MySQLConnection.connect()
    return re
}

module.exports = globaliseMySQL;