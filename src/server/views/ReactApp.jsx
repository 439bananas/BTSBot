/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: ReactApp.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require("react");
const { Routes, Route } = require("react-router-dom");
const Header = require('./components/header');
const Error404 = require('./404');
const Noconfintro = require('./no-conf-intro');
import About from './About'
import Config from './config';
import Home from './FP'

function App(props) {
    /*return (
        <html>
            <head>
                <title>Server Rendered App</title>
            </head>
            <body>
                <Routes>
                    <Route path="/about" element={<About language={props.language} />} />
                    <Route index element={<Home language={props.language} />} />
                </Routes>
                <script src="resources/bundle.js" />
            </body>
        </html>
    );*/
    if (!props.confExists) {
        return (
            <body>
                <Header DiscordUser={props.DiscordUser} language={props.language} uniconf={props.uniconf} />
                <div className="loader">
                    <Routes>
                        <Route path="/">
                            <Route index element={<Noconfintro language={props.language} confErr={props.confErr} confPath={props.confPath} uniconf={props.uniconf} DiscordUser={{}} />} />
                            <Route path="config" element={<Config language={props.language} confErr={props.confErr} uniconf={props.uniconf} queryString={props.queryString} />} />
                            <Route path="*" element={<Error404 language={props.language} confErr={props.confErr} uniconf={props.uniconf} />} />
                        </Route>
                    </Routes>
                </div>
                <script src="/resources/bundle.js" />
            </body>
        )
    } else {
        return (
            <body>
                <script src="/resources/bundle.js" />
            </body>)
    }
}

module.exports = App;