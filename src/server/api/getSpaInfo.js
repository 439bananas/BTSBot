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

import { Router } from 'express';
import getid from '../../core/getApplicationId.cjs';
import getContactLink from '../../core/getContactLink.cjs';
import getlang from '../../core/getLanguageJSON.cjs';
import getaddress from '../../core/getReqAddress.cjs';
import getUserLang from '../../core/getUserLang';
import isMod from '../../core/getUserModStatus.cjs';
import validateConf from '../validateConf.cjs';
import getLangFile from '../views/components/getLanguageJSON.cjs';
const router = Router();

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

export default router;