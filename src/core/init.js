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

const warnuser = require('./warnUserIfNoConf') // Check if conf.json exists and if not, send a warning to the console
const createServer = require('../server/createServer') // Start the dashboard
//const createBot = require('../bot/createBot') // Start the bot

/*const checkmysql = require('./checkMySQL')
checkmysql('192.168.1.181', 'btsbot', 'btsbot', 'btsbot').then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
})*/