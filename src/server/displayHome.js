/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: displayHome.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getaddress = require('../core/getReqAddress')
const getContactLink = require('../core/getContactLink')
const isMod = require('../core/getUserModStatus')

async function showhome(req, res, lang, clientid) { // EJS was so much of a pain when it forced me to pass all of the translate() strngs, I'm so glad React lets me directly call translate()
    if (typeof redisConnection === 'undefined' || typeof MySQLConnection === 'undefined') { // Database can be accessed after downtime during initialisation of project
    }
    if (await isMod(req.user.id)) {
        res.locals.isMod = true
    } else {
        res.locals.isMod = false
    }
    res.locals.lang = lang
    res.locals.pkg = pkg
    res.locals.DiscordUser = req.user
    res.locals.conf = true
    res.locals.title = " "
    res.locals.contactLink = await getContactLink()
    res.locals.uniconf = uniconf
    res.render('home', {
        lang: lang,
        oauth2link: "https://discord.com/oauth2/authorize?client_id=" + clientid + "&permissions=" + uniconf.perms + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/login") + "&response_type=code&scope=guilds%20email%20identify%20bot%20applications.commands"
    });
}

module.exports = showhome;