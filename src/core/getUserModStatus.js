/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getUserModStatus.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const isOwner = require('./getUserOwnerStatus')

async function isMod(userId) { // If specified user is moderator in configured guild, return true, else or if error, return false
    try {
        if (typeof(conf) == "undefined") {
            throw "NO_CONF"
        }
        let rawResponse = await fetch('https://discord.com/api/v10/guilds/' + conf.guildid + '/members/' + userId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${conf.token}`
            }
        })
        let response = await rawResponse.json
        if ((response.roles && response.roles.includes(conf.moderatorsroleid)) || await isOwner(userId)) {
            return true;
        } else return false
    } catch (err) {
        return false;
    }
}

module.exports = isMod