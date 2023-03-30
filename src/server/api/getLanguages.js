/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getLanguages.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getlang = require('../../core/getLanguageJSON');
const getUserLang = require('../../core/getUserLang');
const getLangFile = require('../views/components/getLanguageJSON');
const router = express.Router();

router.get('/preferred', async (req, res, next) => {
    res.json(getLangFile(await getUserLang(req)))
});

router.get('/fallback', async (req, res, next) => {
    res.json(getLangFile(await getlang()))
});

router.get('/default', (req, res, next) => {
    res.json(getLangFile(uniconf.defaultlanguage))
})

module.exports = router;