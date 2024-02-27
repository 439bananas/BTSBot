/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: fetchGuild.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { getGuildPresence } from './checkBotInGuild'

async function fetchGuild(id) { // Fetch the guild by its ID
    try {
        return (await getGuildPresence(id))
    } catch (err) {
        return { id: "0", permissions: 0 }
    }
}

export default fetchGuild