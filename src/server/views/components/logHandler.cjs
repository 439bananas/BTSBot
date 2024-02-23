/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: logHandler.cjs                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const translate = require('./getLanguageString.cjs');
let lang

async function getlang() {
        let preferredRawResponse = await fetch('/api/language/preferred')
        preferred = preferredRawResponse.json()
        let fallbackRawResponse = await fetch('/api/language/fallback')
        fallback = fallbackRawResponse.json()
        let defaultRawResponse = await fetch('/api/language/default')
        defaultlang = defaultRawResponse.json()
        lang = { preferred: preferred, fallback: fallback, default: defaultlang }
    return lang
}

async function info(message, lang) { // Log depending on function called
    if (!lang) {
        let lang = await getlang()
        console.info(new Date() + " - " + translate(lang, 'loghandler_info') + ": " + message)
    } else {
        console.info(new Date() + " - " + translate(lang, 'loghandler_info') + ": " + message)
    }
}

async function warn(message, lang) {
    if (!lang) {
        let lang = await getlang()
        console.warn(new Date() + " - " + translate(lang, 'loghandler_warn') + ": " + message)
    } else {
        console.warn(new Date() + " - " + translate(lang, 'loghandler_warn') + ": " + message)
    }
}

async function error(message, lang) {
    if (!lang) {
        let lang = await getlang()
        console.error(new Date() + " - " + translate(lang, 'loghandler_error') + ": " + message)
    } else {
        console.error(new Date() + " - " + translate(lang, 'loghandler_error') + ": " + message)
    }
}

async function err(message, lang) { // Quick alias for error because I'm an idiot
    error(message, lang)
}

async function temp(message, lang) {  // This is used for assertions and logging information to ensure a function works as intended. Each assertion should NOT end up in final releases
    if (!lang) {
        let lang = await getlang()
        console.log(new Date() + " - " + translate(lang, 'loghandler_temp') + ": " + message)
    } else {
        console.log(new Date() + " - " + translate(lang, 'loghandler_temp') + ": " + message)
    }
}

async function tempinfo(message, lang) { // Tells the user information they may need to know (ie x warning is safe to ignore), where the logging will be removed after the problem is fixed
    if (!lang) {
        let lang = await getlang()
        console.log(new Date() + " - " + translate(lang, 'loghandler_tempinfo') + ": " + message)
    } else {
        console.log(new Date() + " - " + translate(lang, 'loghandler_tempinfo') + ": " + message)
    }
}

module.exports = { info, warn, error, err, temp, tempinfo };