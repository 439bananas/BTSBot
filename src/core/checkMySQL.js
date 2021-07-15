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

var connection;
function checkmysql(hostname, username, password, database) {
    if(!connection) {
        connection = mysql.createConnection({
            host: hostname,
            user: username,
            password: password,
            database: database
        });
        connection.on('error', function(err) {
            log.error(err);
        });
    }
    return new Promise(function(resolve, reject) {
        connection.connect(function(err) {
            if (err) {
                if (err.code == 'ER_ACCESS_DENIED_ERROR') {
                    reject('INCORRECT_CREDENTIALS');
                } else if (err.code == 'ER_DBACCESS_DENIED_ERROR') {
                    reject('ACCESS_DENIED');
                } else if (err.code == 'ECONNREFUSED') {
                    reject('CONNECTION_REFUSED')
                } else {
                    reject('UNKNOWN_ERROR');
                    log.error(err)
                }
            } else {
                resolve('OK')    
            }
        });

    });
}

module.exports = checkmysql;