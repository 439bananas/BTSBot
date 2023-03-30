/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: react-client.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const ReactDOM = require("react-dom");
const { BrowserRouter } = require("react-router-dom");
const App = require("../../ReactApp");
const React = require('react');

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

async function getDefaultLang() {
    let rawResonse = await fetch('/api/language/default');
    let response = await rawResonse.json();
    return response
}

async function checkConfExists() {
    let rawResonse = await fetch('/api/ready');
    let response = await rawResonse.json();
    return response
}

async function hydrateDOM() { // Hydrating the script means that the client can pick up the other side and continue with the SPA without a problem
    let ready = await checkConfExists()
    if (ready.confExists) { // Does conf exist? Hydrate te React application according to whether it does
        ReactDOM.hydrate(
            <BrowserRouter>
                <App language={{ preferred: await getUserLang(), fallback: await getlang(), default: await getDefaultLang() }} confExists={ready.confExists} />
            </BrowserRouter>,
            document.documentElement
        );
    } else {
        ReactDOM.hydrate(
            <BrowserRouter>
                <App language={{ preferred: await getUserLang(), fallback: await getlang(), default: await getDefaultLang() }} confExists={ready.confExists} confErr={ready.confErr} />
            </BrowserRouter>,
            document.documentElement
        );
    }
}

hydrateDOM()