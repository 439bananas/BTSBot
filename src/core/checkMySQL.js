/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//               File: checkMySQL.js               //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('../core/logHandler');
const mysql = require('mysql');

var connection; // Apparently this needs to be declared prior to the function to prevent overloading with event listeners
function checkmysql(hostname, username, password, database) {
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
    return new Promise(function(resolve, reject) { // Rejections/resolutions will be returned to the called
        connection.connect(function(err) {
            if (err) {
                if (err.code == 'ER_ACCESS_DENIED_ERROR') { // Reject with various errors based on what the server returns
                    reject('INCORRECT_CREDENTIALS');
                } else if (err.code == 'ER_DBACCESS_DENIED_ERROR') {
                    reject('ACCESS_DENIED');
                } else if (err.code == 'ECONNREFUSED' || err.code == 'ENOTFOUND') {
                    reject('CONNECTION_REFUSED')
                } else {
                    reject('UNKNOWN_ERROR');
                    log.error(err)
                }
            } else {
                resolve('OK') // If blow test successful, return OK
            }
        });
        connection.end()
    });
}

module.exports = checkmysql;