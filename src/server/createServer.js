/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//              File: createServer.js              //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('../core/logHandler')
log.info(`Attempting to start server...`)

const uniconf = require('../configs/uniconf.json')
const express = require('express')
const e = express()

const svrmgr = require('./serverManagerFunctions')

e.use(express.static('public'))
e.set('view engine', 'ejs')

svrmgr.createServer()

setTimeout(function () {
    log.info(`Successfully started the ${uniconf.projname} server on port ${uniconf.port}!`)
}, 250) // A timeout is set so this doesn't get logged as the server's checking if the port is in use