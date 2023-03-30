/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: interface.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
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

router.get("*", async (req, res) => {
    let html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url}>
            <App confExists={req.confExists} confErr={req.confErr} language={{ preferred: getLangFile(await getUserLang(req)), fallback: getLangFile(await getlang()) }} DiscordUser={req.user} userIsMod={await isMod(req.user.id)} />
        </StaticRouter>
    );
    res.send("<!DOCTYPE html>" + html);
});

module.exports = router;