/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: fetchGuild.cjs                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import botInGuild, { getGuildPresence } from './checkBotInGuild.js'

async function fetchGuild(id) { // Fetch the guild by its ID
    try {
        return (await getGuildPresence(id))
    } catch (err) {
        return { id: "0", permissions: 0 }
    }
}

module.exports = fetchGuild