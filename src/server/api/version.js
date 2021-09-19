/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                File: version.js                 //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const pkg = require('../../../package.json')
const express = require('express');
const router = express.Router()

router.get('/', (req, res, next) => { // WE NEED TO CHECK FOR ALL NECESSARY ARGS!!! IF NOT PRESENT, RETURN AN ERROR VIA THE API!!!!!
    res.status(200).json({
        version: pkg.version,
        iteration: pkg.iteration
    })
})

module.exports = router;