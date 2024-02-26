/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: version.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { version as _version, iteration as _iteration } from '../../../package.json';
import { Router } from 'express';
const router = Router()

router.get('/', async (req, res, next) => { // Just the version :))
    res.status(200).json({
        version: _version,
        iteration: _iteration
    })
})

export default router;