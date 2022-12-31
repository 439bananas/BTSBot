/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getUserOwnerStatus.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkconf = require('./checkConfExists')

async function isMod(userId) { // If specified user is owner, return true, else or if error, return false
    try {
        log.temp("getUserOwnerStatus.js:17")
        checkconf()
        if ((Array.isArray(conf.ownerid) && conf.ownerid.includes(userId)) || (!Array.isArray(conf.ownerid) && conf.ownerid === userId)) {
            return true
        } else return false
    } catch (err) {
        log.temp("getUserOwnerStatus.js:23")
        log.temp(err)
        return false;
    }

}

module.exports = isMod