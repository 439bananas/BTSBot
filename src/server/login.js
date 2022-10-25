/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: login.js                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// IF NOT THE CORRECT SCOPES REDIRECT TO OAUTH2 PAGE

const express = require('express')
const checkConf = require('../core/checkConfExists')
const router = express.Router()
const getDiscordUser = require('../core/getDiscordUserInfo')
const refreshBearerToken = require('../core/refreshDiscordBearerToken')
const getaddress = require('../core/getReqAddress')
const getid = require('../core/getApplicationId')
const getDiscordToken = require('../core/getDiscordBearerToken')
const showwall = require('./displayWall')
const getUserLang = require('../core/getUserLang')
const getDiscordScopes = require('../core/getDiscordScopes')

router.get('/', async (req, res, next) => {
    try {
        let confExists = await checkConf() // If conf does not exist return home and display error
        if (confExists) {
            try { // If bearer token valid, redirect to /servers
                let user = await getDiscordUser(req.cookies.discordbearertoken)
                if (user && typeof (user.id) != "undefined") {
                    res.redirect('/servers')
                }
            } catch (err) { // If not valid and no code, try refreshing the user's bearer token. If that fails, redirect to OAuth2 link
                let clientid = await getid(conf.token)
                let signinlink = "https://discord.com/oauth2/authorize?client_id=" + clientid + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/login") + "&response_type=code&scope=guilds%20email%20identify&prompt=none"
                if (!req.query.code) {
                    try {
                        token = await refreshBearerToken(req.cookies.discordrefreshtoken)
                        res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                        res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                        res.redirect(req.originalUrl)
                    } catch (err) {
                        res.redirect(signinlink)
                    }
                } else { // If there is a code, get the bearer token and check its scopes. If scopes match expected, store the tokens in the cookies and refresh the page
                    try {
                        token = await getDiscordToken(conf.token, conf.discordclientsecret, getaddress(req) + "/login", req.query.code)
                        let scopes = await getDiscordScopes(token.bearertoken)
                        if (scopes.includes('email') && scopes.includes('identify') && scopes.includes('guilds')) {
                            res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                            res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                            res.redirect(req.originalUrl)
                        } else { // If not the correct scopes, redirect to Discord's OAuth2 page
                            res.redirect(signinlink)
                        }
                    } catch (err) { // If cannot get bearer token:
                        lang = await getUserLang(req)
                        switch (err) {
                            case "BAD_CODE": // If invalid code, redirect to Discord's OAuth2 page
                                redirect(signinlink)
                                break;
                            case "BAD_DISCORD_CLIENT_SECRET": // If bad client secret or some other error, show the wall
                                showwall(res, lang, translate(lang, 'page_loginbadclientsecret'), translate(lang, 'page_loginbadclientsecretdiag'))
                                break;
                            default:
                                showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                                log.error(err)
                        }
                    }
                }
            }
        }
    } catch (err) {
        res.redirect('/') // If bad conf, return home
    }
})

module.exports = router;