/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                 File: routes.js                 //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()

const submitMySQLRoutes = require('./api/submitMySQL')
const submitDiscordRoutes = require('./api/submitDiscord')
const versionRoutes = require('./api/version')

router.use('/submit-mysql', submitMySQLRoutes)
router.use('/submit-discord', submitDiscordRoutes)
router.use('/version', versionRoutes)

module.exports = router;