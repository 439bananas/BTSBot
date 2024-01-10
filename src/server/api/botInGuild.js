/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: botInGuild.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const botInGuild = require('../../core/checkBotInGuild');
const router = express.Router();
const jsonParser = express.json()

router.post('/*', jsonParser, async (req, res, next) => { // See if the bot is in a guild
    try {
        let url = req.url.split('/')
        if (url[1]) { // If guild ID, check singular guild ID
            let bypassCache = false
            if (req.body.bypassCache) {
                bypassCache = true
            }
            res.status(200).json({ botInGuild: await botInGuild(url[1], bypassCache) })
        } else {
            if (Array.isArray(req.body.guilds)) { // If body is array...
                let guildPresences = {}
                async function getGuildPresences() {
                    for (guild of req.body.guilds) { // For each item, check if bot is in the guild and add to object
                        guildPresences[guild] = await botInGuild(guild)
                    }

                    if (Object.keys(guildPresences).length == req.body.guilds.length) { // Only upon completion, return object
                        return guildPresences
                    }
                }

                res.status(200).json({ botInGuild: await getGuildPresences() }) // Send object to client
            } else {
                res.status(200).json({ botInGuild: await botInGuild(req.body.guilds) })
            }
        }
    } catch (err) {
        res.status(200).json({ botInGuild: false }) // Send object to client
    }
})

module.exports = router;