/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getSpaInfo.cjs                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getid = require('../../core/getApplicationId.cjs');
const getContactLink = require('../../core/getContactLink.cjs');
const getlang = require('../../core/getLanguageJSON.cjs');
const getaddress = require('../../core/getReqAddress.cjs');
const getUserLang = require('../../core/getUserLang.cjs');
const isMod = require('../../core/getUserModStatus.cjs');
const validateConf = require('../validateConf.cjs');
const getLangFile = require('../views/components/getLanguageJSON.cjs');
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
            clientid: getid(conf.token)
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