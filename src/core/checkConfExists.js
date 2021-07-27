/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//            File: checkConfExists.js             //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const checkmysql = require('./checkMySQL')

async function checkforconf() {
    if (fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) { // Does src/configs/conf.json exist? If yes, return true. Else, false
        const conf = require('../configs/conf.json')
        checkmysql(conf.hostname, conf.username, conf.password, conf.db).then(result => {
            if (conf.hostname == undefined || conf.username == undefined || conf.password == undefined || conf.db == undefined) {
                return 'MISSING_FIELDS';
            }
            if (result == 'OK') {
                return true;
            }
        }).catch(err => {return err;})

    }
    else {
        return false;
    }
}

module.exports = checkforconf;