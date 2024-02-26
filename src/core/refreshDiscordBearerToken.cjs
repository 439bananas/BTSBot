/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//           File: refreshDiscordBearerToken.cjs           //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getid = require('./getApplicationId.js').default

async function refreshBearerToken(refreshtoken) {
    try {
        let clientid = await getid(conf.token)
        let rawResponse = await fetch('https://discord.com/api/v10/oauth2/token', { // Send POST request for bearer token
            method: "POST",
            body: new URLSearchParams({
                'client_id': clientid,
                'grant_type': 'refresh_token',
                'client_secret': conf.discordclientsecret,
                'refresh_token': refreshtoken
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        let response = await rawResponse.json() // Convert to JSON format

        if (response.error != undefined) { // Throw errors depending on what Discord says
            switch (response.error) {
                case "invalid_client":
                    throw "BAD_CLIENT_SECRET"
                    break;
                case "invalid_grant":
                    throw "BAD_REFRESH_TOKEN"
                    break;
                default:
                    log.error(response.error)
                    throw "UNKNOWN_ERROR"
            }
        }

        if (response.message != undefined) {
            log.error(response.message)
            throw "UNKNOWN_ERROR"
        } else return { "bearertoken": response.access_token, "refreshtoken": response.refresh_token } // If success, return barer token and refresh token
    } catch (err) {
        if (err.name == "FetchError") {
            throw "CANNOT_CONNECT_TO_DISCORD"
        } else {
            throw err
        }
    }
}

module.exports = refreshBearerToken;