/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: checkBotInfGuild.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkconf = require('./checkConfExists')

async function getGuildPresence(guildId) {
    try {
        let rawResponse = await fetch('https://discord.com/api/v10/guilds/' + guildId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${conf.token}`
            }
        })
        let response = await rawResponse.json()
        if (response.id) {
            return true
        } else return false
    } catch (err) {
        return false
    }
}
    

async function botInGuild(guildId, bypassCache) { // If bot in specified guild, return true, else or if error, return false
    try {
        checkconf()
        if (bypassCache) { // Let's bypass cache, especially if the number of guilds we need to check the bot is in is one or a small number
            try {
                let guildPresence = await getGuildPresence(guildId)
                return guildPresence
            } catch (err) { return false; }
        } else {
            try {
                let botPresence = await redisConnection.get('BotInGuild:' + guildId) // Caching for large scale since accuracy, at least in this case, should only have cosmetic effects
                if (botPresence == null) {
                    let guildPresence = Number((await getGuildPresence(guildId))).toString()
                    redisConnection.set(`BotInGuild:${guildId}`, guildPresence)
                    redisConnection.expire('BotInGuild:' + guildId, 7200) // This should expire in two hours
                    return Number(guildPresence)
                } else {
                    return Number(botPresence) // If not in cache, contact Discord's API, else return cached value
                }
            } catch (err) { return false; }
            try {
                let guildPresence = await getGuildPresence(guildId)
                return Number(guildPresence)
            } catch (err) { return false; }
        }
    } catch (err) {
        return false;
    }

}

module.exports = botInGuild