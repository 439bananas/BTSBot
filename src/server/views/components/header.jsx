/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: header.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const translate = require('./getLanguageString')
const React = require('react');
const PrereleaseWarning = require('./prerelease-warning');
const pkg = require('../../../../package.json');
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
            <li><a className="dropdown-item" href="/helpdesk">{translate(props.language, "page_globalhelpdesk", 'express-engine-jsx')}</a></li>
            <li><a className="dropdown-item" href="/all-servers">{translate(props.language, "page_globalallservers", 'express-engine-jsx')}</a></li>
            <li><a className="dropdown-item" href="/user-manager">{translate(props.language, "page_globalusermanager", 'express-engine-jsx')}</a></li>
        </div>
    } else {
        modDropdownOptions = " "
    }

    if (!props.confExists) { // Determine what's shown in the area of the sign-in button
        // If no conf, show a link to the official dashboard
        signinbutton = <button type="button" id="dashboard-button" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
            <div className="contents-18-Yxp">{translate(props.language, "page_noconfdashboard", 'express-engine-jsx')}</div>
        </button>
    } else if (typeof (props.DiscordUser.id) == "undefined") { // If user not signed in, show the "sign in" button
        signinbutton = <button type="button" id="SignInButton" className="button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN">
            <div className="contents-18-Yxp">{translate(props.language, "page_globalsigninwithdiscord", 'express-engine-jsx')}</div>
        </button>
    } else { // If the user is signed in, show all of the options available to them
        signinbutton = <div className="dropdown" id="logged-in-dropdown">
            <a href="#" className="nav-link dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <img className="profile-picture-icon rounded-circle" width="32" src={avatarurl} />
                {" " + props.DiscordUser.username + "#" + props.DiscordUser.discriminator}
            </a>
            <ul className="dropdown-menu" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="/servers">{translate(props.language, "page_globalservers", 'express-engine-jsx')}</a></li>
                {modDropdownOptions}
                <li><a className="dropdown-item" href="/settings">{translate(props.language, "page_globalaccountsettings", 'express-engine-jsx')}</a></li>
                <li><a className="dropdown-item" href="/logout">{translate(props.language, "page_globalsignout", 'express-engine-jsx')}</a></li>
            </ul>
        </div>
    }

    if (pkg.mode == "active-development" || pkg.mode == "ad" || pkg.mode == "beta" || pkg.mode == "alpha") { // If we're using the development builds, show the prerelease warning
        prereleasewarning = <PrereleaseWarning />
    } else {
        prereleasewarning = " "
    }

    return (
        <header>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <div className="container">
                    <a href="/" className="navbar-brand"><img src="/resources/60px.png" className="img-fluid img-thumbnail" /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a href={"https://wiki." + props.uniconf.metadomain} className="nav-link">{translate(props.language, 'page_globaldocumentation', 'express-engine-jsx')}</a>
                            </li>
                            <li className="nav-item">
                                <a href={props.uniconf.discord} className="nav-link">{translate(props.language, 'page_globaldiscord', 'express-engine-jsx')}</a>
                            </li>
                            <li className="nav-item">
                                <a href="https://github.com/439bananas/BTSBot" className="nav-link">{translate(props.language, "page_globalgithub", 'express-engine-jsx')}</a>
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

module.exports = Header;