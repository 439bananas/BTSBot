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
import getid from '../../core/getApplicationId.js';
import getContactLink from '../../core/getContactLink.js';
import getlang from '../../core/getLanguageJSON';
import getaddress from '../../core/getReqAddress.cjs';
import getUserLang from '../../core/getUserLang';
import isMod from '../../core/getUserModStatus.cjs';
import validateConf from '../validateConf.js';
import getLangFile from '../views/components/getLanguageJSON.js';
const router = Router();

router.get('/', async (req, res, next) => { // Get all information required by the SPA
    let re = await validateConf(req)

    if (re.confExists) {
        res.status(200).json({
            re: re,
            uniconf: uniconf,
            lang: {
                preferred: await getLangFile(await getUserLang(req)),
                fallback: await getLangFile(await getlang()),
                default: await getLangFile(uniconf.defaultlanguage)
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
                preferred: await getLangFile(await getUserLang(req)),
                fallback: await getLangFile(await getlang()),
                default: await getLangFile(uniconf.defaultlanguage)
            }
        })
    }
})

export default router;