/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: ready.js                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router()
let returnedJSON

router.get('/', async (req, res, next) => {
    if (req.confExists) {
        returnedJSON = { confExists: req.confExists }
    } else {
        returnedJSON = { confExists: req.confExists, confErr: req.confErr }
    }
    res.status(200).json(returnedJSON)
})

module.exports = router;