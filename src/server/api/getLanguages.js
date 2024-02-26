/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getLanguages.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express';
import getlang from '../../core/getLanguageJSON';
import getUserLang from '../../core/getUserLang';
import getLangFile from '../views/components/getLanguageJSON.js';
const router = Router();

router.get('/preferred', async (req, res, next) => { // Each API returns the entire language file for the user, preferred gets the user's preferred language
    res.json(await getLangFile(await getUserLang(req)))
});

router.get('/fallback', async (req, res, next) => { // Fallback gets the configured language (if there is no config, then it will be what is in uniconf)
    res.json(await getLangFile(await getlang()))
});

router.get('/default', async (req, res, next) => {
    res.json(await getLangFile(uniconf.defaultlanguage)) // Failing that, default gets the language as dictated in uniconf
})

router.get('/', async (req, res, next) => {
    res.json({ preferred: await getLangFile(await getUserLang(req)), fallback: await getLangFile(await getlang()), default: await getLangFile(uniconf.defaultlanguage) }) // Endpoint gets all languages in one go
})

export default router;