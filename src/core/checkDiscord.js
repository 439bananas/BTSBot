/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: checkDiscord.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

async function checkDiscord(token) {
    try {
        let rawResponse = await fetch('https://discord.com/api/v10/oauth2/applications/@me', { // Validate the token this way, we used Discord.JS to validate the token and validating the token that way barfed all sorts of weird errors
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${token}`,
            }
        })
        let json = await rawResponse.json()
        if (!json.message) {
            return "ASSUME_CLIENT_SECRET_IS_CORRECT"
        }
        else if (json.message == "401: Unauthorized") {
            throw 'TOKEN_INVALID'
        } else {
            log.error(json.message)
            throw 'UNKNOWN_DISCORD_ERROR'
        }
    } catch (err) {
        if (err.name != "FetchError") {
            throw err
        } else { // At some point when Discord's down (which is pretty frequent, I can't lie), we should test this! This currently only works as far as I know if the bot has no internet
            throw 'CANNOT_CONNECT_TO_DISCORD'
        }
    }
}

module.exports = checkDiscord;