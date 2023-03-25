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

const ReactDOM = require("react-dom/client");
const { BrowserRouter } = require("react-router-dom");
const App = require("../../ReactApp");
const React = require('react');

ReactDOM.hydrateRoot(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.documentElement
);