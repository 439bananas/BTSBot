/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getUserModStatus.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkconf = require('./checkConfExists')
const isOwner = require('./getUserOwnerStatus')

async function isMod(userId) { // If specified user is moderator in configured guild, return true, else or if error, return false
    try {
        checkconf()
        try {
            log.temp("fetch for getUserModStatus.js")
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
            console.log(err)
            return false;
        }
    } catch (err) { return false; }
    
}

module.exports = isMod