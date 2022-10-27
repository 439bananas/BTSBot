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
const isOwner = require('../core/getUserOwnerStatus')
let modDropdownOptions
let avatarurl

router.get('/', async (req, res, next) => {
    let link = await getContactLink()

    try {
        const confExists = await checkConf()
        if (confExists === true) { // CHECK IF USER SIGNED IN
            try {
                const user = await getDiscordUser(req.cookies.discordbearertoken)
                if (user.avatar == null) { // If we have no profile picture, do the magic calculation! https://discord.com/developers/docs/reference#image-formatting
                    avatarfilename = user.discriminator % 5
                    avatarurl = 'https://cdn.discordapp.com/embed/avatars/' + avatarfilename + ".png"
                } else { // If we do have one, set the link to this.
                    avatarfilename = user.avatar
                    avatarurl = 'https://cdn.discordapp.com/avatars/' + user.id + "/" + avatarfilename
                }

                if (await isMod(user.id) || await isOwner(user.id)) {
                    modDropdownOptions = "<li><a class=\"dropdown-item\" href=\"/helpdesk\">" + translate(lang, "page_globalhelpdesk") + "</a></li><li><a class=\"dropdown-item\" href=\"/all-servers\">" + translate(lang, "page_globalallservers") + "</a></li><li><a class=\"dropdown-item\" href=\"/user-manager\">" + translate(lang, "page_globalusermanager") + "</a></li>"
                } else {
                    modDropdownOptions = ""
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
                res.redirect('/login')
            }
        }
    } catch (err) {
        res.redirect('/')
    }
})

module.exports = router