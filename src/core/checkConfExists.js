/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: checkConfExists.js             //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const checkmysql = require('./checkMySQL')

async function checkforconf() {
    return new Promise(function (resolve, reject) { // Promise-based, return rejections/resolutions to handle
        if (fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) { // Does src/configs/conf.json exist? If yes, return true. Else, false
            const conf = require('../configs/conf.json')
            if (conf.hostname == undefined || conf.username == undefined || conf.password == undefined || conf.db == undefined || conf.tableprefix == undefined) { // If necessary fields don't exist, return MISSING FIELDS
                reject('MISSING_FIELDS')
                return;
            }
            checkmysql(conf.hostname, conf.username, conf.password, conf.db).then(result => { // If all is good, proceed to Discord
                if (result == 'OK') {
                    resolve(true)
                }
            }).catch(err => { reject(err) }) // If other error, reject with the error
        }
        else {
            reject(false)
        }
    })
}

module.exports = checkforconf;