/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: routes.cjs                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()

const submitConfigRoutes = require('./api/submitConfig.cjs')
const versionRoutes = require('./api/version.cjs')
const uniconfRoutes = require('./api/uniconf.cjs')
const getLangRoutes = require('./api/getLanguages.cjs')
const readyRoutes = require('./api/ready.cjs');
const confPathRoutes = require('./api/getConfPath.cjs');
const confRoutes = require('./api/getConf.cjs');
const getOAuth2Routes = require('./api/getOAuth2Status.cjs');
const configPasswordRoutes = require('./api/configPassword.cjs');
const getConfValuesRoutes = require('./api/getConfValues.cjs');
const getLanguagesRoutes = require('./api/getAllLanguages.cjs');
const getUserRoutes = require('./api/getUser.cjs');
const getContactLinkRoutes = require('./api/getContactLink.cjs');
const getSpaInfoRoutes = require('./api/getSpaInfo.cjs');
const getBotInGuildRoutes = require('./api/botInGuild.js').default;
const getDashboardRoutes = require('./api/getDashboard.js').default;
const getDashboardSchemaRoutes = require('./api/getDashboardSchema.cjs');

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
router.use('/contact-link', getContactLinkRoutes)
router.use('/page-info', getSpaInfoRoutes)
router.use('/guild-presence', getBotInGuildRoutes)
router.use('/dashboard', getDashboardRoutes)
router.use('/dashboard-schema', getDashboardSchemaRoutes)

module.exports = router;