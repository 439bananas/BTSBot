/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: getOwnerId.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const { Team } = require('discord.js')
const fetch = require('node-fetch')
let teammembers

function getOwner(token) {
    return new Promise(function (resolve, reject) {
        teammembers = []
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
                switch (json.mesage) {
                    case undefined:
                        if (json.team.members) { // If team, send team members, else send owner ID
                            for (i in json.team.members) {
                                teammembers.push(json.team.members[i].user.id)
                            }
                            resolve(teammembers)
                        } else {
                            resolve(json.owner.id)
                        }
                        break;
                    case "401: Unauthorized": // Reject if token invalid or other error
                        reject('TOKEN_INVALID')
                        break;
                    default:
                        reject('UNKNOWN_DISCORD_ERROR')
                        log.error(json.message)
                        break;
                }
            }).catch(err => {
                if (err.name == "FetchError") {
                    reject("CANNOT_CONNECT_TO_DISCORD")
                } else {
                    reject("UNKNOWN_DISCORD_ERROR")
                }
            })
    })
}

module.exports = getOwner