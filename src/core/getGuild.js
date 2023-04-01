/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: geteGuild.js                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getGuilds = require("./getUserGuilds");
let guildJSON

async function getGuild(id, guilds) {
    //console.log(guilds)
    guilds.forEach(guild => {
        if (guild.id == id) guildJSON = guild;
    })
    return guildJSON
}

module.exports = getGuild;