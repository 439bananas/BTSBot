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
import { renderToString } from "react-dom/server.js";
import { StaticRouter } from "react-router-dom/server.js";
import App from "./views/ReactApp.jsx";
import React from 'react';
import getUserLang from '../core/getUserLang';
import getlang from '../core/getLanguageJSON';
import isMod from '../core/getUserModStatus.cjs';
import getLangFile from './views/components/getLanguageJSON.js';
import Head from './views/components/head.jsx';
import getContactLink from '../core/getContactLink.js';
import getaddress from '../core/getReqAddress.cjs';
import getid from '../core/getApplicationId.js';
import validateConf from './validateConf';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

router.get("*", async (req, res, next) => {
    let re = await validateConf(req)
    try {
        const conf = await import("../../configs/conf.json", { assert: { type: "json" } })
        const id = getid(conf.token)
        let html = renderToString( // Passing every possibly required language here means that translate() further down the line does not require await, nor does not bog down the entire SPA
            <StaticRouter location={req.originalUrl}>
                <Head language={{ preferred: await getLangFile(await getUserLang(req)), fallback: await getLangFile(await getlang()), default: await getLangFile(uniconf.defaultlanguage) }} uniconf={uniconf} />
                <App addToServerLink={{ address: getaddress(req), clientid: id }} confExists={re.confExists} confErr={re.confErr} language={{ preferred: await getLangFile(await getUserLang(req)), fallback: await getLangFile(await getlang()), default: await getLangFile(uniconf.defaultlanguage) }} DiscordUser={req.user} userIsMod={await isMod(req.user.id)} uniconf={uniconf} confPath={path.join(__dirname, '..', 'configs')} queryString={req.query} contactLink={await getContactLink()} />
            </StaticRouter>
        );
        res.send("<!DOCTYPE html>" + html);
    } catch (err) {
        void err
        const conf = {}
        const id = 0
        let html = renderToString( // Passing every possibly required language here means that translate() further down the line does not require await, nor does not bog down the entire SPA
            <StaticRouter location={req.originalUrl}>
                <Head language={{ preferred: await getLangFile(await getUserLang(req)), fallback: await getLangFile(await getlang()), default: await getLangFile(uniconf.defaultlanguage) }} uniconf={uniconf} />
                <App addToServerLink={{ address: getaddress(req), clientid: id }} confExists={re.confExists} confErr={re.confErr} language={{ preferred: await getLangFile(await getUserLang(req)), fallback: await getLangFile(await getlang()), default: await getLangFile(uniconf.defaultlanguage) }} DiscordUser={req.user} userIsMod={await isMod(req.user.id)} uniconf={uniconf} confPath={path.join(__dirname, '..', 'configs')} queryString={req.query} contactLink={await getContactLink()} />
            </StaticRouter>
        );
        res.send("<!DOCTYPE html>" + html);
    }
});

export default router;