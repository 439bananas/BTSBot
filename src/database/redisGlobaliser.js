/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: redisGlobaliser.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { createClient } = require('redis')

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

redisConnection.on('error', (err) => { // If Redis gets disconnected then reconnect and send out error
    switch (err.message) {
        case "Socket closed unexpectedly":
            log.warn(translate(lang, "log_redisconnectionlost"))
            break;
        case "Connection timeout":
            log.warn(translate(lang, "log_redisreconnecting"))
            break;
        default:
            log.error(err)
    }
})