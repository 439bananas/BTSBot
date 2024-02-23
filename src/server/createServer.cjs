/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: createServer.cjs                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

getlang().then(lang => {
    log.info(translate(lang, "log_startingserver"))
})

const express = require('express')
const e = express()
const http = require('http')
const app = require('./serverListener.cjs')
const { response } = require('./serverListener.cjs')
const server = http.createServer(app)

e.use(express.static('public'))

getlang().then(lang => {
    server.listen(uniconf.port)
        .once('error', function (err) { // If port in use, crash
            if (err.code == 'EADDRINUSE') {
                log.fatal(translate(lang, 'log_EADDRINUSEpart1') + uniconf.port + translate(lang, 'log_EADDRINUSEpart2')) // Fatal function calls always end the process no matter what
            }
        })

    setTimeout(function () {
        log.info(translate(lang, 'log_successfullystartedserverpart1') + uniconf.projname + translate(lang, 'log_successfullystartedserverpart2') + uniconf.port + translate(lang, 'log_successfullystartedserverpart3'))
    }, 250) // A timeout is set so this doesn't get logged as the server's checking if the port is in use
})