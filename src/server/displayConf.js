/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: displayConf.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const geti18n = require('../core/getI18nFiles')
const getUserLang = require('../core/getUserLang')

async function showconf(req, res, lang, defaultlanguage, hostname, dbusername, database, tableprefix, redishostname, redisusername, redisdatabase, pstatus, ostatus, guildid, moderatorsroleid, googleclientid, msclientid, smtpserver, smtpport, smtpssl, imapssl, imapserver, imapport, emailaddress, emailusername, badclientsecreterr) { // We'll comment this in a second // I really, REALLY wish there were fewer args to pass but unfortunately that's not really so easy with literally 24 different settings. Goddamnit SMTP.
    let langs = await geti18n()

    res.locals.lang = await getUserLang(req)
    res.locals.uniconf = uniconf
    res.locals.title = " - " + translate(lang, 'page_configpagetitle')
    res.locals.conf = false
    res.locals.DiscordUser = req.user
    res.locals.pkg = pkg
        res.render('config', {
            hostname: hostname,
            dbusername: dbusername,
            database: database,
            tableprefix: tableprefix,
            langs: langs,
            defaultlanguage: defaultlanguage,
            badclientsecret: badclientsecreterr,
            redishostname: redishostname,
            redisusername: redisusername,
            redisdatabase: redisdatabase,
            defaultstatus: ostatus,
            pstatus: pstatus,
            guildid: guildid,
            moderatorsroleid: moderatorsroleid,
            googleclientid: googleclientid,
            msclientid: msclientid,
            smtpssl: smtpssl,
            imapserver: imapserver,
            imapport: imapport,
            emailaddress: emailaddress,
            emailusername: emailusername,
            smtpserver: smtpserver,
            smtpport: smtpport,
            imapssl: imapssl
        })
}

module.exports = showconf;