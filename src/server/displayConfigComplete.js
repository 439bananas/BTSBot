/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//             File: displayConfigComplete.js              //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

function showconfigcomplete(res, lang) {
    res.locals.lang = lang
    res.locals.DiscordUser = {}
    res.locals.conf = false
    res.locals.title = " - " + translate(lang, 'page_configpagetitle')
    res.locals.pkg = pkg
    res.locals.uniconf = uniconf
    res.render('config-complete', {
        lang: lang
    });
}

module.exports = showconfigcomplete;