/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: checkDb.cjs                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkMySQL = require('./checkMySQL.cjs')
const checkRedis = require('./checkRedis.cjs')

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