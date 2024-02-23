/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getAllLanguages.cjs                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const geti18n = require('../../core/getI18nFiles.cjs');
const router = express.Router();

router.get('/', async (req, res, next) => { // Return any and all available languages to the user
    res.json({ languages: await geti18n() })
})

module.exports = router;