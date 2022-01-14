/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: getLanguageJSON.js             //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const fs = require('fs')
const path = require('path')
const log = require('./logHandler')
const uniconf = require('../configs/uniconf.json')

function getlang(noext) { // Gets the configured language (noext is an argument that lets the function know whether to send the file extension too)
    if (noext === true || noext === undefined) {
        var ext = ''
    } else var ext = '.json'
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) { // conf.json is preferred, so follow the process if conf.json existsL
            var conf = require('../configs/conf.json')
            if (conf.language !== undefined) {
                if (fs.existsSync(path.join(__dirname, '..', '..', 'i18n', conf.language + '.json'))) { // Check if the language in conf.json exists as a json fine
                    const lang = require('../../i18n/' + conf.language + '.json')
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
        } else if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Ditto but check if the MySQL configuration (limbo) has the setting
            var conf = require('../configs/mysqlconfinterim.json')
            if (conf.language !== undefined) {
                if (fs.existsSync(path.join(__dirname, '..', '..', 'i18n', conf.language + '.json'))) {
                    const lang = require('../../i18n/' + conf.language + '.json')
                    if (lang.name !== undefined) {
                        resolve(conf.language + ext)
                    } else {
                        resolve(uniconf.defaultlanguage + ext)
                    }
                } else {
                    resolve(uniconf.defaultlanguage + ext)
                }
            } else {
                resolve(uniconf.defaultlanguage + ext)
            }
        } else {
            resolve(uniconf.defaultlanguage + ext) // If neither configuration file exists, return default
        }
    })
}

module.exports = getlang;