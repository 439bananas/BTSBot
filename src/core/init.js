/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                  File: init.js                  //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const warnuser = require('./warnUserIfNoConf')
const checkconf = require('./checkConfExists')
const createServer = require('../server/createServer')
//const createBot = require('../bot/createBot')

const checkmysql = require('./checkMySQL')
/*checkmysql('192.168.1.181', 'btsbot', 'btsbot', 'btsbot').then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
})*/