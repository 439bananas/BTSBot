/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getContactLink.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express';
import getContactLink from '../../core/getContactLink.js';
const router = Router();

router.get('/', async (req, res, next) => { // Get the contact link
    res.status(200).json({ contactLink: await getContactLink() })
})

export default router;