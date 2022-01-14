/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: getApplicationId.js            //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const fetch = require('node-fetch')
const log = require('./logHandler')

function getid(token) {
    return new Promise(function (resolve, reject) {
        fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Fetch OAuth2 endpoint
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
    })
}

module.exports = getid;