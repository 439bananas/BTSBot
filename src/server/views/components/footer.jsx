/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: footer.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: nbsp: " "

const React = require('react');
const translate = require('./getLanguageString');

function Footer(props) {
    return (
        <footer className="p-4 bg-dark text-white">
            <div class="container" style={{ fontSize: 1 + "em", textAlign: "center" }}>
                {uniconf.projname.replace(/ /g, " ")}
                {" | "}
                <a href={uniconf.discord}>{translate(props.language, "page_globalfooterdiscord").replace(/ /g, " ")}</a>
                {" | "}
                <a href={uniconf.twitter}>{translate(props.language, "page_globalfootertwitter").replace(/ /g, " ")}</a>
                {" | "}
                <a href={contactLink}>{translate(props.language, "page_globalfootercontact").replace(/ /g, " ")}</a>
                {" | "}
                <a href={"https://wiki." + uniconf.metadomain}>{translate(props.language, "page_globalfooterwiki").replace(/ /g, " ")}</a>
                {" | "}
                <a href="/credits">{translate(props.language, "page_globalfootercredits").replace(/ /g, " ")}</a>
                {" | "}
                <a href={"http://status." + uniconf.metadomain}>{translate(props.language, "page_globalfooterstatus").replace(/ /g, " ")}</a>
                {" | "}
                <a href="https://github.com/439bananas/BTSBot">{translate(props.language, 'page_globalgithub').replace(/ /g, " ")}</a>
                {" | "}
                <a href="/translate">{translate(props.language, 'page_globalfootertranslate').replace(/ /g, " ")}</a>
                {" | "}
                <a href="/privacy-policy">{translate(props.language, 'page_globalfooterprivacypolicy').replace(/ /g, " ")}</a>
                {" | "}
                <a href="/terms-of-service">{translate(props.language, 'page_globalfootertos').replace(/ /g, " ")}</a>
            </div>
        </footer>
    )
}

module.exports = Footer;