/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: login.js                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// IF NOT THE CORRECT SCOPES REDIRECT TO OAUTH2 PAGE

import { Router } from 'express'
const router = Router()
import refreshBearerToken from '../core/refreshDiscordBearerToken.cjs'
import getaddress from '../core/getReqAddress.cjs'
import getid from '../core/getApplicationId.js'
import getDiscordToken from '../core/getDiscordBearerToken.js'
import showwall from './displayWall.js'
import getUserLang from '../core/getUserLang'
import getDiscordScopes from '../core/getDiscordScopes.js'
import validateConf from './validateConf.js'

router.get('/', async (req, res, next) => {
    let re = await validateConf(req)

    if (re.confExists) {
        try { // If bearer token valid, redirect to /servers
            if ((req.query.bypasscache && req.query.bypasscache == "true") || req.query.code) {
                throw "CACHE_BYPASSED"
            } else {
                let user = req.user
                if (user && typeof (user.id) != "undefined") { // Allow for redirectto and state arguments to be supplied for the server to redirect the user back, state takes precedence over returnto
                    if (req.query.state) {
                        res.redirect("/" + req.query.state)
                    } else if (req.query.returnto) {
                        res.redirect("/" + req.query.returnto)
                    } else {
                        res.redirect('/servers')
                    }
                } else {
                    throw "INVALID_TOKEN"
                }
            }
        } catch (err) { // If not valid and no code, try refreshing the user's bearer token. If that fails, redirect to OAuth2 link
            let clientid = getid(conf.token)
            let signinlink
            let token
            if (req.query.state) {
                signinlink = "https://discord.com/oauth2/authorize?client_id=" + clientid + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/login") + "&response_type=code&scope=guilds%20email%20identify&prompt=none&state=" + req.query.state
            } else if (req.query.returnto) {
                signinlink = "https://discord.com/oauth2/authorize?client_id=" + clientid + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/login") + "&response_type=code&scope=guilds%20email%20identify&prompt=none&state=" + req.query.returnto
            } else {
                signinlink = "https://discord.com/oauth2/authorize?client_id=" + clientid + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/login") + "&response_type=code&scope=guilds%20email%20identify&prompt=none"
            }
            if (!req.query.code) {
                try {
                    token = await refreshBearerToken(req.cookies.discordrefreshtoken)
                    res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                    res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                    if (req.query.state) {
                        res.redirect("/" + req.query.state)
                    } else if (req.query.returnto) {
                        res.redirect("/" + req.query.returnto)
                    } else {
                        res.redirect("/servers")
                    }
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
                        if (req.query.state) {
                            res.redirect("/" + req.query.state)
                        } else if (req.query.returnto) {
                            res.redirect("/" + req.query.returnto)
                        } else {
                            res.redirect("/servers")
                        }
                    } else { // If not the correct scopes, redirect to Discord's OAuth2 page
                        res.redirect(signinlink)
                    }
                } catch (err) { // If cannot get bearer token:
                    let lang = await getUserLang(req)
                    switch (err) {
                        case "BAD_CODE": // If invalid code, redirect to Discord's OAuth2 page
                            res.redirect(signinlink)
                            break;
                        case "BAD_CLIENT_SECRET": // If bad client secret or some other error, show the wall
                            showwall(res, lang, await translate(lang, 'page_loginbadclientsecret'), await translate(lang, 'page_loginbadclientsecretdiag'))
                            break;
                        default:
                            showwall(res, conf.language, await translate(lang, "page_confunknownerror"), await translate(lang, "page_wallunknownerrordiag"))
                            log.error(err)
                    }
                }
            }
        }
    } else {
        res.redirect('/') // If bad conf, return home
    }
})

export default router;