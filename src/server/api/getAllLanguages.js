/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getAllLanguages.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express';
import geti18n from '../../core/getI18nFiles';
const router = Router();

router.get('/', async (req, res, next) => { // Return any and all available languages to the user
    res.json({ languages: await geti18n() })
})

export default router;