/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getI18nFiles.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { readdir } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
let conffile
let langfile

function geti18n() { // This is a function so everyone can use it!
    return new Promise(function (resolve, reject) {
        let langs = []
        readdir(join(__dirname, '..', 'src', 'i18n'), function (err, langfiles) { // Get all of the files in the i18n directory
            if (err) { // If there's an error like ENOENT only display English
                log.error('There was an error looking through the internationalisation configuration files, using English as a default language')
                reject(err)
                langs = ['en-gb', 'English'] // English should exist at least
                resolve(langs) // Return languages
            }

            let langCount = 0
            langfiles.forEach(async function (json) { // For every i18n file, check if it's a JSON file
                if (extname(json) == '.json') {
                    langfile = (await import(pathToFileURL(join(__dirname, '..', 'src', 'i18n', json)), { assert: { type: "json" } })).default
                    if (langfile.name !== undefined) { // Ignore undefined language names
                        langs.push([basename(json, '.json'), langfile.name]) // Add to the array of languages
                    }
                }
                if (langCount++ == langs.length) {
                    resolve(langs) // Return languages
                }
            })
        })
    })
}

export default geti18n;