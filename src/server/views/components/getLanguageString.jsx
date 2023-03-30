/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getLanguageString.jsx               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

let language

// well translate() in this context cannot have path or fs evidently :(
// let's see what we can do without vs being incredibly slow
// what if we pass, as a prop, the user's language to the react app and deal with the language that way?
// the prop would instead consist of the language files for preferred and fallback, rather than just the preferred and fallback language codes
// we could make a getLanguageJSON.jsx which, when we enter preferred and fallback language, will return the respective language files, if those files exist
// this then would be done on the server side, rather than the client side, meaning that the react application would actually work this time!
function translate(languagecode, string) { // This function allows the caller to get a translated string
    let defaultlanguage = require('../src/i18n/' + uniconf.defaultlanguage + '.json')
    if (fs.existsSync(path.join(__dirname, '..', 'src', 'i18n', languagecode.preferred + '.json'))) { // If the specified language file exists, check if the string requested exists
        language = require('../src/i18n/' + languagecode.preferred + '.json')
    } else {
        language = require('../src/i18n/' + languagecode.fallback + '.json')
    }
    if (language[string] !== undefined) { // If it exists, return the string
        return language[string]
    } else if (typeof (languagecode.fallback) !== "undefined") { /// If language does not exist, if there is a config language defined, use that if possible, else default to default language
        language = require('../src/i18n/' + languagecode.fallback + '.json')
        if (language[string] !== undefined) {
            return language[string]
        } else if (defaultlanguage[string] !== undefined) {
            return defaultlanguage[string]
        } else return null
    } else if (defaultlanguage[string] !== undefined) { // If the string doesn't exist but the string in the default language exists, return that
        return defaultlanguage[string]
    } else return null; // Else, null
}

module.exports = translate;