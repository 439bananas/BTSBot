/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: checkMySQL.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const log = require('../core/logHandler');
const mysql = require('mysql');

function checkMySQL(hostname, username, password, database) {
    var connection; // I was told this needed to be declared prior to the function to prevent overloading with event listeners but instead the variable should be cleared to allow multiple connections on this variable to be declared to be able to ping the server multiple times without a restart
    // nope that was a very lengthy comment; also i think that comment was in thomas language!
    if(!connection) { // See first comment
        connection = mysql.createConnection({
            host: hostname,
            user: username,
            password: password,
            database: database
        });
        connection.on('error', function(err) { // If there's an error, log and handle it, don't crash
            log.error(err);
        });
    }
    return new Promise(function(resolve, reject) { // Rejections/resolutions will be returned to the caller
        connection.connect(function (err) {
            if (err) {
                if (err.code == 'ECONNREFUSED' || err.code == 'ENOTFOUND') { // Reject with various errors based on what the server returns
                    reject('CONNECTION_REFUSED')
                } else if (err.code == 'ER_ACCESS_DENIED_ERROR') {
                    reject('INCORRECT_CREDENTIALS');
                } else if (err.code == 'ER_DBACCESS_DENIED_ERROR') {
                    reject('ACCESS_DENIED');
                } else {
                    reject('UNKNOWN_ERROR');
                    log.error(err)
                }
            } else {
                resolve('OK') // If blow test successful, return OK
            }
            connection.destroy()
        });
    });
}

module.exports = checkMySQL;