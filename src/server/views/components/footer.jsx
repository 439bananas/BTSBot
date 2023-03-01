/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: footer.jsx                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: nbsp: " "

const translate = require('../../../core/getLanguageString');

<footer className="p-4 bg-dark text-white">
    <div class="container" style={{ fontSize: 1 + "em", textAlign: "center" }}>
        {uniconf.projname.replace(/ /g, " ")}
        {" | "}
        <a href={uniconf.discord}>{translate(lang, "page_globalfooterdiscord").replace(/ /g, " ")}</a>
        {" | "}
        <a href={uniconf.twitter}>{translate(lang, "page_globalfootertwitter").replace(/ /g, " ")}</a>
        {" | "}
        <a href={contactLink}>{translate(lang, "page_globalfootercontact").replace(/ /g, " ")}</a>
        {" | "}
        <a href={"https://wiki." + uniconf.metadomain}>{translate(lang, "page_globalfooterwiki").replace(/ /g, " ")}</a>
        {" | "}
        <a href="/credits">{translate(lang, "page_globalfootercredits").replace(/ /g, " ")}</a>
        {" | "}
        <a href={"http://status." + uniconf.metadomain}>{translate(lang, "page_globalfooterstatus").replace(/ /g, " ")}</a>
        {" | "}
        <a href="https://github.com/439bananas/BTSBot">{translate(lang, 'page_globalgithub').replace(/ /g, " ")}</a>
        {" | "}
        <a href="/translate">{translate(lang, 'page_globalfootertranslate').replace(/ /g, " ")}</a>
        {" | "}
        <a href="/privacy-policy">{translate(lang, 'page_globalfooterprivacypolicy').replace(/ /g, " ")}</a>
        {" | "}
        <a href="/terms-of-service">{translate(lang, 'page_globalfootertos').replace(/ /g, " ")}</a>
    </div>
</footer>