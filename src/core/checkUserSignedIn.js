/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: checkUserSignedIn.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('../core/checkConfExists')
const getDiscordUser = require('./getDiscordUserInfo')
const refreshBearerToken = require('./refreshDiscordBearerToken')

async function signedIn(req, res) { // Return a value depending on whether the user is signed in or not
    try {
        let confexists = await checkConf() // If conf does not exist, return false, else check if user bearer token has not expired or exists at all
        if (confexists) {
            let user = await getDiscordUser(req.cookies.discordbearertoken) // Check that the bearer token works
            if (user) {
                return true // Return true if it does
            }
        }
    } catch (err) {
        if (err == "BAD_ACCESS_TOKEN") { // Bad access token? Refresh it
            try {
                let tokens = await refreshBearerToken(req.cookies.discordrefreshtoken)
                if (tokens) {
                    res.cookie("discordbearertoken", tokens.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                    res.cookie('discordrefreshtoken', tokens.refreshtoken, { httpOnly: true })
                    res.redirect(req.originalUrl) // Refresh and reload the page
                }
                return;
            } catch (err) {
                return false; // If bad conf, bearer token or some other issue, return false
            }
        } else return false;
    }
}

module.exports = signedIn