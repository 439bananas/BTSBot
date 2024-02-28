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

import { existsSync, readdirSync } from 'fs'
import { basename, join } from 'path'
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let conf
let language

let languages = {}
let langsDir
if (basename(process.argv[1]) === "index.js") {
    langsDir = join(__dirname, "..", "i18n")
} else {
    langsDir = join(__dirname, "..", "src", "i18n")
}

let langsDirListing = readdirSync(langsDir) // Put each of the language files into an object at the start of runtime, improve performance

langsDirListing.map(file => {
    let fileName = file.split('.')
    if (fileName[fileName.length - 1] == "json") {
        import(pathToFileURL(join(langsDir, file)), { assert: { type: "json" } }).then(mod => {
            if (mod.default.name) {
                languages[file.split(".")[0]] = mod.default
            }
        })
    }
})

function translate(languagecode, string) { // This function allows the caller to get a translated string
    let defaultlanguage = languages[uniconf.defaultlanguage]
    if (languages[languagecode]) { // If the specified language file exists, check if the string requested exists
        language = languages[languagecode]
    } else if (typeof (conf) != "undefined" && languages[conf.language]) { // Else if the default language has the string, return that, elsse return null
        language = languages[conf.language]
    } else {
        language = defaultlanguage
    }
    if (language && language[string] !== undefined) { // If it exists, return the string
        return language[string]
    } else if (typeof (conf) !== "undefined" && typeof (conf.language) !== "undefined") { /// If language does not exist, if there is a config language defined, use that if possible, else default to default language
        language = languages[conf.language]
        if (language && language[string] !== undefined) {
            return language[string]
        } else if (defaultlanguage && defaultlanguage[string] !== undefined) {
            return defaultlanguage[string]
        } else return null
    } else if (existsSync(join(__dirname, '..', 'src', 'configs', 'confinterim.json'))) { // Failing that, confinterim will do
        let returnedValue
        import('./configs/confinterim.json', { assert: { type: "json" } }).then(mod => {
            let conf = mod.default
            language = languages[conf.language]
            if (language && language[string] !== undefined) {
                returnedValue = language[string]
            } else if (defaultlanguage && defaultlanguage[string] !== undefined) {
                returnedValue = defaultlanguage[string]
            } else returnedValue = null
        })

        return returnedValue
    } else if (defaultlanguage && defaultlanguage[string] !== undefined) { // If the string doesn't exist but the string in the default language exists, return that
        return defaultlanguage[string]
    } else return null; // Else, null
}

export default translate;