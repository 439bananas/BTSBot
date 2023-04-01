/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getConfPath.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.status(200).json(path.join(__dirname, '..', 'configs'))
})

module.exports = router;