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
const confRoutes = require('./api/getConf');
const getOAuth2Routes = require('./api/getOAuth2Status');
const configPasswordRoutes = require('./api/configPassword');
const getConfValuesRoutes = require('./api/getConfValues');
const getLanguagesRoutes = require('./api/getAllLanguages');
const getUserRoutes = require('./api/getUser');

router.use('/submit-config', submitConfigRoutes)
router.use('/version', versionRoutes)
router.use('/uniconf', uniconfRoutes)
router.use('/language', getLangRoutes)
router.use('/ready', readyRoutes)
router.use('/conf-path', confPathRoutes)
router.use('/conf', confRoutes)
router.use('/oauth2-status', getOAuth2Routes)
router.use('/config-password', configPasswordRoutes)
router.use('/conf-values', getConfValuesRoutes)
router.use('/languages', getLanguagesRoutes)
router.use('/user', getUserRoutes)

module.exports = router;