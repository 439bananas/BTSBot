/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File redisFailureEvent.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getlang = require("../core/getLanguageJSON");

redisConnection.on('error', (err) => { // If Redis gets disconnected then reconnect and send out error
    getlang().then(lang => {
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
})