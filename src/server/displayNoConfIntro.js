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

function shownci(res, lang, confpath, noconfintro1, noconfintro2, noconfintro3, noconfintro4, noconfintrodiag) {
    res.status(200);
    res.render('../src/server/pages/noconfintro.ejs', {
        projname: uniconf.projname,
        confpath: confpath,
        metadomain: uniconf.metadomain,
        metaurl: "https://" + uniconf.metadomain,
        wikiurl: "https://wiki." + uniconf.metadomain,
        discord: uniconf.discord,
        i18npagetitle: translate(lang, 'page_configpagetitle'),
        i18ngdescription: translate(lang, 'page_globaldesc'),
        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
        i18ndiscord: translate(lang, 'page_globaldiscord'),
        i18ngithub: translate(lang, 'page_globalgithub'),
        i18ndashboard: translate(lang, 'page_noconfdashboard'),
        i18nheadertitle: translate(lang, 'page_noconfintroheader'),
        i18nnextbutton: translate(lang, 'page_globalnext'),
        i18nnoconfintro1: noconfintro1,
        i18nnoconfintro2: noconfintro2,
        i18nnoconfintro3: noconfintro3,
        i18nnoconfintro4: noconfintro4,
        i18nnoconfintrodiag: noconfintrodiag,
        conf: false
    });
}

module.exports = shownci;