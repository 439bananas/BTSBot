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

async function getUserLang() { // Functions for getting the user language, fallback language (if the string in their preferred language does not exist), and default language
    let rawResonse = await fetch('/api/language/preferred');
    let response = await rawResonse.json();
    return response
}

async function getlang() {
    let rawResonse = await fetch('/api/language/fallback');
    let response = await rawResonse.json();
    return response
}

async function getCookies() {
    let rawResonse = await fetch('/api/cookies');
    let response = await rawResonse.json();
    return response
}

async function getDefaultLang() {
    let rawResponse = await fetch('/api/language/default');
    let response = await rawResponse.json()
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

async function getUniconf() {
    let rawResonse = await fetch('/api/uniconf');
    let response = await rawResonse.json();
    return response
}

async function hydrateDOM() { // Hydrating the script means that the client can pick up the other side and continue with the SPA without a problem
    let uniconf = await getUniconf()
    let ready = await checkConfExists() // Declaring these reduces API calls
    let defaultLang = await getDefaultLang()
    let userLang = await getUserLang()
    let fallbackLang = await getlang()
 
    if (ready.confExists) { // Does conf exist? Hydrate te React application according to whether it does
        ReactDOM.hydrate(
            <BrowserRouter>
                <Head language={{ preferred: userLang, fallback: fallbackLang, default: defaultLang }} uniconf={uniconf} />
                <App language={{ preferred: await getUserLang(), fallback: await getlang(), default: await getDefaultLang() }} confExists={ready.confExists} cookies={await getCookies()} />
            </BrowserRouter>,
            document.documentElement
        );
    } else {
        ReactDOM.hydrate(
            <BrowserRouter>
                <Head language={{ preferred: userLang, fallback: fallbackLang, default: defaultLang }} uniconf={uniconf} />
                <App language={{ preferred: userLang, fallback: fallbackLang, default: defaultLang }} confExists={ready.confExists} confErr={ready.confErr} confPath={await getConfPath()} uniconf={uniconf} DiscordUser={{}} queryString={query2JSON(window.location.search)} cookies={await getCookies()} />
            </BrowserRouter>,
            document.documentElement
        );
}
}

hydrateDOM()