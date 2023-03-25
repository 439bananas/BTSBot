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
const Header = require('./components/header');
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
            <html>
                <head>
                    <Head />
                </head>
                <body>
                    <Header DiscordUser={props.DiscordUser} />
                    <p>
                        {JSON.stringify(props)}
                    </p>
                    <script src="/resources/bundle.js" />
                    <Routes>
                        <Route path="/" element={<Noconfintro />} />
                    </Routes>
                </body>
            </html>
        )
    } else {
        return (
            <html>
                <head>

                </head>
                <body>
                    <p>
                        {JSON.stringify(props)}
                    </p>
                    <script src="/resources/bundle.js" />
                </body>
            </html>)
    }
}

module.exports = App;