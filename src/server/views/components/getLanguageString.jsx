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

const path = require('path')
const fs = require('fs')
let language

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