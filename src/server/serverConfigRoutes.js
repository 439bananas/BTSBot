/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: serverConfigRoutes.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()
const getContactLink = require('../core/getContactLink')
const botInGuild = require('../core/checkBotInGuild')
const signedIn = require('../core/checkUserSignedIn')
const getUserPermissions = require('../core/getUserPermissions')
const getid = require('../core/getApplicationId')
const getaddress = require('../core/getReqAddress')
const getUserLang = require('../core/getUserLang')
const isMod = require('../core/getUserModStatus')
const getGuild = require('../core/getGuild')
const getGuilds = require('../core/getUserGuilds')

router.get('/*', async (req, res, next) => { // WORK ON SERVER CONFIG
    let url = req.url.split('/')
    if (url[1] == "") {
        next()
    } else {
        if (req.confExists) {
            try {
                let guild = await getGuild(url[1], await getGuilds(req.cookies.discordbearertoken))
                if (await signedIn(req, res)) {
                    let permissions = await getUserPermissions(guild)
                    let clientid = await getid(conf.token)
                    if (permissions.includes("ADMINISTRATOR") || permissions.includes("MANAGE_GUILD")) { // Checking permissions should also account for whether the user is in the guild
                        let inGuild = await botInGuild(url[1], true)
                        if (!inGuild) {
                            res.redirect("https://discord.com/oauth2/authorize?client_id=" + clientid + "&permissions=" + uniconf.perms + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/login") + "&state=" + encodeURIComponent("servers/" + url[1]) + "&guild_id=" + url[1] + "&disable_guild_select=true&response_type=code&scope=guilds%20email%20identify%20bot%20applications.commands")
                        } else {
                            // Now we work on the dashboard.
                            let lang = await getUserLang(req)
                            res.locals.isMod = await isMod(req.user.id)
                            res.locals.lang = lang
                            res.locals.pkg = pkg
                            res.locals.DiscordUser = req.user
                            res.locals.conf = true
                            res.locals.title = " - " + guild.name
                            res.locals.contactLink = await getContactLink()
                            res.locals.uniconf = uniconf
                            res.render('dashboard', {
                                lang: lang,
                                guild: guild
                            });
                        }
                    } else {
                        res.redirect("/servers")
                    }
                } else {
                    res.redirect('/login?returnto=servers%2F' + url[1])
                }
            } catch (err) {
                if (err.name == "RATE_LIMIT_REACHED") {
                setTimeout(function () {

                }, err.timeout * 1000)
                    console.log(err)
                }
            }
        } else {
            res.redirect('/')
        }
    }
})

module.exports = router;
