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

function show404(res, lang, conf) {
    res.status(404);
    res.render('../src/server/pages/404.ejs', { // Simple functions reduce redundancy!
        projname: uniconf.projname,
        conf: conf,
        prereleasewarning: "",
        i18nprereleasewarning: translate(lang, 'page_globalprereleasewarningpart1') + uniconf.projname + translate(lang, 'page_globalprereleasewarningpart2'),
        metadomain: uniconf.metadomain,
        metaurl: "https://" + uniconf.metadomain,
        wikiurl: "https://wiki." + uniconf.metadomain,
        discord: uniconf.discord,
        i18npagetitle: translate(lang, 'page_404pagetitle'),
        i18ntitle: translate(lang, 'page_404errortitle'),
        i18ndescription: translate(lang, 'page_404errordescription'),
        i18ngithub: translate(lang, 'page_globalgithub'),
        i18ngdescription: translate(lang, 'page_globaldescription'),
        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
        i18ndiscord: translate(lang, 'page_globaldiscord'),
        i18ndashboard: translate(lang, 'page_noconfdashboard')
    })
}

module.exports = show404;