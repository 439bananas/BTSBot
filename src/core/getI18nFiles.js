/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getI18nFiles.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fs = require('fs')
const path = require('path')
let langfile

function geti18n() { // This is a function so everyone can use it!
    return new Promise(function (resolve, reject) {
        global.langs = []
        fs.readdir(path.join(__dirname, '..', 'src', 'i18n'), function (err, langfiles) { // Get all of the files in the i18n directory
            if (err) { // If there's an error like ENOENT only display English
                log.error('There was an error looking through the internationalisation configuration files, using English as a default language')
                reject(err)
                global.langs = ['en-gb', 'English'] // English should exist at least
            }
            langfiles.forEach(function (json) { // For every i18n file, check if it's a JSON file
                if (path.extname(json) == '.json') {
                    log.temp("base name " + path.basename(json, '.json'))
                    log.temp(json)
                    langfile = require(path.join(__dirname, '..', 'src', 'i18n', json))
                    if (langfile.name !== undefined) { // Ignore undefined language names
                        langs.push([path.basename(json, '.json'), langfile.name]) // Add to the array of languages
                    }
                }
            })
            resolve(langs) // Return languages
        })
    })
}

module.exports = geti18n;