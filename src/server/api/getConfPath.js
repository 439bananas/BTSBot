/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: getConfPath.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { join } from 'path';
import { Router } from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

router.get('/', async (req, res, next) => { // Gets the absolute path of the config
    res.status(200).json(join(__dirname, '..', 'configs')) // Only one directory ascent, since this will get compiled into /build/out.js, which is not in the src directory
})

export default router;