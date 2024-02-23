/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: uniconf.cjs                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => { // This API returns the project's uniconf.
    res.status(200).json(uniconf)
})

module.exports = router;