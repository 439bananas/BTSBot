/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File: getDashboardSchema.cjs               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
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
    let menus = {}
    for (configName of listing) { // For each file, read the file and send the metadata back to the user
        if (configName.split('.')[1].toLowerCase() == "yaml" && !edf.includes(configName.split('.')[1].toLowerCase())) {
            let config = read.sync(path.join(__dirname, '..', 'src', 'server', 'dashboard', configName))
            cats.push({
                name: configName.split('.')[0],
                title: config.title,
                emoji: config.emoji,
                description: config.description
            })
            menus[configName.split('.')[0]] = { schema: config } // Send menus along, since React otherwise throws fits
        }
    }

    res.json({
        itemDescriptions: cats,
        items: menus
    })
})

module.exports = router;