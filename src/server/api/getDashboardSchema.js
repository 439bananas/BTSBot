/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getDashboardSchema.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const read = require('read-yaml')
const { excludedDashboardFiles } = require('../../configs/features.json')
const edf = excludedDashboardFiles

router.get('/', async (req, res, next) => {
    let listing = await fs.readdirSync(path.join(__dirname, '..', 'src', 'server', 'dashboard')) // Get the directory listing
    let cats = []
    for (configName of listing) { // For each file, check if they're YAML or YML, then read those files and send the metadata back to the user
        if ((configName.split('.')[1].toLowerCase() == "yml" || configName.split('.')[1].toLowerCase() == "yaml") && !edf.includes(configName.split('.')[1].toLowerCase())) {
            let config = read.sync(path.join(__dirname, '..', 'src', 'server', 'dashboard', configName))
            cats.push({
                name: configName.split('.')[0],
                title: config.title,
                emoji: config.emoji,
                description: config.description
            })
        }
    }

    res.json({
        items: cats
    })
})

router.get('/*', (req, res, next) => {
    let type
    if (req.query.type == "yml") { // Add compatibility for YML
        type = "yml"
    } else {
        type = "yaml"
    }
    if (fs.existsSync(path.join(__dirname, '..', 'src', 'server', 'dashboard', req.url.split('/')[1].split('?')[0] + '.' + type)) && !edf.includes(req.url.split('/')[1].split('?')[0].toLowerCase())) { // If you want YML, you must explicitly mention that, else defaults to YAML
        let config = read.sync(path.join(__dirname, '..', 'src', 'server', 'dashboard', req.url.split('/')[1].split('?')[0] + '.' + type)) // Long and janky
        res.json(config)
    } else {
        res.status(404)
        res.end()
    }
})

module.exports = router;