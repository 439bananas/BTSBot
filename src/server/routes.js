/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                 File: routes.js                 //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()

const submitMySQLRoutes = require('./api/submitMySQL')
const versionRoutes = require('./api/version')

router.use('/submit-mysql', submitMySQLRoutes)
router.use('/version', versionRoutes)

module.exports = router;