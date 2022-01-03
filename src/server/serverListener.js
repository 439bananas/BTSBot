/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//             File: serverListener.js             //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
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
const log = require('../core/logHandler') // TEMP
const setup = require('./checkConfOnRequest')
const resourcesRoutes = require('./resources')
const pkg = require('../../package.json')
const getlang = require('../core/getLanguageJSON')
const translate = require('../core/getLanguageString')

if (pkg.mode == 'alpha') {
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

app.use(async function (req, res, next) {
    getlang(true).then(lang => {
        checkconf().catch(err => {
            if (err) {  // If error in conf, don't show things like login etc that couldn't possibly exist
                res.status(404);
                res.render('../src/server/pages/404.ejs', {
                    projname: uniconf.projname,
                    wikiurl: "https://wiki." + uniconf.metadomain,
                    discord: uniconf.discord,
                    i18npagetitle: translate(lang, 'page_404pagetitle'),
                    i18ntitle: translate(lang, 'page_404errortitle'),
                    i18ndescription: translate(lang, 'page_404errordescription'),
                    i18ngithub: translate(lang, 'page_globalgithub'),
                    i18ngdescription: translate(lang, 'page_globaldescription'),
                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                    conf: false,
                    metadomain: uniconf.metadomain,
                    metaurl: "https://" + uniconf.metadomain
                });
            } else {
                res.status(404);
                res.render('../src/server/pages/404.ejs', {
                    projname: uniconf.projname,
                    wikiurl: "https://wiki." + uniconf.metadomain,
                    discord: uniconf.discord,
                    i18npagetitle: translate(lang, 'page_404pagetitle'),
                    i18ntitle: translate(lang, 'page_404errortitle'),
                    i18ndescription: translate(lang, 'page_404errordescription'),
                    i18ngithub: translate(lang, 'page_globalgithub'),
                    i18ngdescription: translate(lang, 'page_globaldescription'),
                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                    conf: true,
                    metadomain: uniconf.metadomain,
                    metaurl: "https://" + uniconf.metadomain
                });
            }
        })
    })
});

module.exports = app;