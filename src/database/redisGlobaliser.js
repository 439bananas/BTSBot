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

import { createClient } from 'redis'
let connection

async function redisConnection() {
    if (!connection) {
        try {
            let url = "redis://" + conf.redisusername // Construct our URL
            let identity = ""
            let lang = await getlang()

            if (conf.password != "") {
                url += ":" + conf.redispassword
            }

            url += "@" + conf.redishostname + "/" + conf.redisdatabase

            connection = await createClient({ // Let's create our client!
                url: url
            })

            global.redisConnection = connection
            connection.connect() // Connect to Redis
            import('./redisFailureEvent.js')
            return connection
        } catch (err) {
            console.log(err)
            void err
            return undefined
        }

    } else {
        console.log(connection.isReady)
        return connection
    }
}

redisConnection()

export default redisConnection;