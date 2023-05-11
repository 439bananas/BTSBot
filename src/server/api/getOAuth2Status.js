/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getOAuth2Status.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getaddress = require('../../core/getReqAddress')
const getgoogletoken = require('../../core/getGoogleToken')
const fs = require('fs')
const getid = require('../../core/getApplicationId')
const getDiscordToken = require('../../core/getDiscordBearerToken')
const getDiscordUser = require('../../core/getDiscordUserInfo')
const getazuretoken = require('../../core/getAzureToken')
const { createClient } = require('redis')
const express = require('express');
const checkConf = require('../../core/checkConfExists')
const getlang = require('../../core/getLanguageJSON')
const router = express.Router();
let conf

async function attemptRedisConnectionCreation() {
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json')) && fs.existsSync(path.join(__dirname, '..', 'configs', 'confinterim.json'))) {
            let confExists = await checkConf("confinterim")
            void confExists
            conf = require('../../../configs/confinterim.json')

            let url = "redis://" + conf.redisusername

            if (conf.password != "") {
                url += ":" + conf.redispassword
            }

            url += "@" + conf.redishostname + "/" + conf.redisdatabase

            global.redisConnection = createClient({ // Forgot that redisConnection does not yet exist
                url: url
            })

            await redisConnection.connect()
            await redisConnection.set('RedisConnected', "true") // Set a test value
            
            let redisConnectionWorks = await redisConnection.get('RedisConnected') // Get it so that the function is only completed when it *knows* Redis works

            return redisConnectionWorks // ? We wait for Redis connection to be established
        }
    } catch (err) {
        console.log(err)
        void err
    }
}

