/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: display404.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getDiscordUser = require('../core/getDiscordUserInfo')
const refreshBearerToken = require('../core/refreshDiscordBearerToken')
const getid = require('../core/getApplicationId')
const getContactLink = require('../core/getContactLink')
const isMod = require('../core/getUserModStatus')
const isOwner = require('../core/getUserOwnerStatus')
let user
let clientid
let modDropdownOptions
let footer
let link
let avatarurl

async function show404(res, lang, confpresent, req) {
    if (confpresent == true) { // If there is a configuration, if user signed in make motion to display such options else make motion to display a sign in button
        footer = "<%- include('./footer'); %>"
        link = await getContactLink()
        try {
            clientid = await getid(conf.token)
            try {
                user = await getDiscordUser(req.cookies.discordbearertoken)
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
            } catch (err) {
                if (err == "BAD_ACCESS_TOKEN") {
                    try {
                        token = await refreshBearerToken(req.cookies.discordrefreshtoken)
                        res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                        res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                        res.redirect(req.originalUrl) // Redirect so that the cookies get sent to the client
                    } catch (err) {
                        user = {}
                    }
                } else {
                    user = {}
                }
            }
        } catch (err) {
            user = undefined
        }

    } else {
        prereleasewarning = ""
        footer = ""
    } // If there is not a configuration, no motion is made at all and so only an "official dashboard" button is shown

    res.status(404);
    res.render('../src/server/pages/404.ejs', { // Simple functions reduce redundancy!
        projname: uniconf.projname,
        conf: confpresent,
        prereleasewarning: prereleasewarning,
        pfpUrl: avatarurl,
        user: user,
        signinlink: "/login",
        modDropdownOptions: modDropdownOptions,
        i18nsigninwithdiscord: translate(lang, 'page_globalsigninwithdiscord'),
        i18nprereleasewarning: translate(lang, 'page_globalprereleasewarningpart1') + uniconf.projname + translate(lang, 'page_globalprereleasewarningpart2'),
        i18nserverslink: translate(lang, "page_globalservers"),
        i18naccountsettingslink: translate(lang, "page_globalaccountsettings"),
        i18nsignoutlink: translate(lang, "page_globalsignout"),
        metadomain: uniconf.metadomain,
        metaurl: "https://" + uniconf.metadomain,
        wikiurl: "https://wiki." + uniconf.metadomain,
        discord: uniconf.discord,
        contactlink: link,
        footer: footer,
        twitter: uniconf.twitter,
        i18npagetitle: translate(lang, 'page_404pagetitle'),
        i18ntitle: translate(lang, 'page_404errortitle'),
        i18ndescription: translate(lang, 'page_404errordescription'),
        i18ngithub: translate(lang, 'page_globalgithub'),
        i18ngdescription: translate(lang, 'page_globaldescription'),
        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
        i18ndiscord: translate(lang, 'page_globaldiscord'),
        i18ndashboard: translate(lang, 'page_noconfdashboard'),
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
}

module.exports = show404;