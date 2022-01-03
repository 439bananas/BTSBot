/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//           File: getLanguageString.js            //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

// NOTES: Never use logHandler as a dependency in this file as it is a dependent, doing so will create a circular dependency

const fs = require('fs')
const path = require('path')
const uniconf = require('../configs/uniconf.json')
var defaultlanguage = require('../../i18n/' + uniconf.defaultlanguage + '.json')

function translate(languagecode, string) { // This function allows the caller to get a translated string
    if (fs.existsSync(path.join(__dirname, '..', '..', 'i18n', languagecode + '.json'))) { // If the specified language file exists, check if the string requested exists
        var language = require('../../i18n/' + languagecode + '.json')
        if (language[string] !== undefined) { // If it exists, return the string
            return language[string]
        } else if (defaultlanguage[string] !== undefined) { // If the string doesn't exist but the string in the default language exists, return that
            return defaultlanguage[string]
        } else return null; // Else, null
    } else { // Else if the default language has the string, return that, elsse return null
        if (defaultlanguage[string] === undefined) {
            return null;
        } else {
            return defaultlanguage[string];
        }
    }
}

module.exports = translate;