/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: interface.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express';
const router = Router();
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./views/ReactApp.jsx";
import React from 'react';
import getUserLang from '../core/getUserLang';
import getlang from '../core/getLanguageJSON.cjs';
import isMod from '../core/getUserModStatus.cjs';
import getLangFile from './views/components/getLanguageJSON.cjs';
import Head from './views/components/head.jsx';
import getContactLink from '../core/getContactLink.cjs';
import getaddress from '../core/getReqAddress.cjs';
import getid from '../core/getApplicationId.cjs';
import validateConf from './validateConf.cjs';

router.get("*", async (req, res, next) => {
    let re = await validateConf(req)
    let conf
    let id
    if (!re.confExists) {
        conf = {}
        id = 0
    } else {
        conf = require('../../configs/conf.json')
        id = getid(conf.token)
    }
    let html = renderToString( // Passing every possibly required language here means that translate() further down the line does not require await, nor does not bog down the entire SPA
        <StaticRouter location={req.originalUrl}>
            <Head language={{ preferred: getLangFile(await getUserLang(req)), fallback: getLangFile(await getlang()), default: getLangFile(uniconf.defaultlanguage) }} uniconf={uniconf} />
            <App addToServerLink={{ address: getaddress(req), clientid: id }} confExists={re.confExists} confErr={re.confErr} language={{ preferred: getLangFile(await getUserLang(req)), fallback: getLangFile(await getlang()), default: getLangFile(uniconf.defaultlanguage) }} DiscordUser={req.user} userIsMod={await isMod(req.user.id)} uniconf={uniconf} confPath={path.join(__dirname, '..', 'configs')} queryString={req.query} contactLink={await getContactLink()} />
        </StaticRouter>
    );
    res.send("<!DOCTYPE html>" + html);
});

export default router;