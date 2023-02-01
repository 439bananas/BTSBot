/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: serverConfigRoutes.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express')
const checkConf = require('../core/checkConfExists')
const router = express.Router()
const getDiscordUser = require('../core/getDiscordUserInfo')
const getContactLink = require('../core/getContactLink')
const isMod = require('../core/getUserModStatus')
const getGuilds = require('../core/getUserGuilds')
const refreshBearerToken = require('../core/refreshDiscordBearerToken')
const showwall = require('./displayWall')
const getUserLang = require('../core/getUserLang')
const botInGuild = require('../core/checkBotInGuild')
const signedIn = require('../core/checkUserSignedIn')
const getUserPermissions = require('../core/getUserPermissions')
const getid = require('../core/getApplicationId')
const getaddress = require('../core/getReqAddress')
let modDropdownOptions
let avatarurl
let guild
let guildIconLink
let greyedOut

router.get('/*', async (req, res, next) => { // WORK ON SERVER CONFIG
    let url = req.url.split('/')
    if (url[1] == "") {
        next()
    } else {
        if (req.confExists) {
            if (await signedIn(req, res)) {
                let permissions = await getUserPermissions(req.cookies.discordbearertoken, url[1])
                let clientid = await getid(conf.token)
                if (permissions.includes("ADMINISTRATOR") || permissions.includes("MANAGE_GUILD")) { // Checking permissions should also account for whether the user is in the guild
                    let inGuild = await botInGuild(url[1], true)
                    if (!inGuild) {
                        res.redirect("https://discord.com/oauth2/authorize?client_id=" + clientid + "&permissions=" + uniconf.perms + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/login") + "&state=" + encodeURIComponent("servers/" + url[1]) + "&guild_id=" + url[1] + "&disable_guild_select=true&response_type=code&scope=guilds%20email%20identify%20bot%20applications.commands")
                    } else {
                        // Now we work on the dashboard.
                    }
                } else {
                    res.redirect("/servers")
                }
            } else {
                res.redirect('/login?returnto=servers%2F' + url[1])
            }
        } else {
            res.redirect('/')
        }
    }
})

module.exports = router;
