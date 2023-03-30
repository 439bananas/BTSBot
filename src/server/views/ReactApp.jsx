/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: ReactApp.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require("react");
const { Routes, Route } = require("react-router-dom");
//const Header = require('./components/header');
//const Error404 = require('./404');
//const Head = require('./components/head');
//const Noconfintro = require('./no-conf-intro');
import About from './About'
import Home from './FP'

function App(props) {
    // fetch the user's language AND the prefered language
    // one small problem
    // to fetch the user's language, this needs to be run in browserRouter
    // but staticRouter gets sent by server side so the server is making the request to itself for the user lang, which then dependson the language of nodejs/the host machine of the dashboard
    // not the user!!!
    // i think the best way to get the user's lang is to continue to pass it as a prop
    // but in the browserRouter, fetch it and pass as prop in browser router, while in staticRouter, just pass as a prop using relevant function
    // there's more funky stuff i've done before so i'm lucky it's not the worst i've done
    return (
        <html>
            <head>
                <title>Server Rendered App</title>
            </head>
            <body>
                <Routes>
                    <Route path="/about" element={<About language={props.language} />} />
                    <Route path="/" element={<Home language={props.language} />} />
                </Routes>
                <script src="resources/bundle.js" />
            </body>
        </html>
    );
    /*if (!props.confExists) {
        return (
            <html lang={props.language.preferred}>
                <head>
                    <Head language={props.language} />
                </head>
                <body>
                    <Header DiscordUser={props.DiscordUser} language={props.language} />
                    <Routes>
                        <Route path="/" element={<Noconfintro language={props.language} confErr={props.confErr} />} errorElement={<Error404 language={props.language} />} />
                        <Route path="config" element={<Error404 language={props.language} />} />
                        <Route path="*" element={<Error404 language={props.language} />} />
                    </Routes>
                    <script src="/resources/bundle.js" />
                </body>
            </html>
        )
    } else {
        return (
            <html>
                <head>
                </head>
                <body>
                    <script src="/resources/bundle.js" />
                </body>
            </html>)
    }*/
}

module.exports = App;