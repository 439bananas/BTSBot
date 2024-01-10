/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: displayWall.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

function showwall(res, lang, error, diag) { // Really just useful to prevent people from going any further
    res.status(200)
    res.locals.lang = lang
    res.locals.uniconf = uniconf
    res.locals.title = " - " + translate(lang, 'page_configpagetitle')
    res.locals.conf = false
    res.locals.DiscordUser = {}
    res.locals.pkg = pkg
    res.render('error-page', {
        error: error,
        diag: diag
    })
}

module.exports = showwall;