/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//         File: serverManagerFunctions.js         //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const log = require('../core/logHandler')
const uniconf = require('../configs/uniconf.json')
const express = require('express')
const e = express()
const http = require('http')
const app = require('./serverListener')
const { response } = require('./serverListener')
const server = http.createServer(app)

function createServer() {
    server.listen(uniconf.port)
        .once('error', function (err) { // If port in use, crash
            if (err.code == 'EADDRINUSE') {
                log.fatal(`Couldn't start the server on port ${uniconf.port}! Is there another application running on that port?`) // Fatal function calls always end the process no matter what
            }
        })
}

function closeServer() {
    server.close()
}

module.exports = { createServer, closeServer };