/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getDiscordScopes.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fetch = require('node-fetch')

function getDiscordScopes(bearertoken) { // Get the scopes that belong to the bearer tokken
    return new Promise(function (resolve, reject) {
        fetch('https://discord.com/api/v10/oauth2/@me', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearertoken}`,
                'Transfer-Encoding': 'chunked'
            }
        }).then(response => response.json())
            .then(response => {
                if (response.scopes) { // If there are scopes, let's give them their scopes!
                    resolve(response.scopes)
                }
                else if (response.message == "401: Unauthorized") { // If unauthorized, we have a bad access token
                    reject("BAD_ACCESS_TOKEN")
                } else {
                    log.error(response.message)
                    reject("UNKNOWN_ERROR")
                }
            }).catch(err => {
                if (err.name == "FetchError") {
                    reject("CANNOT_CONNECT_TO_DISCORD")
                } else {
                    log.error(err)
                    reject("UNKNOWN_ERROR")
                }
            })
    })
}

module.exports = getDiscordScopes;