async function googleOauth2(req, res, conf) { // Cope with Google's OAuth2 in a more compact fashion
    let token
    let oAuthUrl
    if (!req.cookies.googlebearertoken && conf.googleclientid != "") { // If no googlebearertoken cookie and there is a client ID configured:
        if (!req.query.code && !req.query.error) { // If there is no OAuth2 code and there is no error, get the OAuth2 link and tell the caller to redirect to it
            oAuthUrl = await getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config") // Huh, I never knew that Google's library refuses outright to provide an OAuth2 link if the client ID or client secret are invalid
            res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
        } else if (req.query.error) { // If there is an error, return it
            res.status(400).json({ error: req.query.error })
        } else { // If there is a code and no error:
            try {
                token = await getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config", req.query.code) // Get the Google bearer token with set settings, scopes and code
                res.cookie('googlebearertoken', token, { maxAge: 3600000, httpOnly: true }); // Store as cookie
                fs.rename(path.join(__dirname, '..', 'configs', 'confinterim.json'), path.join(__dirname, '..', 'configs', 'conf.json'), function (err) { // Rename conf interim to conf
                    if (err) log.error(err);
                    res.json({ message: "OAUTH_OK" })// OAuth is OK, config complete!
                        restart() // Restart automatically; although whether it will actually show the config complete page properly is another question and definitely unlikely
                })
            } catch (err) { // If an error has happened, catch it
                switch (err) {
                    case "BAD_GOOGLE_CLIENT_SECRET": // If bad client secret, return OAUTH_FAIL
                        res.status(400).json({ error: "OAUTH_FAIL" })
                        break;
                    case "CANNOT_CONNECT_TO_GOOGLE": // If cannot connect to Google or some other error, return the error
                        res.status(400).json({ error: err })
                        break;
                    case "BAD_CODE": // If bad code, advise the caller to redirect to Google OAuth2
                        oAuthUrl = await getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config")
                        res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                        break;
                    default: // Else, return the error and log it
                        res.status(400).json({ error: err })
                        log.error(err)
                        break;
                }
            }
        }
    } else if (conf.googleclientid == "") { // If there is no client ID in the conf, configuration is complete!
        fs.rename(path.join(__dirname, '..', 'configs', 'confinterim.json'), path.join(__dirname, '..', 'configs', 'conf.json'), function (err) { // Rename conf interim to conf
            if (err) log.error(err);
            res.json({ message: "OAUTH_OK" }) // OAuth is OK, config complete!
                restart() // Restart automatically; although whether it will actually show the config complete page properly is another question and definitely unlikely
        })
    } else { // If there is a cookie but the conf has not been renamed yet for whatever reason... that's weird...
        try {
            let rawResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { // Fetch userinfo, a granted scope
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${req.cookies.googlebearertoken}`
                }
            })
            let response = rawResponse.json() // Convert response to JSON form
            if (response.id) { // If there is an ID, configuration is complete!
                fs.rename(path.join(__dirname, '..', 'configs', 'confinterim.json'), path.join(__dirname, '..', 'configs', 'conf.json'), function (err) { // Rename conf interim to conf
                    if (err) log.error(err);
                    res.json({ message: "OAUTH_OK" }) // OAuth is OK, config complete!
                        restart() // Restart automatically; although whether it will actually show the config complete page properly is another question and definitely unlikely
                })
            } else { // Else, restart OAuth2 verification
                res.clearCookie("googlebearertoken")
                oAuthUrl = await getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config")
                res.stasjson({ message: "OAUTH_REDIRECT", url: oAuthUrl })
            }
        } catch (err) {
            res.status(400).json({ error: "CANNOT_CONNECT_TO_GOOGLE" }) // And if there is an error then we probably can't connect to Google.
        }
    }
}

router.get('/', async (req, res, next) => { // Let's validate our OAuth2 with rather a lengthy function!
    async function validateOAuth2() {
        let token
        let oAuthUrl
        let id
        if (req.confExists) { // Does the configuration already exist? If it does, do not do anything else.
            res.status(400)
            res.json({ error: "CONF_OK" })
        } else {
            try {
                let confExists = await checkConf("confinterim")
                void confExists
                conf = require('../../../configs/confinterim.json')
                if (!req.cookies.discordbearertoken) { // Is there any Discord bearer token in our cookies?
                    if (!req.query.code) { // If there isn't check to see if there's a code in our query, if there isn't that either then redirect to our OAuth2 page
                        try {
                            id = await getid(conf.token)
                            res.status(200).json({ message: "OAUTH_REDIRECT", url: 'https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none' })
                        } catch (err) { // If there's an error, handle it, we don't want any obnoxious crashes now
                            throw err; // Throw the error to the outside loop to handle
                        }
                    } else { // If there is a code in our query, let's do the following:
                        token = await getDiscordToken(conf.token, conf.discordclientsecret, getaddress(req) + "/config", req.query.code) // Get our bearer token
                        res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // If we can get it, store it in our cookies for a week and instruct the caller to refresh the page
                        res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                        res.status(200).json({ message: "REFRESH_PAGE" })
                    }
                } else { // If we have a Discord bearer token in our cookies, try getting the information for the user in question to validate the token
                    let user = await getDiscordUser(req.cookies.discordbearertoken)
                    if (!user.id) throw "WRONG_SCOPES";
                    if (!req.cookies.msbearertoken && conf.msclientid != "") {  // Check to see if client ID is configured, if not, skip this entire section
                        if (!req.query.code) { // If it is and there is no query, get the AAD URL and redirect to it
                            oAuthUrl = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                            res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                        } else { // If there is a code query, get the Azure bearer token and store as a cookie
                            token = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config", req.query.code)
                            res.cookie("msbearertoken", token)
                            res.status(200).json({ message: "REFRESH_PAGE" })
                        }
                    } else if (conf.msclientid == "") { // If Microsoft 365 client ID is not configured, skip this step
                        googleOauth2(req, res, conf)
                    } else {  // If there is a cookie, validate it and get the user's profile
                        let rawResponse
                        try {
                            rawResponse = await fetch('https://graph.microsoft.com/oidc/userinfo', {
                                method: "GET",
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": `Bearer ${req.cookies.msbearertoken}`
                                }
                            })
                        } catch (err) { // If fetch failure, then return "CANNOT_CONNECT_TO_MICROSOFT"
                            res.status(400).json({ error: "CANNOT_CONNECT_TO_MICROSOFT" })
                        }

                        if (rawResponse) {
                            let response = await rawResponse.json()
                            if (response.error) { // If there is an error, throw it to the outsie
                                throw response.error.code;
                            } else if (response.email) { // If there is a valid response, follow Google's OAuth2 procedure
                                googleOauth2(req, res, conf)
                            } else { // If something weird happens, throw the response back
                                log.error("************************************************")
                                console.log(JSON.stringify(response))
                                log.error("************************************************")
                                throw response
                            }
                        }
                    }
                }
            } catch (err) { // If the interim conf does not exist, then return that error
                let confErrs = [ // If the error is anything from checkConf(), return NO_CONF
                    false,
                    "MISSING_FIELDS",
                    "TOKEN_INVALID",
                    "UNKNOWN_DISCORD_ERROR",
                    "MISSING_ARGS",
                    "CONNECTION_REFUSED",
                    "INCORRECT_CREDENTIALS",
                    "ACCESS_DENIED",
                    "UKNOWN_ERROR",
                    "MISSING_REDIS_ARGS",
                    "REDIS_CONNECTION_REFUSED",
                    "WRONGPASS",
                    "BAD_DATABASE"
                ]
                if (confErrs.includes(err)) {
                    res.status(400)
                    res.json({ error: "NO_CONF" })
                } else {
                    async function redirectUserToDiscordOAuth2(req, res, conf, id) { // Redirects the user to Discord's OAuth2 page
                        try {
                            let token = await getDiscordToken(conf.token, conf.discordclientsecret, getaddress(req) + "/config", req.query.code)
                            res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // If we can get it, store it in our cookies for a week and instruct the caller to refresh the page
                            res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                            res.status(200).json({ message: "REFRESH_PAGE" })
                        } catch (err) {
                            switch (err) {
                                case "CANNOT_CONNECT_TO_DISCORD": // Can we not connect to Discord? Oh. We can't do anything about that so expect that the React app will show a wall
                                    res.status(400).json({ error: err })
                                    break;
                                case "BAD_CODE": // If we have a bad code, redirect to OAuth2 to regenerate another one, should be simple enough
                                    res.status(200).json({ message: "OAUTH_REDIRECT", url: 'https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none' })
                                    break;
                                case "BAD_CLIENT_SECRET": // Bad client secrets could be due to misconfuguration or some other error
                                    res.status(400).json({ error: "OAUTH_FAIL" })
                                    break;
                            }
                        }
                    }
                    try {
                        id = await getid(conf.token)
                        switch (err) {
                            case "CANNOT_CONNECT_TO_DISCORD": // Can we not connect to Discord? Oh. We can't do anything about that so expect that the React app will show a wall
                                res.status(400).json({ error: err })
                                break;
                            case "BAD_CODE": // If we have a bad code, redirect to OAuth2 to regenerate another one, should be simple enough
                                if (!req.cookies.discordbearertoken) { // Try to discover what caused "BAD_CODE"
                                    throw "BAD_ACCESS_TOKEN"
                                } else {
                                    let user = await getDiscordUser(req.cookies.discordbearertoken)
                                    if (user.id) {
                                        oAuthUrl = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                                        res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                                    } else {
                                        throw "BAD_ACCESS_TOKEN"
                                    }
                                }
                                break;
                            case "BAD_CLIENT_SECRET": // Bad client secrets could be due to misconfuguration or some other error
                                res.status(400).json({ error: "OAUTH_FAIL" })
                                break;
                            case "BAD_CLIENT_SECRET_OR_CODE": // ^^ Unfortunately, there is no way to differentiate between the two errors in MSAL so best thing to do is redisplay the configuration page
                                res.status(400).json({ error: "OAUTH_FAIL" })
                                break;
                            case "BAD_ACCESS_TOKEN": // If BAD_ACCESS_TOKEN or WRONG_SCOPES then follow the OAuth2 flow again
                                if (req.query.code) {
                                    redirectUserToDiscordOAuth2(req, res, conf, id)
                                } else {
                                    res.status(200).json({ message: "OAUTH_REDIRECT", url: 'https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none' })
                                }
                                break;
                            case "WRONG_SCOPES":
                                if (req.query.code) {
                                    redirectUserToDiscordOAuth2(req, res, conf, id)
                                } else {
                                    res.status(200).json({ message: "OAUTH_REDIRECT", url: 'https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none' })
                                }
                                break;
                            case "InvalidAuthenticationToken": // If invalid token and there not is a code, redirect back to MS OAuth2
                                if (!req.query.code) {
                                    oAuthUrl = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                                    res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                                } else { // If there is a code, get the bearer token and redirect to /config, storing the token as a cookie
                                    try {
                                        let token = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config", req.query.code) // If all good, store as cookie and refresh
                                        res.cookie("msbearertoken", token)
                                        res.status(200).json({ message: "REFRESH_PAGE" })
                                    } catch (err) {
                                        oAuthUrl = getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                                        res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                                    }
                                }
                                break;
                            default: // Potentially some other error could have come up, return the error and log it
                                log.error("************************************************")
                                console.log(err)
                                log.error("************************************************")
                                res.status(400).json({ error: err })
                                break;
                        }
                    } catch (err) { // If error getting ID, then complain, either at no conf, or unknown error
                        switch (err) {
                            case "TOKEN_INVALID":
                                res.status(400)
                                res.json({ error: "NO_CONF" })
                                break;
                            case "BAD_ACCESS_TOKEN":
                                id = await getid(conf.token)
                                res.status(200).json({ message: "OAUTH_REDIRECT", url: 'https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none' })
                                break;
                            case "CANNOT_CONNECT_TO_DISCORD":
                                res.status(400).json({ error: err })
                                break;
                            case "WRONG_SCOPES":
                                id = await getid(conf.token)
                                res.status(200).json({ message: "OAUTH_REDIRECT", url: 'https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none' })
                                break;
                            default:
                                log.error("************************************************")
                                console.log(err)
                                log.error("************************************************")
                                res.status(400).json({ error: err })
                                break;
                        }
                    }
                }
            }
        }
    }

    if (typeof (redisConnection) == "undefined") { // If no Redis connection, such as when the machine is on (or has been when the solution has been run) college wifi and cannot connect to servers outside of HTTP and HTTPS then attempt to connect to Redis
        let lang = await getlang()
        attemptRedisConnectionCreation().then(r => {
            if (typeof (redisConnection) != "undefined") {
                require('../../database/redisFailureEvent') // Deal with failures etc
            }

            if (r) { // Use r directly
                log.info(translate(lang, "log_testresponsefromredis") + r) // -sigh-
                validateOAuth2()
            }
        });
    } else {
        validateOAuth2() // If there is a Redis connection, just validate OAuth2 at this point
    }
})

module.exports = router;