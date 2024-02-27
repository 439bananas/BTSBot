/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File: getUserOwnerStatus.cjs               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

async function isOwner(userId) { // If specified user is owner, return true, else or if error, return false
    try {
        if (!conf) throw "NO_CONF";
        if ((Array.isArray(conf.ownerid) && conf.ownerid.includes(userId)) || (!Array.isArray(conf.ownerid) && conf.ownerid === userId)) {
            return true
        } else return false
    } catch (err) {
        return false;
    }

}

module.exports = isOwner