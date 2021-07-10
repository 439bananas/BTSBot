const uniconf = require('../configs/uniconf.json')
const log = require('../core/logHandler')
const express = require('express')
const e = express()
const http = require('http')
const app = require('./serverListener') 
const { response } = require('./serverListener')
const server = http.createServer(app)

e.use(express.static('public'))
e.set('view engine', 'ejs')

server.listen(uniconf.port)
.once('error', function(err) {
    if (err.code == 'EADDRINUSE') {
        log.fatal(`Couldn't start the server on port ${uniconf.port}! Is there another application running on that port?`)
    }
})

setTimeout(function() {log.info(`Successfully started the ${uniconf.projname} server on port ${uniconf.port}!`)}, 250)