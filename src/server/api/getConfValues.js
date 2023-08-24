/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: validateConfToken.js                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const crypto = require('crypto')
const express = require('express');
const router = express.Router();
const fs = require('fs');
const range = (start, end, length = end - start) =>
    Array.from({ length }, (_, i) => start + i)

router.get('/', async (req, res, next) => { // Get the configuration to show to the user
    if (!fs.existsSync(path.join(__dirname, '..', 'configs', 'logintokens.json')) || !req.cookies.configtoken) { // If no login tokens, then obviously configuration token is not valid
        res.json({ error: "TOKEN_INVALID" })
    } else {
        let tokensFile = (fs.readFileSync(path.join(__dirname, '..', 'configs', 'logintokens.json'), "utf8", function (err) { // Read, don't require, so that login tokens are updated live
            if (err) {
                throw err;
            }
        }))
        let { tokens } = JSON.parse(tokensFile)
        if (tokens.includes(crypto.createHash('sha256').update(req.cookies.configtoken).digest('hex'))) { // If the configuration token is in the tokens, return true, else false
            let settings = {} // Set the baseline settngs
            let confinterim
            let conf
            if (fs.existsSync(path.join(__dirname, '..', 'configs', 'confinterim.json'))) { // If conf and conf interim exist, give them values, else leave undefined
                confinterim = require('../../../configs/confinterim.json')
            }
            if (fs.existsSync(path.join(__dirname, '..', 'configs', 'conf.json'))) {
                conf = require('../../../configs/conf.json')
            }

            for (settingIndex in range(0, uniconf.countvisiblesettings)) { // For each setting that is not sensitive, find the best value. The most up to date one is likely to be in conf interim
                let setting = uniconf.settings[settingIndex]
                let settingIdentifier = setting[0]
                let settingValue = setting[1]
                if (confinterim && confinterim[settingIdentifier] !== undefined) { // Use strict checking so that no blank settings like "table prefix" are classed as undefined
                    settings[settingIdentifier] = confinterim[settingIdentifier]
                } else if (conf && conf[settingIdentifier] !== undefined) { // Use the values that are set in conf/conf interim before resorting to the uniconf
                    settings[settingIdentifier] = conf[settingIdentifier]
                } else {
                    settings[settingIdentifier] = settingValue
                }
            }

            res.json(settings) // This is way less janky than when this was part of confPage.js
        } else {
            res.json({ error: "TOKEN_INVALID" })
        }
    }
})

module.exports = router;