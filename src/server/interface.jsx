/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: interface.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const ReactDOMServer = require("react-dom/server");
const { StaticRouter } = require("react-router-dom/server");
const App = require("./views/ReactApp");
const React = require('react');
const getUserLang = require('../core/getUserLang');
const getlang = require('../core/getLanguageJSON');
const isMod = require('../core/getUserModStatus');
const getLangFile = require('./views/components/getLanguageJSON');
const Head = require('./views/components/head');

router.get("*", async (req, res) => {
    let html = ReactDOMServer.renderToString( // Passing every possibly required language here means that translate() further down the line does not require await, nor does not bog down the entire SPA
        <StaticRouter location={req.url}>
            <Head language={{ preferred: getLangFile(await getUserLang(req)), fallback: getLangFile(await getlang()), default: getLangFile(uniconf.defaultlanguage) }} uniconf={uniconf} />
            <App confExists={req.confExists} confErr={req.confErr} language={{ preferred: getLangFile(await getUserLang(req)), fallback: getLangFile(await getlang()), default: getLangFile(uniconf.defaultlanguage) }} DiscordUser={req.user} userIsMod={await isMod(req.user.id)} confPath={path.join(__dirname, '..', 'configs')} uniconf={uniconf} />
        </StaticRouter>
    );
    res.send("<!DOCTYPE html>" + html);
});

module.exports = router;