/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: checkRedis.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { createClient } = require('redis')

async function checkRedis(hostname, username, password, database) {
    if (!hostname) { // If no arguments are supplied (at least one should be) then throw a hissy fit
        throw "MISSING_REDIS_ARGS";
    } else {
        let url = "redis://" // Any URL will start with this
        let identity = "" // Initialise identity so we don't do weird janky stuff, we just join the identity to the end of the URL

        if (username == undefined) {
            username = "" // If no username is supplied then it's blank
        }

        if (password) { // Ideally your password shouldn't be "0" but anyway, if there is a password, append to the identity the syntax for the password, else just add the username
            identity += username + ":" + password
        } else {
            identity += username
        }

        if (!database) { // If no database, assume it to be 0
            database = 0
        }

        url += identity + "@" + hostname + "/" + database // Join the lot together

        const client = createClient({ // Let's create our client!
            url: url
        })

        try {
            await client.connect() // If all good, return "OK"
            await client.set("redisWorks", 1)
            await client.disconnect() // And disconnect
            return "OK"
        }
        catch (err) { // If we have an error, see what the error is and throw based on that
            if (err.code == "ENOTFOUND" || err.toString().includes("EHOSTUNREACH") || err.toString().includes("Connection timeout") || err.toString().includes("ECONNREFUSED")) {
                throw "REDIS_CONNECTION_REFUSED";
            } else if (err.toString().includes("WRONGPASS") || err.toString().includes("NOAUTH")) {
                throw "WRONGPASS";
            } else if (err.toString().includes("DB index is out of range")) {
                throw "BAD_DATABASE";
            } else {
                log.error(err)
                throw "UNKNOWN_ERROR"
            }
        }
    }
}

module.exports = checkRedis;