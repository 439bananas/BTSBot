/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: getUserLang.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getDiscordUser = require('./getDiscordUserInfo')

async function getUserLang(user) {
    if (typeof (user) == "object") { // If object, treat as if it was req
        if (!user.cookies.discordbearertoken) { // If no bearer token, use the user's locale
            return user.locale.toString();
        } else {
            try {
                let userInfo = await getDiscordUser(user.cookies.discordbearertoken) // Get the user in question if there is a bearer token
                let query = await MySQLConnection.query('SELECT language FROM User WHERE id=?', userInfo.id) // Attempt to get user's language from the database
                if (query[0] == undefined) { // If not in database, return user's locale
                    return userInfo.locale.toString()
                } else {
                    return query[0][0].language // If it is in the database, return their configured language
                }
            } catch (err) {
                return user.locale.toString(); // If any failures like bad bearer token, return the user's locale
            }
        }
    } else if (typeof (user) == "number" || typeof (user) == "string") { // If the type is a number or string, treat the parameter as if it was an ID
        return getlang(true, user) // Use the getlang() API to query the database
    } else {
        return getlang() // Get the default language if undefined
    }
}

module.exports = getUserLang;