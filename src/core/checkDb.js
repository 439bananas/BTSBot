/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: checkDb.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkMySQL = require('./checkMySQL')
const checkRedis = require('./checkRedis')

async function checkDatabase(mysqlhostname, mysqlusername, mysqlpassword, mysqldb, redishostname, redisusername, redispassword, redisdb) {
    try {
        let mySQLResponse = await checkMySQL(mysqlhostname, mysqlusername, mysqlpassword, mysqldb)
        let redisResponse = await checkRedis(redishostname, redisusername, redispassword, redisdb)
        if (mySQLResponse == "OK" && redisResponse == "OK") {
            return "OK"
        }
    } catch (err) {
        throw err;
    }
}

module.exports = checkDatabase