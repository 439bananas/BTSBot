/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: getUser.cjs                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const getGuilds = require('../../core/getUserGuilds.cjs');
const isMod = require('../../core/getUserModStatus.cjs');
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

router.get('/guilds', async (req, res, next) => { // Get the current user's accessible guilds
    let json
    try {
        json = { guilds: await getGuilds(req.cookies.discordbearertoken) }
    } catch (err) {
        json = {guilds: []}
    }
    res.status(200).json(json)
})

module.exports = router;