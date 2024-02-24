/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getLanguages.cjs                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getlang = require('../../core/getLanguageJSON.cjs');
const getUserLang = require('../../core/getUserLang');
const getLangFile = require('../views/components/getLanguageJSON.cjs');
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

router.get('/', async (req, res, next) => {
    res.json({ preferred: getLangFile(await getUserLang(req)), fallback: getLangFile(await getlang()), default: getLangFile(uniconf.defaultlanguage) }) // Endpoint gets all languages in one go
})

module.exports = router;