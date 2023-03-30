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

async function getUserLang() {
    let rawResonse = await fetch('/api/language/preferred');
    let response = await rawResonse.json();
    return response
}

async function getlang() {
    let rawResonse = await fetch('/api/language/fallback');
    let response = await rawResonse.json();
    return response
}

async function hydrateDOM() {
    ReactDOM.hydrate(
        <BrowserRouter>
            <App language={{ preferred: await getUserLang(), fallback: await getlang() }} />
        </BrowserRouter>,
        document.documentElement
    );
}

hydrateDOM()