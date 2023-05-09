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

// this is a right mammoth task

const getaddress = require('../../core/getReqAddress')
const getgoogletoken = require('../../core/getGoogleToken')
const showconf = require('../displayConf')
const showwall = require('../displayWall')
const showconfigcomplete = require('../displayConfigComplete')
const fs = require('fs')
const getid = require('../../core/getApplicationId')
const getDiscordToken = require('../../core/getDiscordBearerToken')
const getDiscordUser = require('../../core/getDiscordUserInfo')
const getazuretoken = require('../../core/getAzureToken')
const { createClient } = require('redis')
const express = require('express');
const getlang = require('../../core/getLanguageJSON')
const checkConf = require('../../core/checkConfExists')
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

            redisConnection.connect()
        }

    } catch (err) {
        void err
    }
}

attemptRedisConnectionCreation().then(r => {
    if (typeof(redisConnection) != "undefined") {
        require('../../database/redisFailureEvent')
    }
})

async function googleOauth2(req, res, conf) {
    let lang = await getlang()
    res.status(200).json({ message: "CONTINUE_TO_GOOGLE" })
    if (!req.cookies.googlebearertoken) {
        if (!req.query.code && !req.query.error) {
        }
    }
    // if no google bearer token and there is a google client id:
    //      if no code in query and no error in query:
    //          get the google redirect url using getgoogletoken() and return "OAUTH_REDIRECT" with the returned link
    //      else if error in query, return the error
    //      else:
    //          try:
    //              get the google token
    //              send the google bearer token cookie
    //              rename the interim conf to conf.json
    //              in the callback:
    //                  if error, then return the error
    //                  else, show the config complete page and restart
    //          upon failure:
    //              switch/case the error:
    //                  if "BAD_GOOGLE_CLIENT_SECRET":
    //                      return "OAUTH_FAIL"
    //                  if "CANNOT_CONNECT_TO_GOOGLE":
    //                      return "CANNOT_CONNECT_TO_GOOGLE"
    //                  if "BAD_CODE":
    //                      return "OAUTH_REDIRECT" and then the oauth2 link for google (use getgoogletoken() once again)
    //                  else:
    //                      return the error
    // else if no google client id:
    //      rename the interim conf to conf.json
    //      in the callback:
    //          if error, then return the error
    //          else, show the config complete page and restart
    // else:
    //      make a request to google's userinfo api, convert response to json, etc
    //      with the response:
    //          if there is a response id:
    //              rename the interim conf to conf.json
    //              in the callback:
    //                  if error, then return the error
    //                  else, show the config complete page and restart
    //          else, clear the googlebearertoken cookie and respond with "OAUTH_REDIRECT" and the oauth2 url from getgoogletoken(
    //      upon failure:
    //          return "CANNOT_CONNECT_TO_GOOGLE"
}

router.get('/', async (req, res, next) => { // Let's validate our OAuth2 with rather a lengthy function!
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
                console.log("line 125")
                if (!req.query.code) { // If there isn't check to see if there's a code in our query, if there isn't that either then redirect to our OAuth2 page
                    try {
                        id = await getid(conf.token)
                        log.temp("line 128")
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
                log.temp("line 142")
                console.log(user)
                if (!user.id) throw "WRONG_SCOPES";
                if (!req.cookies.msbearertoken && conf.msclientid != "") {  // Check to see if client ID is configured, if not, skip this entire section
                    if (!req.query.code) { // If it is and there is no query, get the AAD URL and redirect to it
                        oAuthUrl = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                        res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                        log.temp("line 146")
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
            log.temp(err)
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
                                log.temp("line 216")
                                break;
                            case "BAD_CLIENT_SECRET": // Bad client secrets could be due to misconfuguration or some other error
                                res.status(400).json({ error: "OAUTH_FAIL" })
                                break;
                        }
                    }
                }
                try {
                    log.temp(err)
                    id = await getid(conf.token)
                    switch (err) {
                        case "CANNOT_CONNECT_TO_DISCORD": // Can we not connect to Discord? Oh. We can't do anything about that so expect that the React app will show a wall
                            res.status(400).json({ error: err })
                            break;
                        case "BAD_CODE": // If we have a bad code, redirect to OAuth2 to regenerate another one, should be simple enough
                            if (!req.cookies.discordbearertoken) { // Try to discover what caused "BAD_CODE"
                                log.temp("line 230")
                                throw "BAD_ACCESS_TOKEN"
                            } else {
                                let user = await getDiscordUser(req.cookies.discordbearertoken)
                                if (user.id) {
                                    oAuthUrl = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                                    res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                                    log.temp("line 237")
                                } else {
                                    log.temp("line 239")
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
                            log.temp("line 255")
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
                                log.temp("line 267")
                            }
                            break;
                        case "InvalidAuthenticationToken": // If invalid token and there not is a code, redirect back to MS OAuth2
                            if (!req.query.code) {
                                oAuthUrl = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                                res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                                log.temp("line 261")
                            } else { // If there is a code, get the bearer token and redirect to /config, storing the token as a cookie
                                try {
                                    let token = await getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config", req.query.code) // If all good, store as cookie and refresh
                                    res.cookie("msbearertoken", token)
                                    res.status(200).json({ message: "REFRESH_PAGE" })
                                } catch (err) {
                                    oAuthUrl = getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config")
                                    res.status(200).json({ message: "OAUTH_REDIRECT", url: oAuthUrl })
                                    log.temp("line 270")
                                    log.temp(err)
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
                            log.temp("line 303")
                            break;
                        case "CANNOT_CONNECT_TO_DISCORD":
                            res.status(400).json({ error: err })
                            break;
                        case "WRONG_SCOPES":
                            id = await getid(conf.token)
                            res.status(200).json({ message: "OAUTH_REDIRECT", url: 'https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none' })
                            log.temp("line 311")
                            break;
                        default:
                            log.error("************************************************")
                            console.log(err)
                            log.error("************************************************")
                            res.status(400).json({ err: err })
                            break;
                    }
                }
            }
        }
    }
})

module.exports = router;