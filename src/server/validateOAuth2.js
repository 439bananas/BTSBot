/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: validateOAuth2.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getaddress = require('../core/getReqAddress')
const getgoogletoken = require('../core/getGoogleToken')
const showconf = require('./displayConf')
const showwall = require('./displayWall')
const showconfigcomplete = require('./displayConfigComplete')
const fs = require('fs')
const fetch = require('node-fetch')
const getid = require('../core/getApplicationId')
const getDiscordToken = require('../core/getDiscordBearerToken')
const getDiscordUser = require('../core/getDiscordUserInfo')
const getazuretoken = require('../core/getAzureToken')
const { createClient } = require('redis')

function googleOAuth2(req, res, conf) { // Cope with Google's OAuth2 in a more compact fashion
    getlang().then(lang => {
        if (req.cookies.googlebearertoken == undefined && conf.googleclientid != "") { // If no googlebearertoken cookie and there is a client ID configured:
            if (!req.query.code && !req.query.error) { // If there is no OAuth2 code and there is no error, get the OAuth2 link and redirect to it
                getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config").then(url => {
                    res.redirect(url)
                })
            } else if (req.query.error) { // If there is an error, show the conf page
                showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.redishostname, conf.redisusername, conf.redisdatabase, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, true)
            } else { // If there is a code and no error:
                getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config", req.query.code).then(token => { // Get the Google bearer token with set settings, scopes and code
                    res.cookie('googlebearertoken', token, { maxAge: 3600000, httpOnly: true }); // Store as cookie
                    fs.rename(path.join(__dirname, '..', 'configs', 'confinterim.json'), path.join(__dirname, '..', 'configs', 'conf.json'), function (err) { // Rename conf interim to conf
                        if (err) log.error(err);
                        restart()
                    })
                    showconfigcomplete(res, lang) // Conf complete!
                }).catch(err => { // If an error has happened, catch it
                    switch (err) {
                        case "BAD_GOOGLE_CLIENT_SECRET": // If bad client secret, go back to conf
                            showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, true)
                            global.badclientsecret = true
                            break;
                        case "CANNOT_CONNECT_TO_GOOGLE": // If cannot connect to Google or some other error, show a wall
                            showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttogoogle'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttogooglediagpart2'))
                            break;
                        case "BAD_CODE": // If bad code, redirect to Google OAuth2
                            getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config").then(url => {
                                res.redirect(url)
                            })
                            break;
                        default:
                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            log.error(err)
                            break;
                    }
                })
            }
        } else if (conf.googleclientid == "") { // If there is no client ID in the conf, configuration is complete!
            fs.rename(path.join(__dirname, '..', 'configs', 'confinterim.json'), path.join(__dirname, '..', 'configs', 'conf.json'), function (err) {
                if (err) log.error(err);
                restart()
            })
            showconfigcomplete(res, lang)
        } else if (req.cookies.googlebearertoken) { // If there is a cookie but the conf has not been renamed yet for whatever reason... that's weird...
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', { // Fetch userinfo, a granted scope
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${req.cookies.googlebearertoken}`
                }
            }).then(response => // Convert response to JSON form
                response.json()
            )
                .then(response => {
                    if (response.id) { // If there is an ID, configuration is complete!
                        fs.rename(path.join(__dirname, '..', 'configs', 'confinterim.json'), path.join(__dirname, '..', 'configs', 'conf.json'), function (err) {
                            if (err) log.error(err);
                            restart()
                        })
                        showconfigcomplete(res, lang)
                    } else { // Else, restart OAuth2 verification
                        res.clearCookie("googlebearertoken")
                        getgoogletoken(conf.googleclientid, conf.googleclientsecret, ['https://www.googleapis.com/auth/userinfo.profile'], getaddress(req) + "/config").then(url => {
                            res.redirect(url)
                        })
                    }
                })
                .catch(err => {
                    showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttogooglediagpart2'))
                }) // And if there is an error then we probably can't connect to Google.
        }
    })
}

function validateOAuth2(req, res, conf) { // Let's validate our OAuth2 with rather a lengthy function!
    let url = "redis://" + conf.redisusername
    let identity = ""

    if (conf.password != "") {
        url += ":" + conf.redispassword
    }

    url += "@" + conf.redishostname + "/" + conf.redisdatabase

    global.redisConnection = createClient({ // Forgot that redisConnection does not yet exist
        url: url
    })

    redisConnection.connect()

    getlang().then(lang => {
        redisConnection.on('error', (err) => { // If Redis gets disconnected then reconnect and send out error
            switch (err.message) {
                case "Socket closed unexpectedly":
                    log.warn(translate(lang, "log_redisconnectionlost"))
                    break;
                case "Connection timeout":
                    log.warn(translate(lang, "log_redisreconnecting"))
                    break;
                default:
                    log.error(err)
            }
        })

        if (!req.cookies.discordbearertoken) { // Is there any Discord bearer token in our cookies?
            if (!req.query.code) { // If there isn't check to see if there's a code in our query, if there isn't that either then redirect to our OAuth2 page
                getid(conf.token).then(id => {
                    res.redirect('https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none')
                }).catch(err => { // If there's an error, handle it, we don't want any obnoxious crashes now
                    if (err == "TOKEN_INVALID") { // This is likely if it's been changed between one restart to another, therefore show our configuration page
                        showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.redishostname, conf.redisusername, conf.redisdatabase, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, false)
                    } else if (err == "CANNOT_CONNECT_TO_DISCORD") { // Can we not connect to Discord? Oh. We can't do anything about that so show a wall
                        showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
                    } else { // Potentially some other error could have come up, it could be anything so let's play it safe and not let the end user do anything
                        showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                        log.error(err)
                    }
                })
            } else { // If there is a code in our query, let's do the following:
                getDiscordToken(conf.token, conf.discordclientsecret, getaddress(req) + "/config", req.query.code).then(token => { // Get our bearer token
                    res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // If we can get it, store it in our cookies for a week and refresh the page
                    res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                    res.redirect('/config')
                }).catch(err => { // If we can't, then do the following:
                    switch (err) {
                        case "BAD_CODE": // If we have a bad code, redirect to OAuth2 to regenerate another one, should be simple enough
                            log.temp("BAD CODE")
                            getid(conf.token).then(id => {
                                res.redirect('https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none')
                            })
                            break;
                        case "BAD_DISCORD_CLIENT_SECRET": // Bad client secrets could be due to misconfuguration or some other error
                            showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.redishostname, conf.redisusername, conf.redisdatabase, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, true)
                            global.badclientsecret = true
                            break;
                        case "TOKEN_INVALID": // Same with the bad token
                            showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.redishostname, conf.redisusername, conf.redisdatabase, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, false)
                            break;
                        default:
                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            log.error(err)
                            break;
                    }
                })
            }
        } else { // If we have a Discord bearer token in our cookies, try getting the information for the user in question to validate the token
            getDiscordUser(req.cookies.discordbearertoken).then(info => {
                if (!req.cookies.msbearertoken && conf.msclientid != "") { // Check to see if client ID is configured, if not, skip this entire section
                    if (!req.query.code) { // If it is and there is no query, get the AAD url and redirect to it
                        getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config").then(url => {
                            res.redirect(url)
                        }).catch(err => {
                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            log.error(JSON.stringify(err))
                        })
                    } else { // If there is a code query, get the Azure bearer token and store as a cookie
                        getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config", req.query.code).then(token => {
                            res.cookie("msbearertoken", token)
                            res.redirect('/config')
                        }).catch(err => { // If bad client secret or code, show that error
                            switch (err) {
                                case "BAD_CLIENT_SECRET_OR_CODE":
                                    showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.redishostname, conf.redisusername, conf.redisdatabase, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, true)
                                    global.badclientsecret = false
                                    break; // ^^ Unfortunately, there is no way to differentiate between the two errors in MSAL so best thing to do is redisplay the configuration page
                                default:
                                    showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                                    log.error(err)
                                    break;
                            }
                        })
                    }
                } else if (conf.msclientid == "") { // If Microsoft 365 client ID is not configured, skip this step
                    googleOAuth2(req, res, conf)
                } else { // If there is a cookie, validate it and get the user's profile
                    fetch('https://graph.microsoft.com/oidc/userinfo', {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${req.cookies.msbearertoken}`
                        }
                    }).then(response => response.json())
                        .then(response => {
                            if (response.error) {
                                switch (response.error.code) {
                                    case "InvalidAuthenticationToken": // If invalid token and there not is a code, redirect back to MS OAuth2
                                        if (!req.query.code) {
                                            getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config").then(url => {
                                                res.redirect(url)
                                            })
                                        } else { // If there is a code, get the bearer token and redirect to /config, storing the token as a cookie
                                            getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config", req.query.code).then(token => { // If all good, store as cookie and refresh
                                                res.cookie("msbearertoken", token)
                                                res.redirect('/config')
                                            }).catch(err => { // If some error in the token, again, redirect to OAuth2
                                                getazuretoken(conf.msclientid, conf.msclientsecret, ["User.Read"], getaddress(req) + "/config").then(url => { // If there is some kind of error, redirect back to OAuth2
                                                    res.redirect(url)
                                                })
                                            })
                                        }
                                        break;
                                    default: // If some other error, show wall
                                        log.error(response.error.code + ": ")
                                        showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                                        break;
                                }
                            } else if (response.email) { // If there is a valid response, follow Google's OAuth2 procedure
                                googleOAuth2(req, res, conf)
                            } else { // If something weird, assume the worst and display the wall
                                showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                                log.error(err)
                            }
                        })
                        .catch(err => showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttomicrosoftdiagpart2'))) // And if there is an error then we probably can't connect to Microsoft.
                } // ^^ If FetchError, cannot connect to Microsoft
            }).catch(err => { // If we can't get the information, try and mitigate it with the following errors:
                getid(conf.token).then(id => { // This is here to prevent more redundant lines than necessary (id is rather a depended value in this section)
                    switch (err) {
                        case "BAD_ACCESS_TOKEN": // If we have a bad access token or the scope we want has not been requested, take the following actions: (a bad access token just means it needs to be regenerated)
                            if (!req.query.code) { // Is there a code in our query? If not, redirect to the OAuth2 link
                                res.redirect('https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none')
                            } else { // If we have a code, attempt to get the bearer token
                                getDiscordToken(conf.token, conf.discordclientsecret, getaddress(req) + "/config", req.query.code).then(token => { // If we don't have a problem, store it as a cookie and refresh
                                    res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true })
                                    res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                                    res.redirect('/config')
                                }).catch(error => { // If an error occurred, well...
                                    switch (error) {
                                        case "BAD_CODE": // If it's just a bad code, regenerate it
                                            res.redirect('https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none')
                                            break;
                                        case "BAD_DISCORD_CLIENT_SECRET": // If we have a bad client secret, show the conf again
                                            showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.redishostname, conf.redisusername, conf.redisdatabase, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, true)
                                            global.badclientsecret = false
                                            break;
                                        default: // If it's anything else, assume the worst and prevent the user from going further
                                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                                            log.error(err)
                                    }
                                })
                            }
                            break;
                        case "WRONG_SCOPES": // We can get the correct scopes by regenerating the access token
                            if (!req.query.code) { // Ditto
                                res.redirect('https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none')
                            } else {
                                getDiscordToken(conf.token, conf.discordclientsecret, getaddress(req) + "/config", req.query.code).then(token => {
                                    res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true })
                                    res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                                    res.redirect('/config')
                                }).catch(error => {
                                    switch (error) {
                                        case "BAD_CODE":
                                            res.redirect('https://discord.com/api/oauth2/authorize?client_id=' + id + '&redirect_uri=' + encodeURIComponent(getaddress(req) + "/config") + '&response_type=code&scope=identify%20email&prompt=none')
                                            break;
                                        case "BAD_DISCORD_CLIENT_SECRET":
                                            showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, true)
                                            global.badclientsecret = false
                                            break;
                                        default:
                                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                                    }
                                })
                            }
                            break;
                        case "CANNOT_CONNECT_TO_DISCORD": // Can't do anything here if Discord is down
                            showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
                            break;
                        default:
                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            log.error(err)
                            break;
                    }
                }).catch(err => { // If we can't get the ID, either show conf or the wall
                    if (err == "TOKEN_INVALID") {
                        showconf(req, res, conf.language, conf.language, conf.hostname, conf.dbusername, conf.database, conf.tableprefix, conf.pstatus, conf.ostatus, conf.guildid, conf.moderatorsroleid, conf.googleclientid, conf.msclientid, conf.smtpserver, conf.smtpport, conf.smtpssl, conf.imapssl, conf.imapserver, conf.imapport, conf.emailaddress, conf.emailusername, false)
                    } else if (err == "CANNOT_CONNECT_TO_DISCORD") {
                        showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
                    } else {
                        showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                        log.error(err)
                    }
                })
            })
        }
    })
}

module.exports = validateOAuth2