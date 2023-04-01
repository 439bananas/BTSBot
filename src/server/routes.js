/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: routes.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()

const submitConfigRoutes = require('./api/submitConfig')
const versionRoutes = require('./api/version')
const uniconfRoutes = require('./api/uniconf')
const getLangRoutes = require('./api/getLanguages')
const readyRoutes = require('./api/ready');
const confPathRoutes = require('./api/getConfPath');

router.use('/submit-config', submitConfigRoutes)
router.use('/version', versionRoutes)
router.use('/uniconf', uniconfRoutes)
router.use('/language', getLangRoutes)
router.use('/ready', readyRoutes)
router.use('/conf-path', confPathRoutes)

module.exports = router;