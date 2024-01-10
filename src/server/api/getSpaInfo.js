/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: getSpaInfo.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getid = require('../../core/getApplicationId');
const getContactLink = require('../../core/getContactLink');
const getlang = require('../../core/getLanguageJSON');
const getaddress = require('../../core/getReqAddress');
const getUserLang = require('../../core/getUserLang');
const isMod = require('../../core/getUserModStatus');
const validateConf = require('../validateConf');
const getLangFile = require('../views/components/getLanguageJSON');
const router = express.Router();

router.get('/', async (req, res, next) => { // Get all information required by the SPA
    let re = await validateConf(req)

    if (re.confExists) {
        res.status(200).json({
            re: re,
            uniconf: uniconf,
            lang: {
                preferred: getLangFile(await getUserLang(req)),
                fallback: getLangFile(await getlang()),
                default: getLangFile(uniconf.defaultlanguage)
            },
            user: req.user,
            userIsMod: await isMod(req.user.id),
            contactLink: await getContactLink(),
            address: getaddress(req),
            clientid: await getid(conf.token)
        })
    } else {
        res.status(200).json({
            re: re,
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