/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File ensureRedisReady.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

let server = 0

redisConnection.on("ready", (ready) => { // Only when Redis is ready should we start the server
    if (server == 0) { // Make sure that server is only started once
        require("../server/createServer")
        server++
    }
})