/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//              File: checkDiscord.js              //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

// THIS FILE NEEDS WORK & A FUNCTION

const log = require('../core/logHandler');
const fetch = require('node-fetch')

async function checkDiscord(token) {
    return new Promise(function (resolve, reject) { // Rejections/resolutions will be returned to the caller
        fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Validate the token this way, we used Discord.JS to validate the token and validating the token that way barfed all sorts of weird errors
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${token}`,
                'Transfer-Encoding': 'chunked'
            }
        })
            .then(res => res.json())
            .then(json => {
                if (!json.message) {
                    resolve("ASSUME_CLIENT_SECRET_IS_CORRECT")
                }
                else if (json.message == "401: Unauthorized") {
                    reject('TOKEN_INVALID')
                } else {
                    reject('UNKNOWN_DISCORD_ERROR')
                    log.error(json.message)
                }
            })
            .catch(err => {
                if (err.name == "FetchError") { // At some point when Discord's down (which is pretty frequent, I can't lie), we should test this! This currently only works as far as I know if the bot has no internet
                    reject('CANNOT_CONNECT_TO_DISCORD')
                }
            })
    })
}

module.exports = checkDiscord;