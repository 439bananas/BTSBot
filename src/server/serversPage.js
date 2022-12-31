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
let modDropdownOptions
let avatarurl
let guild
let guildIconLink
let greyedOut

router.get('/', async (req, res, next) => { // WORK ON SERVER CONFIG
    let url = req.url.split('/')
    if (url[1] == "") {
        next()
    } else {

    }
})

//router.use('/', )

router.get('/', async (req, res, next) => {
    log.temp("line 42")
    let link = await getContactLink()
    let lang = await getUserLang()

    try {
        const confExists = await checkConf()
        if (confExists === true) {
            try {
                log.temp("line 50")
                const user = await getDiscordUser(req.cookies.discordbearertoken)
                if (user.avatar == null) { // If we have no profile picture, do the magic calculation! https://discord.com/developers/docs/reference#image-formatting
                    avatarfilename = user.discriminator % 5
                    avatarurl = 'https://cdn.discordapp.com/embed/avatars/' + avatarfilename + ".png"
                } else { // If we do have one, set the link to this.
                    avatarfilename = user.avatar
                    avatarurl = 'https://cdn.discordapp.com/avatars/' + user.id + "/" + avatarfilename
                }

                if (await isMod(user.id)) {
                    modDropdownOptions = "<li><a class=\"dropdown-item\" href=\"/helpdesk\">" + translate(lang, "page_globalhelpdesk") + "</a></li><li><a class=\"dropdown-item\" href=\"/all-servers\">" + translate(lang, "page_globalallservers") + "</a></li><li><a class=\"dropdown-item\" href=\"/user-manager\">" + translate(lang, "page_globalusermanager") + "</a></li>"
                } else {
                    modDropdownOptions = ""
                }

                try {
                    log.temp("line 67")
                    let guilds = await getGuilds(req.cookies.discordbearertoken)
                    let listedGuilds = []
                    for (guildIndex in guilds) {
                        guild = guilds[guildIndex]
                        let reversedPermsInt = parseInt(guild.permissions).toString(2).split("") // Let's convert the permissions to binary and reverse them
                        // In Discord, a permissions integer is a bitwise number, in that any single bit will determine a single switch
                        // As such, the integer gets converted to binary
                        // It's reversed because permissions integers are different lengths and as such, it's a lot easier to work with a reversed binary number than not, especially when finding permissions by their respective bits is documented by Discord in the manner of bit shifts
                        reversedPermsInt = reversedPermsInt.reverse() // Sadly no way to reverse strings, sad
                        if (reversedPermsInt[3] == 1 || reversedPermsInt[5] == 1) { // There's no point in rejoining the array back together, working on it like this is fiiiine
                            listedGuilds.push(guilds[guildIndex]) // User must be administrator or have manage server permissions for their server to show up in the list
                        }
                    }
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

                    let guildElements = ""
                    for (guildIndex in listedGuilds) {
                        guild = listedGuilds[guildIndex]
                        if (guild.icon == null) {
                            guildIconLink = 'https://cdn.discordapp.com/embed/avatars/' + Math.abs((guild.id >> 22) % 5) + ".png"
                        } else {
                            guildIconLink = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon
                        }

                        let inGuild = await botInGuild(guild.id)

                        if (inGuild) {
                            greyedOut = ""
                        } else {
                            greyedOut = " guild-bot-not-in"
                        }

                        guildElements += "<div class=\"guild\"><a href=\"/servers/" + guild.id + "\" class=\"guild-link" + greyedOut + "\"><img src=\"" + guildIconLink + "\" class=\"rounded-circle guild-icon\" /><br/><p class=\"guild-link\">" + guild.name + "</p></a></div>"
                    }
                    if (guildElements == "") {
                        guildElements = "<div class=\"no-guilds\">" + translate(lang, "page_noguildstolist") + "</div>" // This element is in bold, strong quotes manipulate text to speech, while bold is for purely aesthetic purposes
                    }

                    res.render('../src/server/pages/servers.ejs', {
                        projname: uniconf.projname,
                        confpath: path.join(__dirname, 'configs'),
                        metadomain: uniconf.metadomain,
                        metaurl: "https://" + uniconf.metadomain,
                        wikiurl: "https://wiki." + uniconf.metadomain,
                        discord: uniconf.discord,
                        twitter: uniconf.twitter,
                        i18ngdescription: translate(lang, 'page_globaldesc'),
                        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                        i18ndiscord: translate(lang, 'page_globaldiscord'),
                        i18ngithub: translate(lang, 'page_globalgithub'),
                        conf: true,
                        signinlink: "/login",
                        modDropdownOptions: modDropdownOptions,
                        user: user,
                        guilds: guildElements,
                        pfpUrl: avatarurl,
                        i18nserverslink: translate(lang, "page_globalservers"),
                        i18npagetitle: translate(lang, "page_globalservers"),
                        i18naccountsettingslink: translate(lang, "page_globalaccountsettings"),
                        i18nsignoutlink: translate(lang, "page_globalsignout"),
                        prereleasewarning: prereleasewarning,
                        contactlink: link,
                        i18ndashboard: translate(lang, 'page_noconfdashboard'),
                        i18nsigninwithdiscord: translate(lang, 'page_globalsigninwithdiscord'),
                        i18nprereleasewarning: translate(lang, 'page_globalprereleasewarningpart1') + uniconf.projname + translate(lang, 'page_globalprereleasewarningpart2'),
                        i18nheadertitle: translate(lang, 'page_serverstitle'),
                        i18nfooterprojname: uniconf.projname.replace(/ /g, "&nbsp;"),
                        i18nfooterdiscord: translate(lang, "page_globalfooterdiscord").replace(/ /g, "&nbsp"),
                        i18nfootertwitter: translate(lang, "page_globalfootertwitter").replace(/ /g, "&nbsp"),
                        i18nfootercredits: translate(lang, "page_globalfootercredits").replace(/ /g, "&nbsp"),
                        i18nfootercontact: translate(lang, "page_globalfootercontact").replace(/ /g, "&nbsp"),
                        i18nfooterwiki: translate(lang, "page_globalfooterwiki").replace(/ /g, "&nbsp"),
                        i18nfooterstatus: translate(lang, "page_globalfooterstatus").replace(/ /g, "&nbsp"),
                        i18nfootergithub: translate(lang, 'page_globalgithub').replace(/ /g, "&nbsp;"),
                        i18nfootertranslate: translate(lang, 'page_globalfootertranslate').replace(/ /g, "&nbsp"), // Kind of ironic that we're performing the translate function on a piece of text called "translate"
                        i18nfooterprivacypolicy: translate(lang, 'page_globalfooterprivacypolicy').replace(/ /g, "&nbsp"),
                        i18nfootertos: translate(lang, 'page_globalfootertos').replace(/ /g, "&nbsp")
                    })
                } catch (err) {
                    log.temp("line 158")
                    switch (err) {
                        case "BAD_DISCORD_BEARER_TOKEN": // While the scopes may be wrong there may also be an incident where the bearer token has expired but it's not reflected in Redis yet
                            try {
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
            } catch (err) {
                let redirectUrl
                try {
                    let token = await refreshBearerToken(req.cookies.discordrefreshtoken)
                    await res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                    await res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                    if (token.bearertoken) {
                        redirectUrl = req.originalUrl // If bad bearer token try to get a new token
                    }
                } catch (err) {
                    redirectUrl = '/login'
                } finally {
                    res.redirect(redirectUrl)
                }
            }
        }
    } catch (err) {
        log.temp(err)
        res.redirect('/')
    }
})

module.exports = router