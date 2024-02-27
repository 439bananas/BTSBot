/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: checkMySQL.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { createConnection } from 'mysql2';

function checkMySQL(hostname, username, password, database, port) {
    let newPort
    if (!port) {
        newPort = 3306
    } else {
        newPort = port
    }
    let connection; // I was told this needed to be declared prior to the function to prevent overloading with event listeners but instead the variable should be cleared to allow multiple connections on this variable to be declared to be able to ping the server multiple times without a restart
    // nope that was a very lengthy comment; also i think that comment was in thomas language!
    if(!connection) { // See first comment
        connection = createConnection({
            host: hostname.toString(),
            user: username.toString(),
            password: password.toString(),
            database: database.toString(),
            port: newPort
        });
        connection.on('error', function(err) { // If there's an error, log and handle it, don't crash
            log.error(err);
            console.log(err)
        });
    }
    return new Promise(function(resolve, reject) { // Rejections/resolutions will be returned to the caller
        if (!hostname || !username || !password || !database) {
            reject("MISSING_ARGS")
        }
        connection.connect(function (err) {
            if (err) {
                switch (err.code) {
                    case 'ECONNREFUSED': // Reject with various errors based on what the server returns
                        reject('CONNECTION_REFUSED')
                        break
                    case 'ENOTFOUND':
                        reject('CONNECTION_REFUSED')
                        break
                    case 'ETIMEDOUT':
                        reject('CONNECTION_REFUSED')
                        break
                    case 'ER_ACCESS_DENIED_ERROR':
                        reject('INCORRECT_CREDENTIALS');
                        break
                    case 'ER_DBACCESS_DENIED_ERROR':
                        reject('ACCESS_DENIED');
                        break
                    default:
                        log.error(err)
                        reject('UNKNOWN_ERROR');
                }
            } else {
                resolve('OK') // If success, return OK
            }
            connection.destroy()
        });
    });
}

export default checkMySQL;