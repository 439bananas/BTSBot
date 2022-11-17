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
        checkconf()
        if ((Array.isArray(conf.ownerid) && conf.ownerid.includes(userId)) || (!Array.isArray(conf.ownerid) && conf.ownerid === userId)) {
            return true
        } else return false
    } catch (err) {
        return false;
    }

}

module.exports = isMod