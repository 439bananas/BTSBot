/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: getContactLink.cjs                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getContactLink = require('../../core/getContactLink.cjs');
const router = express.Router();

router.get('/', async (req, res, next) => { // Get the contact link
    res.status(200).json({ contactLink: await getContactLink() })
})

module.exports = router;