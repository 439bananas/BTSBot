/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: getConf.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express';
import validateConf from '../validateConf';
const router = Router();

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

export default router;