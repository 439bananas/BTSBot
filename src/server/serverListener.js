/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//             File: serverListener.js             //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const checkconf = require('../core/checkConfExists')
const path = require('path')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const uniconf = require('../configs/uniconf.json')
const routes = require('./routes')
//const aaPages = require('./alwaysAvailablePages')
const setup = require('./checkConfOnRequest')
const resourcesRoutes = require('./resources')
const pkg = require('../../package.json')

if (pkg.mode == 'stable') {
    var faviconfilename = 'favicon.ico'
}
else if (pkg.mode == 'alpha') {
    var faviconfilename = 'faviconalpha.ico'
}
else if (pkg.mode == 'beta') {
    var faviconfilename = 'faviconbeta.ico'
}
else if (pkg.mode == 'active-development') {
    var faviconfilename = 'faviconad.ico'
}
else {
    var faviconfilename = 'favicon.ico'
}

app.use(favicon(path.join(__dirname, 'pages', 'resources', 'img', faviconfilename)))
app.use('/', setup) // If root directory is contacted, we'll check if conf.json exists before serving
app.use('/resources', resourcesRoutes) // Yeah let's get these resources
app.use('/api', routes) // All API endpoints then begin with "/api"

app.use(function (req, res, next) {
    checkconf().catch(err => {
        if (err) {  // If error in conf, don't show things like login etc that couldn't possibly exist
            res.status(404);
            res.render('../src/server/pages/404.ejs', {
                conf: false,
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord
            });
        } else {
            res.status(404);
            res.render('../src/server/pages/404.ejs', {
                conf: true,
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord
            });
        }
    })
});

module.exports = app;