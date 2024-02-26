/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: getGuild.cjs                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fetchGuild = require("./fetchGuild");

async function getGuild(id, guilds, isMod) {
    let guildJSON = {id: "0", permissions: 0}
    guilds.forEach(guild => {
        if (guild.id == id) guildJSON = guild;
    })

    if (guildJSON.id == 0 && isMod) {
        guildJSON = await fetchGuild(id)
    }

    return guildJSON
}

module.exports = getGuild;