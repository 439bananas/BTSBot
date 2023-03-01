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

const getContactLink = require('../core/getContactLink')
const isMod = require('../core/getUserModStatus')

async function show404(req, res, lang, confpresent) {
    res.status(404);
    res.locals.lang = lang
    res.locals.uniconf = uniconf
    res.locals.title = " - " + translate(lang, 'page_404pagetitle')
    res.locals.conf = confpresent
    res.locals.DiscordUser = req.user
    res.locals.pkg = pkg
    res.locals.isMod = await isMod(req.user.id)
    if (confpresent) res.locals.contactLink = await getContactLink()
    res.render('404')
}

module.exports = show404;