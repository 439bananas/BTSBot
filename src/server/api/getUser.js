/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: getUser.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getDiscordUser = require('../../core/getDiscordUserInfo');
const router = express.Router();

router.get('/', async (req, res, next) => { // This API returns the project's uniconf.
    let json
    try {
        json = await getDiscordUser(req.cookies.discordbearertoken)
    } catch (err) {
        json = {}
    }
    res.status(200).json(json)
})

module.exports = router;