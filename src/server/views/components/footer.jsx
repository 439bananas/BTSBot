/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: footer.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: nbsp: " "

import React from 'react';
import translate from './getLanguageString.cjs';
import { Link } from 'react-router-dom';

function Footer(props) {
    let contactLinkElement

    if (props.contactLink == "/contact") {
        contactLinkElement = <Link to="/contact">{translate(props.language, "page_globalfootercontact").replace(/ /g, " ")}</Link>
    } else {
        contactLinkElement = <a href={props.contactLink}>{translate(props.language, "page_globalfootercontact").replace(/ /g, " ")}</a>
    }

    return (
        <footer className="p-4 bg-dark text-white">
            <div className="container" style={{ fontSize: 1 + "em", textAlign: "center" }}>
                {props.uniconf.projname.replace(/ /g, " ")}
                {" | "}
                <a href={props.uniconf.discord}>{translate(props.language, "page_globalfooterdiscord").replace(/ /g, " ")}</a>
                {" | "}
                <a href={props.uniconf.twitter}>{translate(props.language, "page_globalfootertwitter").replace(/ /g, " ")}</a>
                {" | "}
                {contactLinkElement}
                {" | "}
                <a href={"https://wiki." + props.uniconf.metadomain}>{translate(props.language, "page_globalfooterwiki").replace(/ /g, " ")}</a>
                {" | "}
                <Link to="/credits">{translate(props.language, "page_globalfootercredits").replace(/ /g, " ")}</Link>
                {" | "}
                <a href={"http://status." + props.uniconf.metadomain}>{translate(props.language, "page_globalfooterstatus").replace(/ /g, " ")}</a>
                {" | "}
                <a href="https://github.com/439bananas/BTSBot">{translate(props.language, 'page_globalgithub').replace(/ /g, " ")}</a>
                {" | "}
                <Link to="/translate">{translate(props.language, 'page_globalfootertranslate').replace(/ /g, " ")}</Link>
                {" | "}
                <Link to="/privacy-policy">{translate(props.language, 'page_globalfooterprivacypolicy').replace(/ /g, " ")}</Link>
                {" | "}
                <Link to="/terms-of-service">{translate(props.language, 'page_globalfootertos').replace(/ /g, " ")}</Link>
            </div>
        </footer>
    )
}

export default Footer;