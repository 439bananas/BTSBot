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
const http = require('http')
const app = require('./serverListener')
const { response } = require('./serverListener')
const server = http.createServer(app)

e.use(express.static('public'))
e.set('view engine', 'ejs')

server.listen(uniconf.port)
    .once('error', function (err) { // If port in use, crash
        if (err.code == 'EADDRINUSE') {
            log.fatal(`Couldn't start the server on port ${uniconf.port}! Is there another application running on that port?`) // Fatal function calls always end the process no matter what
        }
    })

setTimeout(function () {
    log.info(`Successfully started the ${uniconf.projname} server on port ${uniconf.port}!`)
}, 250) // A timeout is set so this doesn't get logged as the server's checking if the port is in use