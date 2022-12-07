/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getUserGuilds.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

async function getGuilds(bearerToken) { // Get the guilds for a user that the specified bearer token belongs to
    try {
        log.temp("fetch for getUserGuilds.js")
        let rawResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            }
        })
        let response = await rawResponse.json()
        if (response.message == undefined) {
            return response
        } else if (response.message) {
            switch (response.message) {
                case "401: Unauthorized": // If user does not have the right scopes or has invalid bearer token throw that error
                    throw "BAD_DISCORD_BEARER_TOKEN"
                    break;
                default:
                    throw "UNKNOWN_ERROR"
            }
        }
    } catch (err) {
        if (err.name != "FetchError") {
            throw err;
        } else {
            log.temp("getUserGuilds failed")
            throw "CANNOT_CONNECT_TO_DISCORD"
        }
    }
}

module.exports = getGuilds