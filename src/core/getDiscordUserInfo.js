/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getDiscordUserInfo.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

let response
let user

async function fetchDiscordUser(bearertoken) {
    try {
        let fetchRes = await fetch('https://discord.com/api/v10/users/@me', { // We were going to properly check for scopes except it made loading the page for the first time per new bearer token per session that the bot is running incredibly slow
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearertoken}`
            }
        })
        response = await fetchRes.json()
        return response
    } catch (err) {
        if (err.name == "FetchError") {
            throw "CANNOT_CONNECT_TO_DISCORD"
        } else {
            log.error(err)
            throw "UNKNOWN_ERROR"
        }
    }
}

function requireValidDiscordUserResp(discordUserResp) {
    if (discordUserResp.message == "401: Unauthorized") { // If unauthorized, we have a bad access token
        throw "BAD_ACCESS_TOKEN"
    }
    else if (!(discordUserResp.email && discordUserResp.discriminator)) { // We do at least need the identify and email scopes...
        throw "WRONG_SCOPES"
    }
}

async function getDiscordUser(bearertoken) { // Get the user's info from their bearer token
    try {
        let cachedInfo = await redisConnection.json.get('DiscordBearerToken:' + bearertoken)
        if (cachedInfo == null) {
            try {
                user = await fetchDiscordUser(bearertoken) // Fetch our user
            } catch (err) {
                log.temp(err.name)
                log.temp(err.code)
                log.temp("getDiscordUserInfo.js:55")
                throw err;
            }
            await requireValidDiscordUserResp(user) // Throw errors if anything bad happens
            if (user.email && user.discriminator) { // If we have the email and discriminator, we should be good
                redisConnection.json.set('DiscordBearerToken:' + bearertoken, '$', user) // Cache our response
                redisConnection.expire('DiscordBearerToken:' + bearertoken, 86400) // This should expire in a day if anything
                // We were previously using a method where we had a cache object and put things in that but we figured on different platforms it would cause stability/performance/resources problems and could potentially hang devices like Raspberry Pi so we switched to Redis
            } else { // If something weird, we possibly have an error, v10 shouldn't from this point in have any breaking changes (they should be issued in v11 or so)
                log.error(user.message)
                log.temp("getDiscordUserInfo.js:65")
                log.temp(user.code)
                log.temp(user.name)
                throw "UNKNOWN_ERROR"
            }
            return user;
        } else {
            return cachedInfo;
        }
    } catch (err) {
        switch (err) {
            case "CANNOT_CONNECT_TO_DISCORD":
                throw err;
                break;
            case "BAD_ACCESS_TOKEN":
                throw err;
                break;
            case "WRONG_SCOPES":
                throw err;
                break;
            default:
                log.error(err)
                log.temp("getDiscordUserInfo.js:88")
                log.temp(err.code)
                log.temp(err.name)
                throw "UNKNOWN_ERROR"
        }
    }
}

module.exports = getDiscordUser