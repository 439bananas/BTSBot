/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: header.jsx                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import translate from './getLanguageString.cjs';
import React from 'react';
import PrereleaseWarning from './prerelease-warning';
import { mode } from '../../../../package.json';
import { Link } from 'react-router-dom';
let modDropdownOptions
let signinbutton
let prereleasewarning

function Header(props) {
    if (props.DiscordUser.avatar == null) { // If we have no profile picture, do the magic calculation! https://discord.com/developers/docs/reference#image-formatting
        avatarfilename = (props.DiscordUser.id >> 22) % 6
        avatarurl = 'https://cdn.discordapp.com/embed/avatars/' + avatarfilename + ".png"
    } else { // If we do have one, set the link to this.
        avatarfilename = props.DiscordUser.avatar
        avatarurl = 'https://cdn.discordapp.com/avatars/' + props.DiscordUser.id + "/" + avatarfilename
    }

    if (props.confExists && props.userIsMod) { // Check if user is classed as a mod in the configured guild and add options based on that. If no conf or user not signed in, isMod will always return false
        modDropdownOptions = <div>
            <li><Link className="dropdown-item" to="/helpdesk">{translate(props.language, "page_globalhelpdesk")}</Link></li>
            <li><Link className="dropdown-item" to="/all-servers">{translate(props.language, "page_globalallservers")}</Link></li>
            <li><Link className="dropdown-item" to="/user-manager">{translate(props.language, "page_globalusermanager")}</Link></li>
        </div>
    } else {
        modDropdownOptions = " "
    }

    if (!props.confExists) { // Determine what's shown in the area of the sign-in button
        // If no conf, show a link to the official dashboard
        signinbutton = <button type="button" id="dashboard-button" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
            <div className="contents-18-Yxp">{translate(props.language, "page_noconfdashboard")}</div>
        </button>
    } else if (typeof (props.DiscordUser.id) == "undefined") { // If user not signed in, show the "sign in" button
        signinbutton = <button type="button" id="SignInButton" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
            <div className="contents-18-Yxp">{translate(props.language, "page_globalsigninwithdiscord")}</div>
        </button>
    } else { // If the user is signed in, show all of the options available to them
        let usernameAssembly = " " + props.DiscordUser.username // Show discriminator if user still has one
        if (props.DiscordUser.discriminator != 0) {
            usernameAssembly += "#" + props.DiscordUser.discriminator
        }
        signinbutton = <div className="dropdown" id="logged-in-dropdown">
            <a href="#" className="nav-link dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <img className="profile-picture-icon rounded-circle" width="32" src={avatarurl} />
                {usernameAssembly}
            </a>
            <ul className="dropdown-menu" aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/servers">{translate(props.language, "page_globalservers")}</Link></li>
                {modDropdownOptions}
                <li><Link className="dropdown-item" to="/settings">{translate(props.language, "page_globalaccountsettings")}</Link></li>
                <li><a className="dropdown-item" href="/logout">{translate(props.language, "page_globalsignout")}</a></li>
            </ul>
        </div>
    }

    if (mode == "active-development" || mode == "ad" || mode == "beta" || mode == "alpha") { // If we're using the development builds, show the prerelease warning
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