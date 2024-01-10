/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getLanguageString.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// Well translate() in this context cannot have path or fs evidently :(

function translate(language, string) { // This function allows the caller to get a translated string
    if (typeof (language.preferred[string]) !== "undefined") { // Does thee string in the preferred language exist? Sweet, return that
        return (language.preferred[string])
    } else if (typeof (language.fallback[string]) !== "undefined") { // If it doesn't exist, does it exist in the configured (in conf.json) or default language, taking configured as priority?
        return (language.fallback[string])
    } else if (typeof (language.default[string]) !== "undefined") { // If that doesn't exist, does the string exist in the default language?
        return (language.default[string])
    } else return null
}

module.exports = translate;