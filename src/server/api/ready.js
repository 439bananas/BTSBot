/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: ready.js                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const validateConf = require('../validateConf');
const router = express.Router()
let returnedJSON

router.get('/', async (req, res, next) => { // Fun fact: The project that this was based on, FLMS, originally had this file, but it was scrapped in BTS Bot since it was not deemed necessary. I guess it's back now
    let re = await validateConf(req)

    if (req.confExists) { // Does the config exist? If yes, return true. Else, return the error and false.
        returnedJSON = { confExists: re.confExists }
    } else {
        returnedJSON = { confExists: re.confExists, confErr: re.confErr }
    }
    res.status(200).json(returnedJSON)
})

module.exports = router;