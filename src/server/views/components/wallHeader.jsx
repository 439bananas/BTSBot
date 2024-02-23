/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: wallHeader.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import translate from './getLanguageString';
import React from 'react';
import PrereleaseWarning from './prerelease-warning';
import { Link } from 'react-router-dom';
let signinbutton
let prereleasewarning

function Header(props) {
    // Show a link to the official dashboard
    signinbutton = <button type="button" id="dashboard-button" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
        <div className="contents-18-Yxp">{translate(props.language, "page_noconfdashboard")}</div>
    </button>

    if (props.pkg.mode == "active-development" || props.pkg.mode == "ad" || props.pkg.mode == "beta" || props.pkg.mode == "alpha") { // If we're using the development builds, show the prerelease warning
        prereleasewarning = <PrereleaseWarning />
    } else {
        prereleasewarning = " "
    }

    return (
        <header>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand"><img src="/resources/60px.png" className="img-fluid img-thumbnail" /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a href={"https://wiki." + props.uniconf.metadomain} className="nav-link">{translate(props.language, 'page_globaldocumentation')}</a>
                            </li>
                            <li className="nav-item">
                                <a href={props.uniconf.discord} className="nav-link">{translate(props.language, 'page_globaldiscord')}</a>
                            </li>
                            <li className="nav-item">
                                <a href="https://github.com/439bananas/BTSBot" className="nav-link">{translate(props.language, "page_globalgithub")}</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                {signinbutton}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {prereleasewarning}
        </header>
    )
}

export default Header;