/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: ReactApp.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from './components/header';
import Error404 from './404';
import Noconfintro from './no-conf-intro';
import Footer from './components/footer';
import Config from './config';
import Home from './home';
import Servers from './servers';
import AllServers from "./all-servers";

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
                <script type="module" src="/resources/buttons.js" />
                <script src="/resources/bundle.js" />
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
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
                                <Route path="servers/*" element={<Servers addToServerLink={props.addToServerLink} language={props.language} uniconf={props.uniconf} user={props.DiscordUser} />} />
                                <Route path="all-servers" element={<AllServers userIsMod={props.userIsMod} language={props.language} confErr={props.confErr} uniconf={props.uniconf} />} />
                                <Route path="*" element={<Error404 language={props.language} confErr={props.confErr} uniconf={props.uniconf} user={props.DiscordUser} />} />
                            </Route>
                        </Routes>
                    </div>
                </div>
                <Footer language={props.language} uniconf={props.uniconf} contactLink={props.contactLink} />
                <script type="module" src="/resources/buttons.js" />
                <script src="/resources/bundle.js" />
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
            </body>)
    }
}

export default App;