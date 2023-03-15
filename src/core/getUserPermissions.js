/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getUserPermissions.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const getGuilds = require("./getUserGuilds")

async function getUserPermissions(guild) {
    let permissions = [] // Permissions should be definitely an array
    let permissionsint // Initialise permissions integer
    permissionsint = guild.permissions
    if (permissionsint) {
        let reversedPermsInt = parseInt(permissionsint).toString(2).split("") // Let's convert the permissions to binary and reverse them. In Discord, a permissions integer is a bitwise number, in that any single bit will determine a single switch. As such, the integer gets converted to binary. 
        reversedPermsInt = reversedPermsInt.reverse() // It's reversed because permissions integers are different lengths and as such, it's a lot easier to work with a reversed binary number than not, especially when finding permissions by their respective bits is documented by Discord in the manner of bit shifts
        for (permissionString in reversedPermsInt) { // For each bit in the binary number, check the permission that the bit accords to
            let permission = +permissionString // Convert to number because for some reason JavaScript is weird
            if (reversedPermsInt[permission] == 1) { // If the permission on this index is true:
                switch (permission) {
                    case 0: // Look at the position in the reversed permissions integer (thanks Discord Developer Documentation for this) and add the respective permission to the permissions array
                        permissions.push("CREATE_INSTANT_INVITE")
                        break;
                    case 1:
                        permissions.push("KICK_MEMBERS")
                        break;
                    case 2:
                        permissions.push("BAN_MEMBERS")
                        break;
                    case 3:
                        permissions.push("ADMINISTRATOR")
                        break;
                    case 4:
                        permissions.push("MANAGE_CHANNELS")
                        break;
                    case 5:
                        permissions.push("MANAGE_GUILD")
                        break;
                    case 6:
                        permissions.push("ADD_REACTIONS")
                        break;
                    case 7:
                        permissions.push("VIEW_AUDIT_LOG")
                        break;
                    case 8:
                        permissions.push("PRIORITY_SPEAKER")
                        break;
                    case 9:
                        permissions.push("STREAM")
                        break;
                    case 10:
                        permissions.push("VIEW_CHANNEL")
                        break;
                    case 11:
                        permissions.push("SEND_MESSAGES")
                        break;
                    case 12:
                        permissions.push("SEND_TTS_MESSAGES")
                        break;
                    case 13:
                        permissions.push("MANAGE_MESSAGES")
                        break;
                    case 14:
                        permissions.push("EMBED_LINKS")
                        break;
                    case 15:
                        permissions.push("ATTACH_FILES")
                        break;
                    case 16:
                        permissions.push("READ_MESSAGE_HISTORY")
                        break;
                    case 17:
                        permissions.push("MENTION_EVERYONE")
                        break;
                    case 18:
                        permissions.push("USE_EXTERNAL_EMOJIS")
                        break;
                    case 19:
                        permissions.push("VIEW_GUILD_INSIGHTS")
                        break;
                    case 20:
                        permissions.push("CONNECT")
                        break;
                    case 21:
                        permissions.push("SPEAK")
                        break;
                    case 22:
                        permissions.push("MUTE_MEMBERS")
                        break;
                    case 23:
                        permissions.push("DEAFEN_MEMBERS")
                        break;
                    case 24:
                        permissions.push("MOVE_MEMBERS")
                        break;
                    case 25:
                        permissions.push("USE_VAD")
                        break;
                    case 26:
                        permissions.push("CHANGE_NICKNAME")
                        break;
                    case 27:
                        permissions.push("MANAGE_NICKNAMES")
                        break;
                    case 28:
                        permissions.push("MANAGE_ROLES")
                        break;
                    case 29:
                        permissions.push("MANAGE_WEBHOOKS")
                        break;
                    case 30:
                        permissions.push("MANAGE_EMOJIS_AND_STICKERS")
                        break;
                    case 31:
                        permissions.push("USE_APPLICATION_COMMANDS")
                        break;
                    case 32:
                        permissions.push("REQUEST_TO_SPEAK")
                        break;
                    case 33:
                        permissions.push("MANAGE_EVENTS")
                        break;
                    case 34:
                        permissions.push("MANAGE_THREADS")
                        break;
                    case 35:
                        permissions.push("CREATE_PUBLIC_THREADS")
                        break;
                    case 36:
                        permissions.push("CREATE_PRIVATE_THREADS")
                        break;
                    case 37:
                        permissions.push("USE_EXTERNAL_STICKERS")
                        break;
                    case 38:
                        permissions.push("SEND_MESSAGES_IN_THREADS")
                        break;
                    case 39:
                        permissions.push("USE_EMBEDDED_ACTIVITIES")
                        break;
                    case 40:
                        permissions.push("MODERATE_MEMBERS")
                        break;
                    case 41:
                        permissions.push("VIDEO") // Undocumented but I think that's the name of 1 << 41? Please create a PR if the documentation gets updated for this! https://discord.com/developers/docs/topics/permissions
                        break;
                }
            }
        }
    }
    return permissions // Whether or not the user is in the requested guild, return the permissions for the guild. If the user is not in the guild the array will be blank all along.
}

module.exports = getUserPermissions