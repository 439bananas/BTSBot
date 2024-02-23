/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: version.cjs                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const pkg = require('../../../package.json')
const express = require('express');
const router = express.Router()

router.get('/', async (req, res, next) => { // Just the version :))
    res.status(200).json({
        version: pkg.version,
        iteration: pkg.iteration
    })
})

module.exports = router;