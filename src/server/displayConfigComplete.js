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
    res.render('../src/server/pages/config-complete.ejs', { // Conf is complete! Display the page
        projname: uniconf.projname,
        metadomain: uniconf.metadomain,
        metaurl: "https://" + uniconf.metadomain,
        wikiurl: "https://wiki." + uniconf.metadomain,
        discord: uniconf.discord,
        i18npagetitle: translate(lang, 'page_configpagetitle'),
        i18ngithub: translate(lang, 'page_globalgithub'),
        i18ngdescription: translate(lang, 'page_globaldescription'),
        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
        i18ndiscord: translate(lang, 'page_globaldiscord'),
        i18ndashboard: translate(lang, 'page_noconfdashboard'),
        i18nheadertitle: translate(lang, 'page_configcompleteheader'),
        i18nconfsuccessful: translate(lang, 'page_confsuccessfulpart1') + uniconf.projname + translate(lang, 'page_confsuccessfulpart2'),
        i18nconfsuccessfuldiag: translate(lang, 'page_confsuccessfuldiag'),
        i18nnextbutton: translate(lang, 'page_globalnext'),
        prereleasewarning: "",
        i18nprereleasewarning: translate(lang, 'page_globalprereleasewarningpart1') + uniconf.projname + translate(lang, 'page_globalprereleasewarningpart2'),
        conf: false
    })
}

module.exports = showconfigcomplete;