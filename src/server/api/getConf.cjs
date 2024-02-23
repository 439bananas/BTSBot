/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: getConf.cjs                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const validateConf = require('../validateConf.cjs');
const router = express.Router();

router.get('/', async (req, res, next) => {
    let re = await validateConf(req)

    if (re.confExists) {
        res.json({})
    } else {
        if (re.confErr == "ACCESS_DENIED") {
            res.json({ database: conf.database, dbusername: conf.dbusername, hostname: conf.hostname }) // Return the configuration so that the noconfintro shows the database, hostname and dbusername
        } else {
            res.json({})
        }
    }
})

module.exports = router;