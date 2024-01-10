/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getConfPath.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => { // Gets the absolute path of the config
    res.status(200).json(path.join(__dirname, '..', 'configs')) // Only one directory ascent, since this will get compiled into /build/out.js, which is not in the src directory
})

module.exports = router;