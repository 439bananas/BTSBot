/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: createElements.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const warnuser = require('./warnUserIfNoConf') // Check if conf.json exists and if not, send a warning to the console
const createServer = require('../server/createServer') // Start the dashboard
//const createBot = require('../bot/createBot') // Start the bot

/*const checkMySQL = require('./checkMySQL')
checkMySQL('192.168.1.181', 'btsbot', 'btsbot', 'btsbot').then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
})*/

//const restart = require('./restartProcess')
//restart()