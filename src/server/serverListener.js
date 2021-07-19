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

const path = require('path')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const uniconf = require('../configs/uniconf.json')
const routes = require('./routes')
//const aaPages = require('./alwaysAvailablePages')
const setup = require('./checkConfOnRequest')
const resourcesRoutes = require('./resources')

app.use(favicon(path.join(__dirname, 'pages', 'resources', 'img', 'favicon.ico')))
app.use('/', setup) // If root directory is contacted, we'll check if conf.json exists before serving
app.use('/resources', resourcesRoutes) // Yeah let's get these resources
app.use('/api', routes) // All API endpoints then begin with "/api"

module.exports = app;