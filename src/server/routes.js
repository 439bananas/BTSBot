/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: routes.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express'
const router = Router()

import submitConfigRoutes from './api/submitConfig'
import versionRoutes from './api/version'
import uniconfRoutes from './api/uniconf.js'
import getLangRoutes from './api/getLanguages.js'
import readyRoutes from './api/ready.js'
import confPathRoutes from './api/getConfPath.js'
import confRoutes from './api/getConf.js'
import getOAuth2Routes from './api/getOAuth2Status.js'
import configPasswordRoutes from './api/configPassword'
import getConfValuesRoutes from './api/getConfValues.js'
import getLanguagesRoutes from './api/getAllLanguages.js'
import getUserRoutes from './api/getUser.js'
import getContactLinkRoutes from './api/getContactLink.js'
import getSpaInfoRoutes from './api/getSpaInfo'
import getBotInGuildRoutes from './api/botInGuild'
import getDashboardRoutes from './api/getDashboard'
import getDashboardSchemaRoutes from './api/getDashboardSchema'

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

export default router;