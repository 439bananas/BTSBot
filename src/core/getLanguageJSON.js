/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getLanguageJSON.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { existsSync, readdirSync } from 'fs'
import { dirname, basename, join } from 'path'
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

function getlang(noext, userid) { // Gets the configured language (noext is an argument that lets the function know whether to send the file extension too)
    let ext
    if (noext === true || noext === undefined) {
        ext = ''
    } else ext = '.json'

    async function getFile(resolve, reject, conf) {
        if (conf.language !== undefined) {
            if (languages[conf.language]) { // Check if the language in conf.json exists as a json fine
                let lang = (languages[conf.language])
                if (lang.name !== undefined) { // Check if the language name exists
                    resolve(conf.language + ext) // If all are true, send back the language JSON file name
                } else {
                    resolve(uniconf.defaultlanguage + ext) // Else, return the default language
                }
            } else {
                resolve(uniconf.defaultlanguage + ext) // If the language in conf.json doesn't exist, return the default
            }
        } else {
            resolve(uniconf.defaultlanguage + ext) // If language is undefined, return default. This should be the only configuration file that has the language
        }
    }

    return new Promise(async function (resolve, reject) {
        if (userid == undefined) {
            if (typeof (pkg) != "undefined") { // pkg is global in server.mjs but not index.js (different process) so checking if it exists means that it's possible to see differentiate what process this is
                if (typeof(conf) != "undefined") { // conf.json is preferred, so follow the process if conf.json exists:
                    getFile(resolve, reject, conf)
                } else if (existsSync(join(__dirname, '..', 'configs', 'confinterim.json'))) { // Ditto but check if the MySQL configuration (limbo) has the setting
                    conf = (await import('../../configs/confinterim.json', { assert: { type: "json" } })).default
                    getFile(resolve, reject, conf)
                } else {
                    resolve(uniconf.defaultlanguage + ext) // If neither configuration file exists, return default
                }
            } else {
                if (existsSync(join(__dirname, '..', 'configs', 'conf.json'))) { // conf.json is preferred, so follow the process if conf.json exists:
                    conf = (await import(pathToFileURL("./configs/conf.json"), { assert: { type: "json" } })).default
                    getFile(resolve, reject, conf)
                } else if (existsSync(join(__dirname, '..', '..', 'configs', 'confinterim.json'))) { // Ditto but check if the MySQL configuration (limbo) has the setting
                    conf = (await import(pathToFileURL('./configs/confinterim.json'), { assert: { type: "json" } })).default
                    getFile(resolve, reject, conf)
                } else {
                    resolve(uniconf.defaultlanguage + ext) // If neither configuration file exists, return default
                }
            }

        } else { // If user ID is present then grab from database
            let query = MySQLConnection.query('SELECT language FROM User WHERE id=?', userid) // Attempt to query the database
            if (query[0] == undefined) { // If not in the database, return configured lang
                resolve(getlang()) // This is probably janky but better than writing the entire thing again
            } else {
                return query[0][0].language // Else return user's language
            }
        }
    })
}
export default getlang;