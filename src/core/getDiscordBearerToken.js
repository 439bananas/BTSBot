/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//             File: getDiscordBearerToken.js              //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fetch = require('node-fetch')
const getid = require('./getApplicationId')

function getDiscordToken(token, clientsecret, redirecturi, code) {
    return new Promise(function promise(resolve, reject) {
        getid(token).then(id => {
            fetch("https://discord.com/api/v10/oauth2/token", { // Get the token
                method: 'POST',
                body: new URLSearchParams({
                    client_id: id,
                    client_secret: clientsecret, // I was an idiot and forgot the underscore then wondered for ages why it wasn't working
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirecturi
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response.json())
                .then(response => {
                        log.tempinfo(response.error)
                    if (response.error && response.error == "invalid_client") { // If any kinds of errors, reject with x error
                        reject("BAD_DISCORD_CLIENT_SECRET")
                    } else if (response.error == "invalid_grant") {
                        reject("BAD_CODE")
                    }
                    else if (response.error) {
                        reject("UNKNOWN_DISCORD_ERROR")
                        log.error(response.error)
                    } else {
                        resolve({ "bearertoken": response.access_token, "refreshtoken": response.refresh_token })
                    }
                }).catch(err => {
                    reject("CANNOT_CONNECT_TO_DISCORD")
                })
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = getDiscordToken