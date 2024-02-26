/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: createServer.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

getlang().then(async lang => {
    log.info(await translate(lang, "log_startingserver"))
})

import express from 'express'
const e = express()
import { createServer } from 'http'
import app from './serverListener'
//import { response } from './serverListener'
const server = createServer(app)

e.use(express.static('public'))

getlang().then(lang => {
    server.listen(uniconf.port)
        .once('error', async function (err) { // If port in use, crash
            if (err.code == 'EADDRINUSE') {
                log.fatal(await translate(lang, 'log_EADDRINUSEpart1') + uniconf.port + await translate(lang, 'log_EADDRINUSEpart2')) // Fatal function calls always end the process no matter what
            }
        })

    setTimeout(async function () {
        log.info(await translate(lang, 'log_successfullystartedserverpart1') + uniconf.projname + await translate(lang, 'log_successfullystartedserverpart2') + uniconf.port + await translate(lang, 'log_successfullystartedserverpart3'))
    }, 250) // A timeout is set so this doesn't get logged as the server's checking if the port is in use
})