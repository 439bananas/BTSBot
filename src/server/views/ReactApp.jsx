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
const Footer = require('./components/footer')
const Config = require('./config');
const Home = require('./home');

function App(props) {
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
                <Header DiscordUser={props.DiscordUser} language={props.language} uniconf={props.uniconf} confExists={true} userIsMod={props.userIsMod} />
                <div className="view">
                    <div className="loader">
                        <Routes>
                            <Route path="/">
                                <Route index element={<Home addToServerLink={props.addToServerLink} language={props.language} uniconf={props.uniconf} />} />
                                <Route path="*" element={<Error404 language={props.language} confErr={props.confErr} uniconf={props.uniconf} />} />
                            </Route>
                        </Routes>
                    </div>
                </div>
                <Footer language={props.language} uniconf={props.uniconf} contactLink={props.contactLink} />
                <script src="/resources/bundle.js" />
            </body>)
    }
}

module.exports = App;