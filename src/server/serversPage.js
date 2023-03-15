/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: serversPage.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()
const getContactLink = require('../core/getContactLink')
const isMod = require('../core/getUserModStatus')
const getGuilds = require('../core/getUserGuilds')
const refreshBearerToken = require('../core/refreshDiscordBearerToken')
const showwall = require('./displayWall')
const getUserLang = require('../core/getUserLang')
const botInGuild = require('../core/checkBotInGuild')
const serverConfigRoutes = require('./serverConfigRoutes')
let guild

router.use('/', serverConfigRoutes)

async function renderServersPage(req, res, lang, user, guildsBotIsIn, listedGuilds) {
    res.locals.lang = lang
    res.locals.uniconf = uniconf
    res.locals.title = " - " + translate(lang, "page_globalservers")
    res.locals.DiscordUser = req.user
    res.locals.conf = true
    res.locals.isMod = await isMod(user.id)
    res.locals.pkg = pkg
    res.locals.contactLink = await getContactLink()
    res.locals.guildsBotIsIn = guildsBotIsIn
    res.render('servers', {
        listedGuilds: listedGuilds
    })
}

router.get('/', async (req, res, next) => {
    let lang = await getUserLang()

    if (req.confExists === true) {
        log.temp("39")
            try {
                const user = req.user
                let guilds = await getGuilds(req.cookies.discordbearertoken)
                let listedGuilds = []
                for (guildIndex in guilds) {
                    guild = guilds[guildIndex] // I would've used getUserPermissions but it only gets the permissions for one guild (which is many API requests)
                    let reversedPermsInt = parseInt(guild.permissions).toString(2).split("")
                    reversedPermsInt = reversedPermsInt.reverse() // Sadly no way to reverse strings, sad
                    if (reversedPermsInt[3] == 1 || reversedPermsInt[5] == 1) { // There's no point in rejoining the array back together, working on it like this is fiiiine
                        listedGuilds.push(guilds[guildIndex]) // User must be administrator or have manage server permissions for their server to show up in the list
                    }
                }
                log.temp(52)
                listedGuilds.sort((a, b) => { // Sort the list into A-Z of guild name
                    const nameA = a.name.toUpperCase(); // Thanks MDN! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                });

                let guildsBotIsIn = []

                for (guildIndex in listedGuilds) {
                    let guild = listedGuilds[guildIndex]
                    let inGuild = await botInGuild(guild.id)
                    if (inGuild) {
                        guildsBotIsIn.push(true)
                    } else {
                        guildsBotIsIn.push(false)
                    }
                    if (guildIndex == listedGuilds.length - 1) {
                        renderServersPage(req, res, lang, user, guildsBotIsIn, listedGuilds)
                    }
                }

                if (listedGuilds.length == 0) {
                    renderServersPage(req, res, lang, user, guildsBotIsIn, listedGuilds)
                }

            } catch (err) {
                switch (err) {
                    case "BAD_DISCORD_BEARER_TOKEN": // While the scopes may be wrong there may also be an incident where the bearer token has expired but it's not reflected in Redis yet
                        try {
                            log.temp("serversPage.js:151")
                            let token = await refreshBearerToken(req.cookies.discordrefreshtoken)
                            res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                            res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                            try {
                                let guilds = await getGuilds(token.bearertoken)
                                if (Array.isArray(guilds)) {
                                    res.redirect(req.originalUrl)
                                }
                            } catch (err) {
                                res.redirect('/login?bypasscache=true')
                            }
                        } catch (err) {
                            res.redirect('/login?bypasscache=true')
                        }
                        break;
                    case "CANNOT_CONNECT_TO_DISCORD":
                        showwall(res, lang, uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscord'), translate(lang, 'page_wallcannotconnecttoservicediagpart1') + uniconf.projname + translate(lang, 'page_wallcannotconnecttodiscorddiagpart2'))
                        break;
                    default:
                        log.error(err)
                        showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                }
            }
    } else {
        res.redirect('/')
    }
})

module.exports = router