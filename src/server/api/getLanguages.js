/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getLanguages.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getlang = require('../../core/getLanguageJSON');
const getUserLang = require('../../core/getUserLang');
const getLangFile = require('../views/components/getLanguageJSON');
const router = express.Router();

router.get('/preferred', async (req, res, next) => { // Each API returns the entire language file for the user, preferred gets the user's preferred language
    res.json(getLangFile(await getUserLang(req)))
});

router.get('/fallback', async (req, res, next) => { // Fallback gets the configured language (if there is no config, then it will be what is in uniconf)
    res.json(getLangFile(await getlang()))
});

router.get('/default', (req, res, next) => {
    res.json(getLangFile(uniconf.defaultlanguage)) // Failing that, default gets the language as dictated in uniconf
})

module.exports = router;