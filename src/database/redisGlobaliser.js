/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: redisGlobaliser.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { redis } = require('googleapis/build/src/apis/redis')
const { createClient } = require('redis')

async function globaliseRedis() {
    let url = "redis://" + conf.redisusername // Construct our URL
    let identity = ""
    let lang = getlang()

    if (conf.password != "") {
        url += ":" + conf.redispassword
    }

    url += "@" + conf.redishostname + "/" + conf.redisdatabase

    global.redisConnection = createClient({ // Let's create our client!
        url: url
    })

    redisConnection.connect() // Connect to Redis

    require('./redisFailureEvent')
}

module.exports = globaliseRedis;