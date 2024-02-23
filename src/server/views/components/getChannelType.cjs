/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                dFile: getChannelType.cjs                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

function getChannelType(typeInt) {
    let type
    switch (typeInt) {
        case 0:
            type = "GUILD_TEXT"
            break;
        case 1:
            type = "DM"
            break;
        case 2:
            type = "GUILD_VOICE"
            break;
        case 3:
            type = "GROUP_DM"
            break;
        case 4:
            type = "GUILD_CATEGORY"
            break;
        case 5:
            type = "GUILD_ANNOUNCEMENT"
            break;
        case 10:
            type = "ANNOUNCEMENT_THREAD"
            break;
        case 11:
            type = "PUBLIC_THREAD"
            break;
        case 12:
            type = "PRIVATE_THREAD"
            break;
        case 13:
            type = "GUILD_STAGE_VOICE"
            break;
        case 14:
            type = "GUILD_DIRECTORY"
            break;
        case 15:
            type = "GUILD_FORUM"
            break;
        case 16:
            type = "GUILD_MEDIA"
            break;
        default:
            type = "NONE"
            break;
    }
    return type
}

module.exports = getChannelType