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

// NOTES: Never use logHandler as a dependency in this file as it is a dependent, doing so will create a circular dependency

import { existsSync } from 'fs'
import { join } from 'path'
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let conf
let language
let basePath

async function translate(languagecode, string, reactEngine) { // This function allows the caller to get a translated string
    switch (reactEngine) {
        case "express-engine-jsx":
            basePath = '..'
            break;
        default:
            basePath = '../src'
            break;
    }

    let defaultlanguage = (await import(basePath + '/i18n/' + uniconf.defaultlanguage + '.json', { assert: { type: "json" } })).default
    if (existsSync(join(__dirname, basePath, 'i18n', languagecode + '.json'))) { // If the specified language file exists, check if the string requested exists
        language = (await import(basePath + '/i18n/' + languagecode + '.json', { assert: { type: "json" } })).default
    } else if (typeof(conf) != "undefined" && existsSync(join(__dirname, basePath, 'i18n', conf.language + '.json'))) { // Else if the default language has the string, return that, elsse return null
        language = (await import(basePath + '/i18n/' + conf.language + '.json', { assert: { type: "json" } })).default
    } else {
        language = defaultlanguage
    }
    if (language[string] !== undefined) { // If it exists, return the string
        return language[string]
    } else if (typeof (conf) !== "undefined" && typeof (conf.language) !== "undefined") { /// If language does not exist, if there is a config language defined, use that if possible, else default to default language
        language = (await import(basePath + '/i18n/' + conf.language + '.json', { assert: { type: "json" } })).default
        if (language[string] !== undefined) {
            return language[string]
        } else if (defaultlanguage[string] !== undefined) {
            return defaultlanguage[string]
        } else return null
    } else if (existsSync(join(__dirname, '..', 'src', 'configs', 'confinterim.json'))) { // Failing that, confinterim will do
        let conf = (await import('./configs/confinterim.json', { assert: { type: "json" } })).default
        language = (await import(basePath + '/i18n/' + conf.language + '.json', { assert: { type: "json" } })).default
        if (language[string] !== undefined) {
            return language[string]
        } else if (defaultlanguage[string] !== undefined) {
            return defaultlanguage[string]
        } else return null
    } else if (defaultlanguage[string] !== undefined) { // If the string doesn't exist but the string in the default language exists, return that
        return defaultlanguage[string]
    } else return null; // Else, null
}

export default translate;