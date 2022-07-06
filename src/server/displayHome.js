/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: displayHome.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getaddress = require('../core/getReqAddress')
const path = require('path')

function showhome(req, res, lang, clientid) { // Not gonna lie, not entirely keen that some of these pages have so many variables one needs to pass (if there's a way to automatically pass variables in consistently templated content like head, header and footer please submit an issue or let me know somehow) but we live with it
    res.status(200);
    res.render('../src/server/pages/home.ejs', {
        projname: uniconf.projname,
        confpath: path.join(__dirname, 'configs'),
        metadomain: uniconf.metadomain,
        metaurl: "https://" + uniconf.metadomain,
        wikiurl: "https://wiki." + uniconf.metadomain,
        discord: uniconf.discord,
        twitter: uniconf.twitter,
        i18nbtsbotlogo: translate(lang, 'page_globalbtsbotlogo'),
        i18nbtsbothome: translate(lang, 'page_globalbtsbothome'),
        i18ngdescription: translate(lang, 'page_globaldesc'),
        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
        i18ndiscord: translate(lang, 'page_globaldiscord'),
        i18ngithub: translate(lang, 'page_globalgithub'),
        conf: true,
        i18ndashboard: translate(lang, 'page_noconfdashboard'),
        i18nheadertitle: translate(lang, 'page_hometitle'),
        i18nhomeintro1: translate(lang, 'page_homeintropart1'),
        i18nhomeintro2: translate(lang, 'page_homeintropart2'),
        i18nhomeintro3: translate(lang, 'page_homeintropart3'),
        i18nhomefeaturestitle: translate(lang, 'page_featuresheading'),
        i18nhomefeature1title: translate(lang, 'page_feature1title'),
        i18nhomefeature2title: translate(lang, 'page_feature2title'),
        i18nhomefeature3title: translate(lang, 'page_feature3title'),
        i18nhomefeature4title: translate(lang, 'page_feature4title'),
        i18nhomefeature5title: translate(lang, 'page_feature5title'),
        i18nhomefeature6title: translate(lang, 'page_feature6title'),
        i18nhomefeature1text: translate(lang, 'page_feature1text'),
        i18nhomefeature2text: translate(lang, 'page_feature2text'),
        i18nhomefeature3text: translate(lang, 'page_feature3text'),
        i18nhomefeature4text: translate(lang, 'page_feature4text'),
        i18nhomefeature5text: translate(lang, 'page_feature5text'),
        i18nhomefeature6text: translate(lang, 'page_feature6text'),
        i18noutro1: translate(lang, 'page_homeoutropart1'),
        i18noutro2: translate(lang, 'page_homeoutropart2'),
        i18noutro3: translate(lang, 'page_homeoutropart3'),
        i18noutro4: translate(lang, 'page_homeoutropart4'),
        oauth2link: "https://discord.com/oauth2/authorize?client_id=" + clientid + "&permissions=" + uniconf.perms + "&redirect_uri=" + encodeURIComponent(getaddress(req) + "/servers") + "&response_type=code&scope=email%20identify%20bot%20applications.commands",
        i18nfooterprojname: uniconf.projname.replace(/ /g, "&nbsp;"),
        i18nfooterdiscord: translate(lang, "page_globalfooterdiscord").replace(/ /g, "&nbsp"),
        i18nfootertwitter: translate(lang, "page_globalfootertwitter").replace(/ /g, "&nbsp"),
        i18nfootercredits: translate(lang, "page_globalfootercredits").replace(/ /g, "&nbsp"),
        i18nfootercontact: translate(lang, "page_globalfootercontact").replace(/ /g, "&nbsp"),
        i18nfooterwiki: translate(lang, "page_globalfooterwiki").replace(/ /g, "&nbsp"),
        i18nfooterstatus: translate(lang, "page_globalfooterstatus").replace(/ /g, "&nbsp"),
        i18nfootergithub: translate(lang, 'page_globalgithub').replace(/ /g, "&nbsp;"),
        i18nfootertranslate: translate(lang, 'page_globalfootertranslate').replace(/ /g, "&nbsp"), // Kind of ironic that we're performing the translate function on a piece of text called "translate"
        i18nfooterprivacypolicy: translate(lang, 'page_globalfooterprivacypolicy').replace(/ /g, "&nbsp"),
        i18nfootertos: translate(lang, 'page_globalfootertos').replace(/ /g, "&nbsp")
    });
}

module.exports = showhome;