/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: displayNoConfIntro.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

let config
let knownErrors = [false, "MISSING_FIELDS", "TOKEN_INVALID", "CONNECTION_REFUSED", "INCORRECT_CREDENTIALS", "ACCESS_DENIED", "REDIS_CONNECTION_REFUSED", "WRONGPASS", "BAD_DATABASE"]

function shownci(req, res, lang, err) {
    if (!knownErrors.includes(err)) {
        log.error(err)
    }
    res.status(200);
    res.locals.lang = lang
    res.locals.pkg = pkg
    res.locals.DiscordUser = req.user
    res.locals.conf = false
    res.locals.title = " - " + translate(lang, 'page_configpagetitle')
    res.locals.uniconf = uniconf
    res.locals.err = err.toString()
    if (err.toString() == "ACCESS_DENIED") {
        config = require('../configs/conf.json')
        res.locals.database = config.database
        res.locals.dbusername = config.dbusername
        res.locals.hostname = config.hostname
    }
    res.render('no-conf-intro', {
        lang: lang
    });
}

module.exports = shownci;