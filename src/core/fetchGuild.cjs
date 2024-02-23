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

async function fetchGuild(id) { // Fetch the guild by its ID
    
    try {
        const rawResponse = await fetch('https://discord.com/api/v10/guilds/' + id, {
            headers: {

            }
        })
        const response = await rawResponse.json()

        console.log(id)

        console.log(response)
    } catch (err) {
        return { id: "0", permissions: 0 }
    }
}

module.exports = fetchGuild