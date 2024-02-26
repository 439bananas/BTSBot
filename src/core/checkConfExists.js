/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: checkConfExists.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: This file may look janky but is definitely getting an extensive rewrite, along with many others! <- ANB

import { existsSync } from 'fs';
import { join } from 'path';
import checkMySQL from './checkMySQL';
import checkDiscord from './checkDiscord';
import checkRedis from './checkRedis';
import { settings } from '../configs/uniconf.json';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let conffile

/**
 * Checks if the configuration (or a specified configuration) exists
 * @param {boolean} [conffilename="conf"] - The name of the file
 * @returns {boolean|string} The error, if the configuation has an issue, or else true
 */
async function checkConf(conffilename) {
    if (!conffilename) { // Many of the functions that call this will not specify this argument and as such each call will **ALWAYS** look exclusively for conf.json (so this is there for backwards compatibility)
        conffile = "conf"
    } else conffile = conffilename
    if (existsSync(join(__dirname, '..', 'configs', conffile + '.json'))) { // Does src/configs/conf.json exist? If yes, return true. Else, false
        const conf = (await import('../configs/' + conffile + '.json', { assert: { type: "json" } })).default
        for (let i = 0; i < settings.length; i++) {
            if (conf[settings[i][0]] == undefined) { // If necessary fields don't exist, return MISSING FIELDS
                throw 'MISSING_FIELDS'
            }
        }

        try {
            let MySQLResult = await checkMySQL(conf.hostname, conf.dbusername, conf.dbpassword, conf.database, conf.port) // If all is good, proceed to Discord
            if (MySQLResult == 'OK') {
                let RedisResult = await checkRedis(conf.redishostname, conf.redisusername, conf.redispassword, conf.redisdatabase)
                void RedisResult
                let DiscordResult = await checkDiscord(conf.token) // Check Discord
                if (DiscordResult == "ASSUME_CLIENT_SECRET_IS_CORRECT") {
                    return true // If all good, resolve with true
                }
            }
        }
        catch (err) {
            throw err
        } // If other error, reject with the error
    }
    else {
        throw false
    }
}

export default checkConf;