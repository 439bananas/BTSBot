/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: displayWall.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
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
    /*res.render('../pages/errorpage.ejs', {
        projname: uniconf.projname,
        metadomain: uniconf.metadomain,
        metaurl: "https://" + uniconf.metadomain,
        wikiurl: "https://wiki." + uniconf.metadomain,
        discord: uniconf.discord,
        prereleasewarning: "",
        i18nprereleasewarning: translate(lang, 'page_globalprereleasewarningpart1') + uniconf.projname + translate(lang, 'page_globalprereleasewarningpart2'),
        error: error,
        diag: diag,
        i18npagetitle: translate(lang, 'page_configpagetitle'),
        i18ngithub: translate(lang, 'page_globalgithub'),
        i18ngdescription: translate(lang, 'page_globaldescription'),
        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
        i18ndiscord: translate(lang, 'page_globaldiscord'),
        i18ndashboard: translate(lang, 'page_noconfdashboard'),
        conf: false
    })*/
}

module.exports = showwall;