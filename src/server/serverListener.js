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

app.use(favicon(path.join(__dirname, 'pages', 'resources', 'favicon.ico')))
app.use('/', setup)
app.use('/resources', resourcesRoutes)
app.use('/api', routes)

module.exports = app;