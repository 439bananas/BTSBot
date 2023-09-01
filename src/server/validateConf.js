/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: validateConf.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('../core/checkConfExists')

async function validateConf(req) { // Let's see if confExists is actually accurate now...
    async function checkConfExists() {
        try {
            let validateExistenceConf = await checkConf()
            return { confExists: validateExistenceConf }
        } catch (err) {
            return { confErr: err, confExists: false }
        }
    }

    let confInfo = await checkConfExists()
    let { confExists, confErr } = confInfo

    if ((typeof (redisConnection) === 'undefined' || typeof (MySQLConnection) === 'undefined') && confExists === true) { // Database can be accessed after downtime during initialisation of project
        global.conf = require('../../configs/conf.json')
        require('../database/databaseManager')
    }

    return confInfo
}

module.exports = validateConf