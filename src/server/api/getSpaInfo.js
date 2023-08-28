/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: getSpaInfo.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getContactLink = require('../../core/getContactLink');
const getlang = require('../../core/getLanguageJSON');
const getUserLang = require('../../core/getUserLang');
const isMod = require('../../core/getUserModStatus');
const getLangFile = require('../views/components/getLanguageJSON');
const router = express.Router();

router.get('/', async (req, res, next) => { // Get all information required by the SPA
    if (req.confExists) {
        res.status(200).json({
            uniconf: uniconf,
            lang: {
                preferred: getLangFile(await getUserLang(req)),
                fallback: getLangFile(await getlang()),
                default: getLangFile(uniconf.defaultlanguage)
            },
            user: req.user,
            userIsMod: await isMod(req.user.id),
            contactLink: await getContactLink()
        })
    } else {
        res.status(200).json({
            uniconf: uniconf,
            lang: {
                preferred: getLangFile(await getUserLang(req)),
                fallback: getLangFile(await getlang()),
                default: getLangFile(uniconf.defaultlanguage)
            }
        })
    }
})

module.exports = router;