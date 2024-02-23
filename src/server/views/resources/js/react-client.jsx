/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: react-client.jsx                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "../../ReactApp";
import React from 'react';
import Head from "../../components/head";
import query2JSON from "../../components/convertQueryStringToJSON.cjs";

async function getSpaInformation() { // Get any and all necessary information
    let rawResonse = await fetch('/api/page-info');
    let response = await rawResonse.json();
    return response
}

async function getConfPath() {
    let rawResonse = await fetch('/api/conf-path');
    let response = await rawResonse.json();
    return response
}

async function hydrateDOM() { // Hydrating the script means that the client can pick up the other side and continue with the SPA without a problem
    let spaInformation = await getSpaInformation() // Declaring this reduces API calls
    void spaInformation
    if (spaInformation.re.confExists) { // Does conf exist? Hydrate te React application according to whether it does
        let { uniconf, lang, user, contactLink, userIsMod, address, clientid } = spaInformation
        hydrate(
            <BrowserRouter>
                <Head language={lang} uniconf={uniconf} />
                <App addToServerLink={{ address: address, clientid: clientid }} language={lang} confExists={spaInformation.re.confExists} DiscordUser={user} uniconf={uniconf} userIsMod={userIsMod} contactLink={contactLink} />
            </BrowserRouter>,
            document.documentElement
        );
    } else {
        let { uniconf, lang } = spaInformation
        hydrate(
            <BrowserRouter>
                <Head language={lang} uniconf={uniconf} />
                <App language={lang} confExists={spaInformation.re.confExists} confErr={spaInformation.re.confErr} confPath={await getConfPath()} uniconf={uniconf} DiscordUser={{}} queryString={query2JSON(window.location.search)} />
            </BrowserRouter>,
            document.documentElement
        );
}
}

hydrateDOM()