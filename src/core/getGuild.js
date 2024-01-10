/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: getGuild.js                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

function getGuild(id, guilds) {
    let guildJSON = {id: "0", permissions: 0}
    guilds.forEach(guild => {
        if (guild.id == id) guildJSON = guild;
    })
    return guildJSON
}

module.exports = getGuild;