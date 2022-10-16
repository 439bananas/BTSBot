/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getDiscordUserInfo.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

//const fetch = require('node-fetch')
const fs = require('fs')
const getlang = require('./getLanguageJSON')
let cache = {} // Set it as a variable, it's not important if we have to cache them all again if restart
let avatarurl
let avatarfilename
let response

async function fetchDiscordUser(bearertoken) {
    try {
        let fetchRes = await fetch('https://discord.com/api/v10/users/@me', { // We were going to properly check for scopes except it made loading the page for the first time per new bearer token per session that the bot is running incredibly slow
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearertoken}`
            }
        })
        response = await fetchRes.json()
    } catch (err) {
        if (err.name == "FetchError") {
            throw "CANNOT_CONNECT_TO_DISCORD"
        } else {
            log.error(err)
            throw "UNKNOWN_ERROR"
        }
    }
}

function requireValidDiscordUserResp(discordUserResp) {
    if (discordUserResp.message == "401: Unauthorized") { // If unauthorized, we have a bad access token
        throw "BAD_ACCESS_TOKEN"
    }
    else if (!(discordUserResp.email && discordUserResp.discriminator)) { // We do at least need the identify and email scopes...
        throw "WRONG_SCOPES"
    }
}

async function getDiscordUser(bearertoken) { // Get the user's info from their bearer token
    try {
        let cachedInfo = await redisConnection.json.get('DiscordBearerToken:' + bearertoken)
        if (cachedInfo == null) {
            await fetchDiscordUser(bearertoken) // Fetch our user
            await requireValidDiscordUserResp(response) // Throw errors if anything bad happens
            if (response.email && response.discriminator) { // If we have the email and discriminator, we should be good
                redisConnection.json.set('DiscordBearerToken:' + bearertoken, '$', response) // Cache our response
                redisConnection.expire('DiscordBearerToken:' + bearertoken, 86400) // This should expire in a day if anything
                // We were previously using a method where we had a cache object and put things in that but we figured on different platforms it would cause stability/performance/resources problems and could potentially hang devices like Raspberry Pi so we switched to Redis
                if (response.avatar == null) { // If we have no profile picture, do the magic calculation! https://discord.com/developers/docs/reference#image-formatting
                    avatarfilename = response.discriminator % 5
                    avatarurl = 'https://cdn.discordapp.com/embed/avatars/' + avatarfilename + ".png"
                } else { // If we do have one, set the link to this.
                    avatarfilename = response.avatar
                    avatarurl = 'https://cdn.discordapp.com/avatars/' + response.id + "/" + avatarfilename
                }
                try {
                    fetchRes = await fetch(avatarurl, { // Get and cache the profile picture
                        method: "GET"
                    })
                    res = await fetchRes.blob() // Plonk it into a blob (this part was pretty annoying to learn ngl)
                } catch (err) {
                    log.error(err) // Shouldn't have any errors...
                    throw "UNKNOWN_ERROR"
                }
                let lang = getlang() // Get our language (fun fact, this was the time when I realised maybe I should have an optional argument for the user's ID)
                if (!fs.existsSync('./cache')) { // Check for directory named "cache" in the root, if it doesn't exist, create it
                    log.info(translate(lang, 'log_nocachedir'))
                    fs.mkdirSync('cache') // Cache directory comes before anything else
                }
                if (!fs.existsSync('./cache/profile-pictures')) { // Check for profile picture cache directory, repeat the same if not exist
                    log.info(translate(lang, 'log_nopfpcachedir'))
                    fs.mkdirSync('cache/profile-pictures')
                }
                const arrayBuffer = await res.arrayBuffer(); // Define the array buffer
                const buffer = Buffer.from(arrayBuffer); // Get the buffer itself
                const outputFileName = `cache/profile-pictures/${avatarfilename}.png` // The file should be saved here (easiest and most convenient)
                const stream = fs.createWriteStream(outputFileName) // Define writing the file
                stream.write(buffer) // Hey let's actually write it!
                stream.close(); // Closing the file else the operating system will complain at anyone else attempting to access it until BTS Bot stops
                log.info(translate(lang, "log_cacheduserpfppart1") + response.username + "#" + response.discriminator + " (" + response.id + ")" + translate(lang, "log_cacheduserpfppart2") + path.join(__dirname, 'cache', 'profile-pictures', avatarfilename + ".png")) // Very long.
                return response // Let's return also the user information that the caller actually requested
            } else { // If something weird, we possibly have an error, v10 shouldn't from this point in have any breaking changes (they should be issued in v11 or so)
                log.error(response.message)
                throw "UNKNOWN_ERROR"
            }
        } else {
            return cachedInfo;
        }
    } catch (err) {
        log.error(err)
        throw "UNKNOWN_ERROR"
    }
}

module.exports = getDiscordUser