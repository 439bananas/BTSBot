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
const isMod = require('../../core/getUserModStatus');
const router = express.Router();

router.get('/', async (req, res, next) => { // Get the current user's information
    let json
    try {
        let user = req.user
        json = { user: user, userIsMod: await isMod(user.id) }
    } catch (err) {
        json = {}
    }
    res.status(200).json(json)
})

module.exports = router;