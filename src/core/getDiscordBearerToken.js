/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//             File: getDiscordBearerToken.js              //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fetch = require('node-fetch')
const getid = require('./getApplicationId')
const getaddress = require('./getReqAddress')

function getDiscordToken(req, conf) {
    return new Promise(function promise(resolve, reject) {
        getid(conf.token).then(id => {
            fetch("https://discord.com/api/v10/oauth2/token", { // Get the token
                method: 'POST',
                body: new URLSearchParams({
                    'client_id': id,
                    'client_secret': conf.discordclientsecret, // I was an idiot and forgot the underscore then wondered for ages why it wasn't working
                    'grant_type': 'authorization_code',
                    'code': req.query.code,
                    'redirect_uri': getaddress(req) + "/config"
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response.json())
                .then(response => {
                    if (response.error && response.error == "invalid_client") { // If any kinds of errors, reject with x error
                        reject("BAD_DISCORD_CLIENT_SECRET")
                    } else if (response.error == "invalid_request") {
                        reject("BAD_CODE")
                    }
                    else if (response.error) {
                        reject("UNKNOWN_DISCORD_ERROR")
                        log.error(response.error)
                    } else {
                        resolve(response.access_token)
                    }
                })
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = getDiscordToken