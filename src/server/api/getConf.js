/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: getConf.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    if (req.confExists) {
        res.json({})
    } else {
        if (req.confErr == "ACCESS_DENIED") {
            res.json({ database: conf.database, dbusername: conf.dbusername, hostname: conf.hostname })
        } else {
            res.json({})
        }
    }
})

module.exports = router;