/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: react-client.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const ReactDOM = require("react-dom");
const { BrowserRouter } = require("react-router-dom");
const App = require("../../ReactApp");
const React = require('react');
const Head = require("../../components/head");
const query2JSON = require("../../components/convertQueryStringToJSON");

async function getSpaInformation() { // Get any and all necessary information
    let rawResonse = await fetch('/api/page-info');
    let response = await rawResonse.json();
    return response
}

async function checkConfExists() {
    let rawResonse = await fetch('/api/ready');
    let response = await rawResonse.json();
    return response
}

async function getConfPath() {
    let rawResonse = await fetch('/api/conf-path');
    let response = await rawResonse.json();
    return response
}

async function hydrateDOM() { // Hydrating the script means that the client can pick up the other side and continue with the SPA without a problem
    let ready = await checkConfExists() // Declaring these reduces API calls
    void ready
    let spaInformation = await getSpaInformation()
    void spaInformation
    if (ready.confExists) { // Does conf exist? Hydrate te React application according to whether it does
        let { uniconf, lang, user, contactLink, userIsMod, address, clientid } = spaInformation
        ReactDOM.hydrate(
            <BrowserRouter>
                <Head language={lang} uniconf={uniconf} />
                <App addToServerLink={{ address: address, clientid: clientid }} language={lang} confExists={ready.confExists} DiscordUser={user} uniconf={uniconf} userIsMod={userIsMod} contactLink={contactLink} />
            </BrowserRouter>,
            document.documentElement
        );
    } else {
        let { uniconf, lang } = spaInformation
        ReactDOM.hydrate(
            <BrowserRouter>
                <Head language={lang} uniconf={uniconf} />
                <App language={lang} confExists={ready.confExists} confErr={ready.confErr} confPath={await getConfPath()} uniconf={uniconf} DiscordUser={{}} queryString={query2JSON(window.location.search)} />
            </BrowserRouter>,
            document.documentElement
        );
}
}

hydrateDOM()