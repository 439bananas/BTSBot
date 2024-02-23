/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: checkUserSignedIn.cjs               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getDiscordUser = require('./getDiscordUserInfo.cjs')
const refreshBearerToken = require('./refreshDiscordBearerToken.cjs')

async function signedIn(req, res) { // Return a value depending on whether the user is signed in or not
    try {
        if (req.confExists) {
            let user = await getDiscordUser(req.cookies.discordbearertoken) // Check that the bearer token works
            if (user) {
                return true // Return true if it does
            }
        } else {
            throw req.confErr
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