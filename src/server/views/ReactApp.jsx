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
const { Routes, Route, Outlet } = require("react-router");
const Header = require('./components/header');
const Error404 = require('./404');
const Head = require('./components/head');
const Noconfintro = require('./no-conf-intro')
/*(import About from './About'
import Home from './Home'*/

function App(props) {
    /*return (
        <html>
            <head>
                <title>Server Rendered App</title>
            </head>
            <body>
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/" element={<Home />} />
                </Routes>
                <script src="/bundle.js" />
            </body>
        </html>
    );*/
    if (!props.confExists) {
        return (
            <html lang={props.language.preferred}>
                <head>
                    <Head language={props.language} />
                </head>
                <body>
                    <Header DiscordUser={props.DiscordUser} language={props.language} />
                    <Routes>
                        <Route path="/" exact element={<Noconfintro language={props.language} confErr={props.confErr} />} errorElement={<Error404 language={props.language} />} />
                        <Route path="/config" />
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
    }
}

module.exports = App;