/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: checkConfExists.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: This file may look janky but is definitely getting an extensive rewrite, along with many others! <- ANB

const fs = require('fs');
const path = require('path');
const checkMySQL = require('./checkMySQL')
const checkDiscord = require('./checkDiscord')
const checkRedis = require('./checkRedis')
const settings = require('../configs/uniconf.json').settings
let conffile

async function checkConf(conffilename) {
    if (!conffilename) { // Many of the functions that call this will not specify this argument and as such each call will **ALWAYS** look exclusively for conf.json (so this is there for backwards compatibility)
        conffile = "conf"
    } else conffile = conffilename
    return new Promise(function (resolve, reject) { // Promise-based, return rejections/resolutions to handle
        if (fs.existsSync(path.join(__dirname, '..', 'configs', conffile + '.json'))) { // Does src/configs/conf.json exist? If yes, return true. Else, false
            const conf = require('../configs/' + conffile + '.json')
            for (let i = 0; i < settings.length; i++) {
                if (conf[settings[i][0]] == undefined) { // If necessary fields don't exist, return MISSING FIELDS
                    reject('MISSING_FIELDS')
                    break;
                    return; // Might be redundant (if it is then feel free to remove it but don't create a PR exclusively for that reason)
                }
            }
            checkMySQL(conf.hostname, conf.dbusername, conf.dbpassword, conf.database).then(result => { // If all is good, proceed to Discord
                if (result == 'OK') {
                    checkRedis(conf.redishostname, conf.redisusername, conf.redispassword, conf.redisdatabase).then(result => {
                        checkDiscord(conf.token).then(result => { // Check Discord
                            if (result == "ASSUME_CLIENT_SECRET_IS_CORRECT") {
                                resolve(true) // If all good, resolve with true
                            }
                        }).catch(err => {
                            log.temp("checkConfExists.js:45")
                            reject(err) // Else, reject with the error
                        })
                    }).catch(err => {
                        reject(err)
                    })
                }
            }).catch(err => {
                reject(err)
            }) // If other error, reject with the error
        }
        else {
            reject(false)
        }
    })
}

module.exports = checkConf;