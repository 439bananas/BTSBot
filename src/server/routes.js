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

// WE NEED A VERSION ROUTE!!!!!
//const readyRoutes = require('./api/ready')
const submitMySQLRoutes = require('./api/submitMySQL')

router.use('/submit-mysql', submitMySQLRoutes)

module.exports = router;