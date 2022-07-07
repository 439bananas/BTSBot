/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: serverListener.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('../core/checkConfExists')
const path = require('path')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const routes = require('./routes')
//const aaPages = require('./alwaysAvailablePages')
const frontpage = require('./frontPage')
const confpage = require('./confPage')
const resourcesRoutes = require('./resources')
const pkg = require('../../package.json')
const cookieParser = require('cookie-parser')
const show404 = require('./display404')

switch (pkg.mode) {
    case 'alpha':
        var faviconfilename = 'faviconalpha.ico'
        break;
    case 'beta':
        var faviconfilename = 'faviconbeta.ico'
        break;
    case 'active-development':
        var faviconfilename = 'faviconad.ico'
        break;
    case 'ad':
        var faviconfilename = 'faviconad.ico'
        break;
    default:
        var faviconfilename = 'favicon.ico'
        break;
}

app.use(cookieParser()) // Deal with cookies

app.all('/*', function (req, res, next) {
    getlang().then(lang => {
        if (req.headers['x-forwarded-host']) {
            log.info(req.method + translate(lang, 'log_incominghttprequestpart1') + req.headers['x-forwarded-for'] + translate(lang, 'log_incominghttprequestpart2') + req.headers['x-forwarded-host'] + translate(lang, 'log_incominghttprequestpart3') + req.url + translate(lang, 'log_incominghttprequestrp'))
        } else {
            log.info(req.method + translate(lang, 'log_incominghttprequestpart1') + req.socket.remoteAddress + translate(lang, 'log_incominghttprequestpart2') + req.headers.host + translate(lang, 'log_incominghttprequestpart3') + req.url)
        }
        next();
    })
});

app.use(favicon(path.join(__dirname, 'pages', 'resources', 'img', faviconfilename)))
app.use('/', frontpage) // If root directory is contacted, we'll check if conf.json exists before serving
app.use('/config', confpage) // Fun fact, I forgot to call this file, and wondered why I was getting 404s on /config
app.use('/resources', resourcesRoutes) // Yeah let's get these resources
app.use('/api', routes) // All API endpoints then begin with "/api"

app.use(function (req, res, next) {
    getlang(true).then(lang => {
        checkConf().then(result => {
            show404(res, lang, true)
        }).catch(err => { // If error in conf, don't show things like login etc that couldn't possibly exist
            show404(res, lang, false)
        })
    })
});

module.exports = app;