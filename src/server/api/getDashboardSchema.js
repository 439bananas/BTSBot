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

import { Router } from 'express'
const router = Router()
import { readdirSync } from 'fs'
import { join } from 'path'
import pkg from 'read-yaml';
const { sync } = pkg;
import { excludedDashboardFiles } from '../../configs/features.json'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const edf = excludedDashboardFiles

export async function getDashSchema() {
    let listing = await readdirSync(join(__dirname, '..', 'src', 'server', 'dashboard')) // Get the directory listing
    let cats = []
    let menus = {}
    for (let configName of listing) { // For each file, read the file and send the metadata back to the user
        if (configName.split('.')[1].toLowerCase() == "yaml" && !edf.includes(configName.split('.')[1].toLowerCase())) {
            let config = sync(join(__dirname, '..', 'src', 'server', 'dashboard', configName))
            cats.push({
                name: configName.split('.')[0],
                title: config.title,
                emoji: config.emoji,
                description: config.description
            })
            menus[configName.split('.')[0]] = { schema: config } // Send menus along, since React otherwise throws fits
        }
    }
    return {cats: cats, menus: menus}
}

const schema = await getDashSchema()
void schema

router.get('/', async (req, res) => {
    res.json({
        itemDescriptions: schema.cats,
        items: schema.menus
    })
})

export default router;