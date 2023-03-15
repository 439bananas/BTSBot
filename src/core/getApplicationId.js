/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getApplicationId.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fetch = require('node-fetch')
let id
let tokencache

function getid(token) {
    return new Promise(function (resolve, reject) {
        if (tokencache != token) { // Let's try and minimise our requests to Discord as much as possible
            log.temp(++requestsToDiscord)
        log.temp("getting the application id")
            tokencache = token
            fetch('https://discord.com/api/v10/oauth2/applications/@me', { // Fetch OAuth2 endpoint
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bot ${token}`,
                    'Transfer-Encoding': 'chunked'
                }
            })
                .then(response => response.json())
                .then(json => {
                    if (!json.mesage) {
                        id = json.id
                        resolve(json.id)
                    }
                    else if (json.message == "401: Unauthorized") { // Reject if token invalid or other error
                        reject('TOKEN_INVALID')
                    } else {
                        reject('UNKNOWN_DISCORD_ERROR')
                        log.error(json.message)
                    }
                }).catch(err => {
                    if (err.name == "FetchError") {
                        reject("CANNOT_CONNECT_TO_DISCORD")
                    }
                })
        } else {
            resolve(id)
        }
    })
}

module.exports = getid;